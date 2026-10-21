#!/usr/bin/env node
'use strict';

/**
 * apitoken-bulk-apikey CLI — mint Genvís AI (apitoken.fun) accounts, one API
 * key per account, and keep only the keys that survived a live chat call.
 *
 * The panel is a New API fork (`/api/status` → `system_name:"Genvís AI"`,
 * `server_address:genvis.xyz`): e-mail verification ON, captcha OFF
 * (`turnstile_check:false`, no turnstile script on the register page), check-in
 * OFF, and **1,000,000 quota units on signup at qpu=500,000 → $2 per
 * account** — real money, measured: two chats moved `quota` 1,000,000 →
 * 999,992 with `used_quota:8, request_count:2`.
 *
 * Flow, per account, every panel request through one pinned exit from your pool:
 *   1. mailbox    Emailnator `POST /api/generate-email` → a fresh @gmail.com
 *                 (registered in the dot-free plain form)
 *   2. baseline   snapshot the box's message ids BEFORE the code is asked for
 *   3. status     `GET /api/status` → gates (register on, e-mail verification on)
 *   4. send code  `GET /api/verification?email=…` → panel mails a 6-character
 *                 hex code (10-minute window)
 *   5. code       poll Emailnator (`/api/message-list` → `/api/message/<id>`).
 *                 The box is a RECYCLED shared inbox and carries other people's
 *                 mail (measured: a PopGo API code, SHEIN, Tensor.Art …), so a
 *                 code is accepted only from a message that is (a) NEWER than
 *                 the baseline and (b) names THIS panel — sender domain
 *                 `mail.genvis.xyz`, subject `Genvís AI邮箱验证邮件`,
 *                 body `…您的验证码为: <6 hex>`. A foreign code registered
 *                 once in the lab answered "Verification code is incorrect or
 *                 has expired".
 *   6. register   `POST /api/user/register` {username,password,email,
 *                 verification_code}
 *   7. login      `POST /api/user/login` → session cookie + `access_token` JWT
 *                 (this fork needs the Bearer token for /api/user/self)
 *   8. key        `POST /api/token/` in group `default` (fallback: inherit)
 *   9. gate       `POST /v1/chat/completions` (default `deepseek-v4-flash`) →
 *                 200 with content (or `reasoning_content`) = keep, then one
 *                 more `GET /api/user/self` to record the quota the call burned
 *
 * A key is appended to `keys.txt` only after step 9 answers 200 — anything else
 * is recorded in `accounts.jsonl` and retried on the next run. The panel's
 * 6-hex code mail is slow (measured 157–176 s after the send, against a 300 s
 * window) and the send endpoint throttles under bursts: the CLI backs off ~20 s
 * and rotates to a fresh mailbox (up to 5 per account).
 *
 * Options:
 *   --count N        accounts (= keys) to mint                        [5]
 *   --conc N         accounts in flight at once, max 4                [1]
 *   --gap MS         pause between accounts                           [1200]
 *   --model <id>     model used for the live gate       [deepseek-v4-flash]
 *   --group <name>   token group the key is created in   [default]
 *   --alt-groups G   fallback groups, comma separated ('inherit' = the
 *                    account's own group)
 *   --mail-window S  seconds to wait for the e-mail code                [300]
 *   --pool <file>    proxy list, one exit per line (env APITOKEN_PROXIES) [optional]
 *   --tries N        exits tried per account before giving up           [2]
 *   --timeout MS     per-request timeout                             [60000]
 *   --limit N        cap the keys --verify-only walks (0 = all)           [0]
 *   --verify-only    re-run every key in keys.txt through the chat gate
 *   --screen         only test the proxy list against Genvís AI
 *   --connect-9router  register this provider (and one key) on a local 9Router
 *   --help
 *
 * Zero dependencies. Node.js >= 18. Your proxy list is OPTIONAL: pass `--pool`
 * (or the APITOKEN_PROXIES env) and every request goes through an exit from it;
 * without a pool the tool connects directly.
 */

const fs = require('fs');
const path = require('path');
const net = require('net');
const tls = require('tls');
const http = require('http');
const crypto = require('crypto');

const ROOT = path.basename(__dirname) === 'src' ? path.resolve(__dirname, '..') : __dirname;
const KEYS_FILE = path.join(ROOT, 'keys.txt');
const ACCOUNTS_FILE = path.join(ROOT, 'accounts.jsonl');
const OUT_DIR = path.join(ROOT, 'out');

const BASE = 'https://apitoken.fun';
const EMAILNATOR = 'https://www.emailnator.com';
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36';

// ------------------------------------------------------------------- options
const argv = process.argv.slice(2);
function arg(name, dflt) {
  const eq = argv.find((a) => a.startsWith(`--${name}=`));
  if (eq) return eq.slice(name.length + 3);
  const i = argv.indexOf(`--${name}`);
  if (i !== -1 && argv[i + 1] && !argv[i + 1].startsWith('--')) return argv[i + 1];
  return dflt;
}
const has = (name) => argv.includes(`--${name}`) || argv.includes(`-${name}`);

if (has('help') || has('h')) {
  console.log(`apitoken-bulk-apikey — mint Genvís AI (apitoken.fun) accounts, one key each, verified by a live chat call.

  node src/cli.js --count 5          mint (a key is kept only after a chat 200)
  node src/cli.js --verify-only      re-check every key in keys.txt
  node src/cli.js --screen           test your proxy list against Genvís AI
  node src/cli.js --connect-9router  register the provider + one key on a local 9Router
  node src/cli.js --help

  --count N        accounts to mint                                        [5]
  --conc N         accounts in flight (max 4)                              [1]
  --model <id>     model used for the live gate       [deepseek-v4-flash]
  --group <name>   token group the key is created in                 [default]
  --alt-groups G   fallback groups, comma separated ('inherit' = own group)
  --mail-window S  seconds to wait for the e-mail code                    [300]
  --pool <file>    proxy list, one exit per line (env APITOKEN_PROXIES) [optional]
  --limit N        cap the keys --verify-only walks (0 = all)               [0]

Requests go through the exits in your proxy list when one is provided (--pool
or the APITOKEN_PROXIES env). Without a pool the tool connects DIRECTLY.

No captcha on this panel. The key is written to keys.txt only after
/v1/chat/completions answers 200 with real content.`);
  process.exit(0);
}

const COUNT = Math.max(1, parseInt(arg('count', '5'), 10) || 5);
const CONC = Math.min(4, Math.max(1, parseInt(arg('conc', '1'), 10) || 1));
const GAP_MS = Math.max(0, parseInt(arg('gap', '1200'), 10) || 0);
const TRIES = Math.max(1, parseInt(arg('tries', '2'), 10) || 2);
const TIMEOUT_MS = Math.max(5000, parseInt(arg('timeout', '60000'), 10) || 60000);
const MAIL_WINDOW_MS = Math.max(30, parseInt(arg('mail-window', '300'), 10) || 300) * 1000;
const MODEL = arg('model', process.env.APITOKEN_MODEL || 'deepseek-v4-flash');
const GROUP = arg('group', 'default');
const ALT_GROUPS = arg('alt-groups', '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)
  .map((g) => (g === 'inherit' ? '' : g));
const LIMIT = Math.max(0, parseInt(arg('limit', '0'), 10) || 0);
const VERIFY_ONLY = has('verify-only');
const SCREEN = has('screen');
const CONNECT_9ROUTER = has('connect-9router');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
fs.mkdirSync(OUT_DIR, { recursive: true });
const log = (...a) => console.log(`[${new Date().toISOString().slice(11, 19)}]`, ...a);
const randUser = () => `at${crypto.randomBytes(3).toString('hex')}`;
const randPass = () => `Cw${crypto.randomBytes(4).toString('hex')}!${Math.floor(Math.random() * 900 + 100)}`;

// ------------------------------------------------------------------- proxy
function parseProxy(line) {
  const s = String(line || '').trim();
  if (!s || s.startsWith('#')) return null;
  let m = s.match(/^(https?|socks5h?|socks4):\/\/(?:([^:@/]+):([^@/]+)@)?([^:/]+):(\d+)/i);
  if (!m) m = s.match(/^(?:([^:@/]+):([^@/]+)@)?([^:/]+):(\d+)$/);
  if (!m) return null;
  if (m.length === 6) {
    const raw = m[1].toLowerCase();
    if (raw === 'socks4') return null; // socks4 is not supported by this client
    const protocol = raw.startsWith('socks') ? 'socks5' : 'http';
    return { protocol, host: m[4], port: Number(m[5]), auth: m[2] ? `${m[2]}:${m[3]}` : null, line: s };
  }
  return { protocol: 'http', host: m[3], port: Number(m[4]), auth: m[1] ? `${m[1]}:${m[2]}` : null, line: s };
}

/** A raw socket straight to host:port (no proxy) — the direct-mode twin of connectThrough. */
function directConnect(host, port, timeoutMs) {
  return new Promise((resolve, reject) => {
    const sock = net.connect({ host, port });
    const t = setTimeout(() => { sock.destroy(); reject(new Error(`connect timeout (${host}:${port})`)); }, timeoutMs);
    sock.once('error', (e) => { clearTimeout(t); try { sock.destroy(); } catch {} reject(new Error(`connect failed: ${e.message}`)); });
    sock.once('connect', () => { clearTimeout(t); resolve(sock); });
  });
}

function connectThrough(proxy, host, port, timeoutMs) {
  return new Promise((resolve, reject) => {
    const sock = net.connect({ host: proxy.host, port: proxy.port });
    const t = setTimeout(() => { sock.destroy(); reject(new Error(`proxy timeout (${proxy.host}:${proxy.port})`)); }, timeoutMs);
    const done = (err, s) => { clearTimeout(t); if (err) { try { sock.destroy(); } catch {} reject(err); } else resolve(s); };
    sock.once('error', (e) => done(new Error(`proxy connect failed: ${e.message}`)));
    sock.once('connect', () => {
      if (proxy.protocol === 'socks5') {
        sock.write(proxy.auth ? Buffer.from([5, 2, 0, 2]) : Buffer.from([5, 1, 0]));
        let stage = 0;
        let buf = Buffer.alloc(0);
        const sendConnect = () => {
          const hb = Buffer.from(host);
          sock.write(Buffer.concat([Buffer.from([5, 1, 0, 3, hb.length]), hb, Buffer.from([port >> 8, port & 0xff])]));
        };
        const onData = (d) => {
          try {
            buf = Buffer.concat([buf, d]);
            for (;;) {
              if (stage === 0) {
                if (buf.length < 2) return;
                const v = buf; buf = buf.slice(2);
                if (v[0] !== 5) return done(new Error('SOCKS5 bad version'));
                if (v[1] === 2) {
                  if (!proxy.auth) return done(new Error('SOCKS5 auth required'));
                  const [u, p] = proxy.auth.split(':');
                  sock.write(Buffer.concat([Buffer.from([1, u.length]), Buffer.from(u), Buffer.from([p.length]), Buffer.from(p)]));
                  stage = 1;
                  continue;
                }
                if (v[1] !== 0) return done(new Error('SOCKS5 no acceptable method'));
                stage = 2; sendConnect(); continue;
              }
              if (stage === 1) {
                if (buf.length < 2) return;
                const v = buf; buf = buf.slice(2);
                if (v[1] !== 0) return done(new Error('SOCKS5 auth failed'));
                stage = 2; sendConnect(); continue;
              }
              if (stage === 2) {
                if (buf.length < 5) return;
                const atyp = buf[3];
                const need = 4 + (atyp === 1 ? 4 : atyp === 3 ? 1 + buf[4] : 16) + 2;
                if (buf.length < need) return;
                const rep = buf[1]; buf = buf.slice(need);
                if (rep !== 0) return done(new Error(`SOCKS5 connect failed (code ${rep})`));
                sock.off('data', onData);
                return done(null, sock);
              }
            }
          } catch (e) { done(e); }
        };
        sock.on('data', onData);
        return;
      }
      const auth = proxy.auth ? `Proxy-Authorization: Basic ${Buffer.from(proxy.auth).toString('base64')}\r\n` : '';
      sock.write(`CONNECT ${host}:${port} HTTP/1.1\r\nHost: ${host}:${port}\r\n${auth}\r\n`);
      let buf = '';
      const onData = (d) => {
        buf += d;
        if (!buf.includes('\r\n\r\n')) return;
        sock.off('data', onData);
        if (!/^HTTP\/\d(\.\d)? 200/.test(buf)) return done(new Error(`proxy CONNECT refused: ${buf.split('\r\n')[0]}`));
        done(null, sock);
      };
      sock.on('data', onData);
    });
  });
}

/** One HTTPS request through one exit (or directly). Returns { status, headers, body }. */
async function exitFetch(proxy, url, { method = 'GET', headers = {}, body = null, timeoutMs = TIMEOUT_MS } = {}) {
  const u = new URL(url);
  const raw = proxy ? await connectThrough(proxy, u.hostname, u.port || 443, timeoutMs) : await directConnect(u.hostname, u.port || 443, timeoutMs);
  const sock = tls.connect({ socket: raw, servername: u.hostname });
  await new Promise((res, rej) => { sock.once('secureConnect', res); sock.once('error', rej); });
  const chunks = [];
  let resolve, reject;
  const p = new Promise((res, rej) => { resolve = res; reject = rej; });
  const req = http.request({
    method,
    path: u.pathname + u.search,
    createConnection: () => sock,
    headers: { host: u.host, 'user-agent': UA, accept: '*/*', ...headers },
  });
  const t = setTimeout(() => { try { req.destroy(); } catch {} reject(new Error('request timeout')); }, timeoutMs);
  req.on('response', (res) => {
    res.on('data', (c) => chunks.push(c));
    res.on('end', () => {
      clearTimeout(t);
      resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(chunks).toString('utf8') });
    });
  });
  req.on('error', (e) => { clearTimeout(t); reject(e); });
  if (body != null) req.write(Buffer.isBuffer(body) ? body : Buffer.from(typeof body === 'string' ? body : JSON.stringify(body)));
  req.end();
  return p;
}

async function exitJson(proxy, url, opts = {}) {
  const headers = { ...(opts.headers || {}) };
  let body = opts.body;
  if (body != null && !Buffer.isBuffer(body)) {
    headers['content-type'] = 'application/json';
  }
  const r = await exitFetch(proxy, url, { ...opts, headers });
  let json = null;
  try { json = JSON.parse(r.body); } catch { /* not json */ }
  return { status: r.status, json, text: r.body, headers: r.headers };
}

// ------------------------------------------------------------------- panel session
/**
 * One account's session: the cookie jar this fork needs (the pending
 * verification code is tied to the session that asked for it) plus the
 * Bearer/`New-Api-User` pair when login ships one. Kept per account so
 * concurrent accounts never share state.
 */
function newSession() {
  return { cookie: '', auth: {} };
}

function mergeCookies(session, headers) {
  const raw = headers && headers['set-cookie'];
  if (!raw || !raw.length) return;
  const jar = new Map(
    session.cookie
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => [s.split('=')[0], s])
  );
  for (const c of raw) {
    const pair = c.split(';')[0];
    const name = pair.split('=')[0];
    if (name) jar.set(name, pair);
  }
  session.cookie = [...jar.values()].join('; ');
}

/** One panel call: origin/referer + session cookie + (opt-in) auth headers. */
async function panelFetch(exit, session, pathname, { method = 'GET', body = null, auth = false, headers = {}, timeoutMs = 30000 } = {}) {
  const h = {
    accept: 'application/json, text/plain, */*',
    'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8',
    origin: BASE,
    referer: `${BASE}/`,
    ...headers,
  };
  if (session.cookie) h.cookie = session.cookie;
  if (auth && session.auth.token) h.authorization = `Bearer ${session.auth.token}`;
  if (auth && session.auth.uid) h['new-api-user'] = String(session.auth.uid);
  const r = await exitJson(exit, `${BASE}${pathname}`, { method, body, headers: h, timeoutMs });
  mergeCookies(session, r.headers);
  return r;
}

// ------------------------------------------------------------------- pool
function loadExits() {
  const poolArg = arg('pool', process.env.APITOKEN_PROXIES || 'proxies.txt');
  const poolFile = fs.existsSync(path.resolve(poolArg)) ? path.resolve(poolArg) : path.resolve(ROOT, poolArg);
  if (!fs.existsSync(poolFile)) {
    // No pool = DIRECT mode: a proxy is recommended at scale (per-IP limits,
    // bans) but the tool works without one. `null` is the direct sentinel.
    console.log(`no proxy list at ${poolFile} — running WITHOUT a proxy (direct). Put exits there (or pass --pool) to route through them.`);
    return [null];
  }
  const exits = fs.readFileSync(poolFile, 'utf8').split(/\r?\n/).map(parseProxy).filter(Boolean);
  if (!exits.length) {
    console.log(`${poolFile} has no usable exits — running WITHOUT a proxy (direct).`);
    return [null];
  }
  return exits;
}

async function screen(exits) {
  let ok = 0;
  for (const e of exits.slice(0, 64)) {
    try {
      const t0 = Date.now();
      const r = await exitFetch(e, `${BASE}/api/status`, { timeoutMs: 20000 });
      const good = r.status === 200 && /"success"/.test(r.body);
      if (good) ok++;
      console.log(`  ${good ? '✔' : '✘'} ${e ? `${e.host}:${e.port}` : 'direct'} status=${r.status} ${Date.now() - t0}ms`);
    } catch (err) {
      console.log(`  ✘ ${e ? `${e.host}:${e.port}` : 'direct'} ${String(err.message).slice(0, 80)}`);
    }
  }
  console.log(`screened ${Math.min(exits.length, 64)} exit(s): ${ok} reach ${BASE}`);
  return ok;
}

// ------------------------------------------------------------------- mail
async function newMailbox(exit) {
  const r = await exitJson(exit, `${EMAILNATOR}/api/generate-email`, {
    method: 'POST',
    body: { ids: [3] },
    headers: { origin: EMAILNATOR, referer: `${EMAILNATOR}/` },
  });
  const dotted = r.json && r.json.email;
  if (!dotted || !/@gmail\.com$/i.test(dotted)) throw new Error(`emailnator generate ${r.status}: ${String(r.text).slice(0, 120)}`);
  const [local, domain] = dotted.split('@');
  return { rail: 'emailnator', dotted, plain: `${local.replace(/\./g, '')}@${domain}` };
}

/**
 * Codes out of one mail. The panel's mail reads
 * `…您的验证码为: 69430f 验证码 10 分钟内有效…` — 6 hex characters, before or
 * after the label — so both orders are captured (plus a bare hex fallback).
 */
function codeCandidates(text) {
  const blob = String(text || '');
  const out = [];
  for (const re of [
    /([0-9a-f]{6})[^0-9a-z]{0,10}(?:验证码|校验码)/i,
    /(?:验证码|校验码|verification\s*code)[^0-9a-z]{0,16}([0-9a-f]{6})\b/i,
    /\b([0-9a-f]{6})\b/i,
  ]) {
    const m = re.exec(blob);
    if (m) out.push(m[1]);
  }
  return [...new Set(out)];
}

/** The panel's own code mail: sender domain `mail.genvis.xyz`, subject `Genvís AI邮箱验证邮件`. */
const BRAND = /genv[íi]s|genvis\.xyz|apitoken/i;
const flatten = (html) => String(html || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/gi, ' ');

/**
 * Message ids already sitting in the box. This inbox is a RECYCLED shared
 * address that receives other people's mail (measured on this rail: a PopGo API
 * code, SHEIN, Tensor.Art …), so anything present before the code was asked for
 * is refused. Emailnator re-indexes the box on every call, hands out fresh ids
 * and stamps its stubs with year-old dates, so this list is best-effort only —
 * the brand gate below is what actually seals the box.
 */
async function snapshot(exit, box) {
  try {
    const r = await exitJson(exit, `${EMAILNATOR}/api/message-list`, { method: 'POST', body: { email: box.plain, limit: 20 } });
    return new Set((((r.json || {}).messages) || []).map((m) => String(m.id)));
  } catch (e) {
    return new Set();
  }
}

/**
 * Poll the mailbox for the panel's code. Only a mail that is (a) newer than the
 * pre-send snapshot and (b) named after THIS panel gets to supply a code: the
 * shared box is full of other people's verification codes, and one of them
 * registered as "Verification code is incorrect or has expired" in the lab.
 */
async function waitCodes(exit, box, { baseline = new Set(), timeoutMs = MAIL_WINDOW_MS, pollMs = 5000 } = {}) {
  const seen = new Set();
  let foreign = 0;
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    let msgs = [];
    try {
      const r = await exitJson(exit, `${EMAILNATOR}/api/message-list`, { method: 'POST', body: { email: box.plain, limit: 20 } });
      msgs = (r.json && r.json.messages) || [];
    } catch (e) { /* retry */ }
    for (const m of msgs) {
      const id = String(m.id);
      if (!id || baseline.has(id) || seen.has(id)) continue;
      seen.add(id);
      const head = `${m.from || ''} | ${m.subject || ''}`;
      if (/Locked sender/i.test(head)) continue; // emailnator premium stub, no body
      let text = `${m.subject || ''}\n${m.text || ''}`;
      try {
        const full = await exitJson(exit, `${EMAILNATOR}/api/message/${encodeURIComponent(id)}`);
        const j = full.json || {};
        text = `${j.subject || m.subject || ''}\n${flatten(j.content || j.html || '')}\n${j.text || ''}`;
      } catch (e) { /* keep the list preview */ }
      if (!BRAND.test(text.slice(0, 800))) { foreign++; continue; }
      const codes = codeCandidates(text);
      if (codes.length) return codes;
    }
    await sleep(pollMs);
  }
  // No brand mail: never fall back to a foreign code from the shared box.
  if (foreign) console.log(`  (${foreign} foreign mail(s) in the box were ignored)`);
  return null;
}

// ------------------------------------------------------------------- flows
function readKeys() {
  try { return fs.readFileSync(KEYS_FILE, 'utf8').split(/\r?\n/).map((s) => s.trim()).filter(Boolean); } catch { return []; }
}
/** One key per line, no stray blank lines (measured: a naive `'\n' + key` seed inserts one). */
function appendKey(key) {
  let tail = '';
  try { tail = fs.readFileSync(KEYS_FILE, 'utf8'); } catch (e) { tail = ''; }
  fs.appendFileSync(KEYS_FILE, (tail && !tail.endsWith('\n') ? '\n' : '') + key + '\n');
}
function appendAccount(rec) { fs.appendFileSync(ACCOUNTS_FILE, JSON.stringify(rec) + '\n'); }

/**
 * Register one account: mailbox (up to five boxes — Emailnator recycles shared
 * addresses, so an address may already be registered), code request (three
 * tries, ~20 s back-off on 429), the panel's own fresh code out of the shared
 * box, register, login, then the key walk with the live chat gate. Returns the
 * record; `key` is null when no (group × model) pair answered 200 with content.
 */
async function signUp(exit) {
  const session = newSession();
  const username = randUser();
  const password = randPass();

  const st = await panelFetch(exit, session, '/api/status');
  const gates = (st.json && st.json.data) || {};
  if (gates.register_enabled === false) throw new Error('register is disabled on the panel right now');

  let box = null;
  let sent = false;
  let codes = null;
  for (let b = 0; b < 5 && !sent; b++) {
    box = await newMailbox(exit);
    const baseline = await snapshot(exit, box);
    for (let a = 0; a < 3 && !sent; a++) {
      const r = await panelFetch(exit, session, `/api/verification?email=${encodeURIComponent(box.plain)}`, { timeoutMs: 30000 });
      const msg = JSON.stringify((r.json && r.json.message) || r.json || r.text || '').slice(0, 140);
      if (r.json && r.json.success === true) { sent = true; break; }
      if (/频繁|frequent|too many|429/i.test(msg)) { await sleep(20000); continue; }
      break; // EMAIL_EXISTS-style refusals fall through to the next box
    }
    if (sent) codes = await waitCodes(exit, box, { baseline });
  }
  if (!sent) throw new Error('sendCode never accepted (throttled or address rejected on five boxes)');
  if (!codes || !codes.length) throw new Error('no panel code inside the window (foreign mail in the shared box is never accepted)');

  let reg = null;
  let goodCode = null;
  for (const code of codes.slice(0, 3)) {
    for (let a = 0; a < 2 && goodCode === null; a++) {
      const r = await panelFetch(exit, session, '/api/user/register', {
        method: 'POST',
        timeoutMs: 40000,
        body: { username, password, email: box.plain, verification_code: code },
      });
      reg = r;
      if (r.json && r.json.success === true) { goodCode = code; break; }
      const msg = String((r.json && r.json.message) || r.text || '');
      if (r.status === 429 || /频繁|frequent|too many/i.test(msg)) { await sleep(25000); continue; }
      break;
    }
    if (goodCode !== null) break;
    const msg2 = String((reg && reg.json && reg.json.message) || (reg && reg.text) || '');
    if (!/验证码|verification code|incorrect|invalid|expired/i.test(msg2)) break;
  }
  if (goodCode === null) {
    throw new Error(`register refused: ${String((reg && ((reg.json && reg.json.message) || reg.text)) || '-').replace(/\s+/g, ' ').slice(0, 90)}`);
  }

  const li = await panelFetch(exit, session, '/api/user/login', { method: 'POST', body: { username, password }, timeoutMs: 30000 });
  if (!(li.status < 400 && (!li.json || li.json.success !== false))) {
    throw new Error(`login ${li.status}: ${String((li.json && li.json.message) || li.text || '').replace(/\s+/g, ' ').slice(0, 70)}`);
  }
  const ld = (li.json && li.json.data) || {};
  if (ld.access_token) session.auth.token = ld.access_token;
  if (ld.id || ld.user_id) session.auth.uid = ld.id || ld.user_id;

  const me = await panelFetch(exit, session, '/api/user/self', { auth: true });
  const data = (me.json && me.json.data) || {};
  if (data.id && !session.auth.uid) session.auth.uid = data.id;

  // The quota line: this panel pays 1,000,000 units ($2) per signup and bills
  // the account per call, so `used_quota` after the gate is the spend proof.
  let quotaAfter = null;
  let usedAfter = null;

  // Key walk: the caller's group, then inherit (`""`), then --alt-groups.
  const groups = [...new Set([GROUP, '', ...ALT_GROUPS])];
  let key = null;
  let usedGroup = null;
  let chatModel = null;
  let gateSample = null;
  for (const g of groups) {
    const created = await panelFetch(exit, session, '/api/token/', {
      method: 'POST',
      auth: true,
      timeoutMs: 40000,
      body: {
        name: `at-${crypto.randomBytes(3).toString('hex')}`,
        remain_quota: 0,
        expired_time: -1,
        unlimited_quota: true,
        model_limits_enabled: false,
        model_limits: '',
        allow_ips: '',
        group: g,
      },
    });
    const dd = created.json && created.json.data;
    let cand = dd && (dd.key || dd.token);
    if (cand && String(cand).includes('*')) cand = null;
    if (!cand && dd && dd.id) {
      const kr = await panelFetch(exit, session, `/api/token/${dd.id}/key`, { method: 'POST', auth: true, body: {} });
      const kd = kr.json && kr.json.data;
      cand = typeof kd === 'string' ? kd : kd && (kd.key || kd.token);
      if (cand && String(cand).includes('*')) cand = null;
    }
    if (!cand) {
      const tl = await panelFetch(exit, session, '/api/token/?p=0&size=100', { auth: true });
      const items = (tl.json && tl.json.data && (tl.json.data.items || tl.json.data)) || [];
      for (const t2 of Array.isArray(items) ? items : []) {
        if (t2.key && !String(t2.key).includes('*') && String(t2.key).length > 20) { cand = t2.key; break; }
        if (t2.id) {
          const kr = await panelFetch(exit, session, `/api/token/${t2.id}/key`, { method: 'POST', auth: true, body: {} });
          const kd = kr.json && kr.json.data;
          const kk = typeof kd === 'string' ? kd : kd && (kd.key || kd.token);
          if (kk && !String(kk).includes('*')) { cand = kk; break; }
        }
      }
    }
    if (!cand) continue;
    const g2 = await chatGate(exit, cand, MODEL);
    gateSample = `${g2.status} ${g2.sample}`.slice(0, 160);
    if (g2.ok) {
      key = cand;
      usedGroup = g;
      chatModel = MODEL;
      // One billed call must show up on the account: quota down, used up.
      const after = await panelFetch(exit, session, '/api/user/self', { auth: true }).catch(() => null);
      const ad = (after && after.json && after.json.data) || null;
      if (ad) { quotaAfter = ad.quota ?? null; usedAfter = ad.used_quota ?? null; }
      break;
    }
  }

  return {
    username,
    password,
    box,
    uid: data.id,
    group: data.group,
    quota: data.quota,
    usedStart: data.used_quota ?? null,
    quotaAfter,
    usedAfter,
    billed: quotaAfter != null && data.quota != null ? quotaAfter < data.quota : null,
    code: goodCode,
    key,
    usedGroup,
    chatModel,
    gateSample,
  };
}

/** The live gate: 200 + real content (reasoning models answer reasoning_content). */
async function chatGate(exit, key, model = MODEL) {
  const r = await exitJson(exit, `${BASE}/v1/chat/completions`, {
    method: 'POST',
    headers: { authorization: `Bearer ${key}` },
    body: { model, messages: [{ role: 'user', content: 'ping' }], max_tokens: 32, stream: false },
  });
  const msg = r.json && r.json.choices && r.json.choices[0] && r.json.choices[0].message;
  const content = msg && (String(msg.content || '').trim() || String(msg.reasoning_content || '').trim());
  return { ok: r.status === 200 && Boolean(content), status: r.status, sample: String(r.text).slice(0, 140) };
}

async function mint(exits) {
  log(`apitoken (Genvís AI) · ${COUNT} key(s) · conc ${CONC} · model ${MODEL} · group ${GROUP || 'inherit'} · exits ${exits.filter(Boolean).length || 'direct'} · keys land in keys.txt`);
  let made = 0;
  for (let round = 0; round < COUNT; round += CONC) {
    const jobs = [];
    for (let k = 0; k < CONC && round + k < COUNT; k++) {
      const i = round + k;
      jobs.push(
        (async () => {
          let lastErr = null;
          for (let t = 0; t < TRIES; t++) {
            const exit = exits[(i + t) % exits.length];
            try {
              const rec = await signUp(exit);
              const exitLabel = exit ? `${exit.host}:${exit.port}` : 'direct';
              if (!rec.key) {
                lastErr = new Error(`no chat-200 — ${rec.gateSample || 'token mint failed'}`);
                appendAccount({
                  at: new Date().toISOString(),
                  username: rec.username,
                  email: rec.box.plain,
                  rail: rec.box.rail,
                  exit: exitLabel,
                  gate: 'fail',
                  sample: rec.gateSample,
                });
                continue;
              }
              appendKey(rec.key);
              appendAccount({
                at: new Date().toISOString(),
                username: rec.username,
                password: rec.password,
                email: rec.box.plain,
                rail: rec.box.rail,
                uid: rec.uid,
                group: rec.usedGroup,
                chatModel: rec.chatModel,
                quotaStart: rec.quota,
                usedStart: rec.usedStart,
                quotaAfter: rec.quotaAfter,
                usedAfter: rec.usedAfter,
                billed: rec.billed,
                exit: exitLabel,
                gate: 200,
                key_masked: `${rec.key.slice(0, 8)}…`,
              });
              made++;
              log(`account ${i + 1} ✔ chat-200 ${rec.chatModel} · ${rec.usedGroup || 'inherit'} · quota ${rec.quota} → ${rec.quotaAfter} (used ${rec.usedStart} → ${rec.usedAfter}) · ${rec.key.slice(0, 8)}…`);
              return;
            } catch (e) {
              lastErr = e;
              log(`account ${i + 1} attempt ${t + 1}: ${String(e.message).slice(0, 130)}`);
            }
          }
          log(`account ${i + 1} ✘ ${lastErr ? String(lastErr.message).slice(0, 140) : 'failed'}`);
        })()
      );
    }
    await Promise.all(jobs);
    if (GAP_MS) await sleep(GAP_MS);
  }
  log(`done — ${made}/${COUNT} key(s) written to ${KEYS_FILE}`);
  process.exit(made ? 0 : 1);
}

async function verifyOnly(exits) {
  const all = readKeys();
  const keys = LIMIT > 0 ? all.slice(0, LIMIT) : all;
  if (!keys.length) { console.log(`no keys in ${KEYS_FILE}`); process.exit(0); }
  let live = 0;
  for (let i = 0; i < keys.length; i++) {
    const exit = exits[i % exits.length];
    try {
      const g = await chatGate(exit, keys[i], MODEL);
      if (g.ok) live++;
      console.log(`  ${g.ok ? '✔' : '✘'} ${String(i + 1).padStart(2, '0')}/${keys.length} ${keys[i].slice(0, 8)}… chat=${g.status}${g.ok ? '' : ` ${g.sample.slice(0, 90)}`}`);
    } catch (e) {
      console.log(`  ✘ ${String(i + 1).padStart(2, '0')}/${keys.length} ${keys[i].slice(0, 8)}… ${String(e.message).slice(0, 90)}`);
    }
  }
  console.log(`verify: ${live}/${keys.length} keys live${LIMIT > 0 && all.length > keys.length ? ` (limited; ${all.length} in keys.txt)` : ''}`);
  process.exit(live === keys.length ? 0 : 1);
}

// ------------------------------------------------------------- connect 9router
async function login9router(base, password) {
  const res = await fetch(`${base}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': UA },
    body: JSON.stringify({ password: password ?? '123456' }),
  });
  const sc = typeof res.headers.getSetCookie === 'function' ? res.headers.getSetCookie() : [];
  const cookie = sc.map((c) => c.split(';')[0]).join('; ');
  return { ok: res.ok, cookie, body: (await res.text()).slice(0, 200) };
}

async function r9(base, cookie, p, init = {}) {
  const res = await fetch(`${base}${p}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': UA,
      ...(cookie ? { Cookie: cookie } : {}),
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch (e) { /* not json */ }
  return { status: res.status, ok: res.ok, json, text: text.slice(0, 300) };
}

/**
 * Register the provider-node and one connection on a local 9Router. 9Router is
 * the local router (usually http://localhost:20128), so this call is deliberately
 * direct — provider traffic keeps going through the exit pool.
 */
async function connect9router() {
  const base = (arg('9router-base', 'http://localhost:20128')).replace(/\/$/, '');
  const password = arg('9router-password', '123456');
  const name = arg('9router-name', 'Genvís AI');
  const prefix = arg('9router-prefix', 'apitoken');
  const keys = readKeys();
  const apiKey = arg('api-key', keys[keys.length - 1] || '');
  if (!apiKey) {
    console.log('no key yet — mint one first (node src/cli.js --count 1), then re-run with --api-key <key>');
    process.exit(1);
  }
  const { cookie, ok, body } = await login9router(base, password);
  console.log(`9Router login: ${ok ? 'ok' : `not required/failed ${body}`}`);
  const nodes = await r9(base, cookie, '/api/provider-nodes');
  const existing = (((nodes.json || {}).nodes) || []).find((n) => n.prefix === prefix || n.name === name);
  let node = existing;
  if (node) {
    console.log(`provider-node exists: ${node.id} (prefix ${node.prefix})`);
  } else {
    const created = await r9(base, cookie, '/api/provider-nodes', {
      method: 'POST',
      body: JSON.stringify({ name, prefix, apiType: 'chat', type: 'openai-compatible', baseUrl: `${BASE}/v1` }),
    });
    if (!created.ok) throw new Error(`create node failed ${created.status}: ${created.text}`);
    node = created.json.node;
    console.log(`provider-node created: ${node.id} (${BASE}/v1)`);
  }
  const conns = await r9(base, cookie, '/api/providers');
  const mine = (((conns.json || {}).connections) || []).find((c) => c.provider === node.id || c.name === name);
  if (mine) {
    console.log(`connection exists: ${mine.id} (${mine.name})`);
  } else {
    const created = await r9(base, cookie, '/api/providers', {
      method: 'POST',
      body: JSON.stringify({ provider: node.id, apiKey, name, priority: 1, defaultModel: MODEL }),
    });
    if (!created.ok && created.status !== 409) throw new Error(`create connection failed ${created.status}: ${created.text}`);
    console.log(`connection created: ${(created.json && created.json.connection && created.json.connection.id) || '(conflict)'}`);
  }
  console.log(`\nDone. Models are served as ${prefix}/<model id>:\n  ${prefix}/${MODEL}`);
}

// ------------------------------------------------------------------- main
// The published repo ships this file as `src/cli.js`, but it is also required
// by lab harnesses and scanners — only run the flow when invoked directly.
if (require.main === module) {
  (async () => {
    if (CONNECT_9ROUTER) {
      await connect9router();
      process.exit(0);
    }
    const exits = loadExits();
    if (SCREEN) {
      await screen(exits);
      process.exit(0);
    }
    await (VERIFY_ONLY ? verifyOnly(exits) : mint(exits));
  })().catch((e) => {
    console.error('[fatal]', e.message);
    process.exit(1);
  });
}

module.exports = { parseProxy, codeCandidates, snapshot, chatGate, loadExits };
