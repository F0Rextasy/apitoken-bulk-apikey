<div align="center">

```
 █████╗ ██████╗ ██╗████████╗ ██████╗ ██╗  ██╗███████╗███╗   ██╗
██╔══██╗██╔══██╗██║╚══██╔══╝██╔═══██╗██║ ██╔╝██╔════╝████╗  ██║
███████║██████╔╝██║   ██║   ██║   ██║█████╔╝ █████╗  ██╔██╗ ██║
██╔══██║██╔═══╝ ██║   ██║   ██║   ██║██╔═██╗ ██╔══╝  ██║╚██╗██║
██║  ██║██║     ██║   ██║   ╚██████╔╝██║  ██╗███████╗██║ ╚████║
╚═╝  ╚═╝╚═╝     ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝
```

# apitoken-bulk-apikey

**Bulk-create Genvís AI accounts with auto-generated API keys — OpenAI-compatible inference + 9Router connector.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-34%20served-412991?style=for-the-badge)](https://apitoken.fun/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Quick start](#-quick-start) · [🎁 Free tier](#-free-tier--how-much-you-get) · [🤖 Models](#-models--all-34-of-them) · [🧪 Use the API](#-how-to-use-the-api) · [✅ Verified](#-verified-working--every-key-is-tested) · [🧭 How it works](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Options](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Issues](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Why this exists

Genvís AI (`apitoken.fun`) is a New API fork that pays **1,000,000 quota units — $2 at `quota_per_unit: 500000` — to every new account**, with **no captcha** (`turnstile_check:false`, no Turnstile script on the register page) and **no check-in ritual to babysit**. Registration is an e-mail address plus a 6-character hex code, and the credit is real: measured on the live panel, `GET /api/user/self` answered `quota: 1000000, used_quota: 0` right after signup and `quota: 999996, used_quota: 4, request_count: 1` after one `deepseek-v4-flash` call — every chat-200 moves the number. The lane's own run minted **keys verified** (10 through the bulk harness on a proxy exit, 4 through this CLI's own `--count` path), and the shipped CLI re-tests them at any time with `--verify-only` (**verified working** on 2026-10-21). The one real gate is the mailbox: the panel enforces an **e-mail domain whitelist** (gmail accepted; mailtrap.io and vomoto.com refused server-side), and the gmail boxes it accepts come from a **recycled shared inbox** that also carries other people's mail — so the tool takes its code only from a mail that is newer than the pre-send snapshot *and* names this panel (`mail.genvis.xyz` (sender), subject `Genvís AI邮箱验证邮件`). A foreign code registered once in the lab answered `Verification code is incorrect or has expired`; that trap is closed here.

## 🎁 Free tier — how much you get

| What | Value |
| --- | --- |
| Signup credit | **1,000,000 units = $2** (`quota_for_new_user: 1000000`, `quota_per_unit: 500000`) |
| Spend proof | after 1 chat: `quota 1000000 → 999996, used_quota 4, request_count 1`; after 2 chats: `999992 / 8 / 2` |
| Captcha | **none** — `turnstile_check:false`, register page serves no Turnstile script |
| E-mail gate | **6 hex characters**, 10-minute window, domain whitelist: **gmail accepted**, `mailtrap.io` / `vomoto.com` refused |
| Other gates | no phone, no OAuth (GitHub/Google/WeChat/LinuxDo/OIDC all `false`), no invite code, no daily check-in |
| Catalogue | **34 model ids** on `/v1/models` with a verified keys |
| The unit that scales | **one account = one key** |

> 💡 The free tier is set by Genvís AI and can change. Check the live numbers at [apitoken.fun](https://apitoken.fun) — and let the tool's own gate decide:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Models — all 34 of them

`GET /v1/models` with a verified keys lists **34 model ids**. The verified key line is `deepseek-v4-flash` — the cheapest entry on the pricing sheet and the model every one of the lane's 14 keys answered `200` with (`content:"ok"`).

| Model ID | Verified |
| --- | --- |
| `deepseek-v4-flash` | **verified** at mint, and again through `--verify-only` |
| `gemini-3.8-flash` · `gpt-5.6-luna` · `deepseek-v4-pro` · `glm-5.3` · `kimi-k3` · `grok-4.6` · `gpt-6-astra` · `nano-banana*` | listed by `/v1/models` on the same keys |

Pricing ratios on the panel's own sheet (1× = the default group): `gemini-3.8-flash 0.045×`, `gpt-5.6-luna 0.1×`, `gemini-3.7-flash 0.45×`, `deepseek-v4-pro 0.66×`, `gpt-5.6-sol 2×`, `claude-opus-4-8 / claude-sonnet-5 / sora-2 37.5×` — so a $2 account buys ~44 deepseek-v4-flash-heavy chats or a handful of frontier calls.

```bash
curl https://apitoken.fun/v1/chat/completions \
  -H "Authorization: Bearer MpqWYXkvfV…" -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4-flash","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 How to use the API

Base URL **`https://apitoken.fun/v1`** — OpenAI-compatible. The panel also answers `/v1/messages` (Anthropic shape), `/v1beta/models/{model}:generateContent` (Gemini shape) and `/v1/images/generations`.

```python
from openai import OpenAI
c = OpenAI(base_url="https://apitoken.fun/v1", api_key="MpqWYXkvfV…")
print(c.chat.completions.create(model="deepseek-v4-flash",
      messages=[{"role":"user","content":"hi"}]).choices[0].message.content)
```

```bash
# the shipped CLI's own gate — a key is only ever written after a real 200
node src/cli.js --verify-only --model deepseek-v4-flash
```

## 🛠 Quick start

```bash
cd apitoken-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/launcher.js                     # interactive: mint / verify / screen / settings
# or: node src/cli.js --count 10 --pool proxies.txt
```

A key is written to `keys.txt` **only** after `/v1/chat/completions` answers 200 with real content; `accounts.jsonl` keeps username / e-mail / quotaStart → quotaAfter / used. The mailbox window defaults to 300 s because this panel's code mail is slow — measured **157–176 s** after the send on the lane's last five accounts.

### 🖱️ The launcher

The launcher asks for the proxy list (optional — without one the CLI runs direct) and the count, remembers them, and runs the CLI — mint, verify, screen exits, settings, help, Connect to 9Router.

## ✅ Verified working — every key is tested

| Check | Result |
| --- | --- |
| `GET /api/status` | **200** — `system_name:"Genvís AI"`, `register_enabled:true`, `email_verification:true`, `turnstile_check:false`, `checkin_enabled:false`, `quota_for_new_user:1000000`, `quota_per_unit:500000` |
| `GET /api/verification?email=…` | **200** `{"message":"","success":true}` (POST `/api/verification` and `/api/user/register/verify` answer `404 Invalid URL` on this fork) |
| `POST /api/user/register` | **200** `{"success":true}` — 14/14 accounts |
| `POST /api/user/login` | **200** + `access_token` JWT; `/api/user/self` needs that Bearer token (a cookie-only call is answered `401 AUTH_UNAUTHORIZED`) |
| `POST /api/token/` | **200** — 48-char key returned once (no `sk-` prefix), group `default` |
| `POST /v1/chat/completions` (`deepseek-v4-flash`) | **200** with `content:"ok"` on **verified**, both from the mint harness and from the shipped CLI's `--verify-only` |
| `GET /api/user/self` after the gate | `quota 1000000 → 999996`, `used_quota 0 → 4`, `request_count 0 → 1` — the credit is really billed |

## 🧭 How it works

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Genvís AI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://apitoken.fun/v1/chat/completions → real content = the key is live
```

| Step | Call | Notes |
| --- | --- | --- |
| gates | `GET /api/status` | register on, e-mail verification on, captcha off, $2 signup credit |
| mailbox | Emailnator `POST /api/generate-email` | one fresh `@gmail.com` per account, registered in the **dot-free** form (the panel's whitelist accepts gmail; the shared box is recycled, so addresses may already be known) |
| baseline | `POST /api/message-list` | ids already in the box — nothing older is ever accepted |
| send code | `GET /api/verification?email=…` | 6-hex code, 10-minute window; ~20 s back-off on throttling |
| code | poll `/api/message-list` → `/api/message/<id>` | only a **brand-matched** mail (`Genvís AI` / `genvis.xyz`) may supply the code — the box is full of foreign codes |
| register | `POST /api/user/register` | `{username,password,email,verification_code}` |
| login | `POST /api/user/login` | session cookie **and** the `access_token` the fork wants as `Authorization: Bearer` |
| key | `POST /api/token/` | 48-char key, group `default` (fallback: inherit), revealed once |
| proof | `POST /v1/chat/completions` | 200 + content = keep; then one more `/api/user/self` records the quota the call burned |

## ⚙️ CLI options

```bash
node src/cli.js --count 10            # mint 10 keys (one account each, chat gate per key)
node src/cli.js --model deepseek-v4-flash
node src/cli.js --mail-window 300     # seconds to wait for the code mail
node src/cli.js --verify-only         # re-check every key in keys.txt (--limit N to cap)
node src/cli.js --screen              # exit pool self-test
node src/cli.js --connect-9router     # register the provider + a key on a local 9Router
node src/cli.js --help
```

| Env | Default | Meaning |
| --- | --- | --- |
| `APITOKEN_PROXIES` | `proxies.txt` | exit pool, one line per proxy — optional: without a pool the CLI connects directly |
| `APITOKEN_MODEL` | `deepseek-v4-flash` | model for the live verification |

## 🛰️ Behind a proxy

**Optional — recommended at scale (per-IP limits, bans).** The tool works without a proxy too.

- **With a pool:** pass `--pool <file>` (or set `APITOKEN_PROXIES`) and every request goes through an exit from that list — a dead line fails that attempt and the CLI moves to the next exit. The mail rail (Emailnator) goes through the same exit.
- **Without a pool:** the CLI prints `running WITHOUT a proxy (direct)` and connects directly. Nothing about sign-up, key minting or verification changes — only where the packets leave from.
- Run `--screen` against either mode: it tests the exits you have (or the direct route) against Genvís AI before a real run.

## 📄 Files

| Path | Contents |
| --- | --- |
| `keys.txt` | one live-verified key per line (48-char) — git-ignored |
| `accounts.jsonl` | username / e-mail / quotaStart → quotaAfter / usedStart → usedAfter / group / exit |
| `proxies.txt` | your exits — git-ignored |
| `out/` | run logs — git-ignored |

## 🔌 Connect to 9Router

[9Router](https://9router.com) is a self-hosted, OpenAI-compatible router:

```bash
node src/cli.js --connect-9router --9router-base http://localhost:20128 --9router-password 123456 --api-key MpqWYXkvfV…
```

Defaults: `--9router-prefix apitoken`, `--9router-name Genvís AI`, `--base-url https://apitoken.fun/v1`, `--model deepseek-v4-flash`. Models are served as `apitoken/<model id>`.

## 🔑 What one key gets you

| | |
| --- | --- |
| 🏢 Provider | **Genvís AI** — [apitoken.fun](https://apitoken.fun) |
| 🎁 What the provider gives | **$2 (1,000,000 units)** on signup — captcha-free, no check-in |
| 🔑 What one key gets you | one 48-char key on its own account, chat-verified on `deepseek-v4-flash` |
| 🌐 API shape | OpenAI-compatible: `POST https://apitoken.fun/v1/chat/completions` (also `/v1/messages`, `:generateContent`, `/v1/images/generations`) |
| 🔒 Your data | only `apitoken.fun` and your inbox backend are contacted; keys stay on your machine |

## 🐞 Issues

If Genvís AI changes its register gates (they are published under `/api/status`), its mail whitelist, the code shape or the relay host, the tool stops at that step and says so — the refusal body is reported verbatim. **[Open an issue](../../issues)** with the command and the exact output.

## 📄 License

MIT © 2026 — see [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 apitoken-bulk-apikey contributors

</div>
