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

**Genvís AI-Konten in großen Mengen erstellen mit automatisch generierten API-Schlüsseln — OpenAI-kompatible Inferenz + 9Router-Connector.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-34%20served-412991?style=for-the-badge)](https://apitoken.fun/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Schnellstart](#-quick-start) · [🎁 Kostenlose Stufe](#-free-tier--how-much-you-get) · [🤖 Modelle](#-models--all-34-of-them) · [🧪 Die API verwenden](#-how-to-use-the-api) · [✅ Verifiziert](#-verified-working--every-key-is-tested) · [🧭 So funktioniert es](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Optionen](#️-cli-options) · [🛰️ Proxys](#️-behind-a-proxy) · [🐞 Probleme](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Warum es das gibt

Genvís AI (`apitoken.fun`) ist ein New-API-Fork, der **jedem neuen Konto 1.000.000 Quota-Einheiten — 2 $ bei `quota_per_unit: 500000` — gutschreibt**, mit **keinem Captcha** (`turnstile_check:false`, kein Turnstile-Skript auf der Registrierungsseite) und **keinem Check-in-Ritual, um das man sich kümmern muss**. Die Registrierung besteht aus einer E-Mail-Adresse plus einem 6-stelligen Hex-Code, und das Guthaben ist echt: gemessen am Live-Panel antwortete `GET /api/user/self` direkt nach der Anmeldung mit `quota: 1000000, used_quota: 0` und nach einem `deepseek-v4-flash`-Aufruf mit `quota: 999996, used_quota: 4, request_count: 1` — jeder Chat-200 bewegt die Zahl. Der eigene Lauf der Spur erzeugte **14 Konten → 14 Schlüssel, von denen alle nur behalten wurden, nachdem ein Live-Chat 200 lieferte** (10 über die Bulk-Harness auf einem Proxy-Ausgang, 4 über den eigenen `--count`-Pfad dieser CLI), und die mitgelieferte CLI testet sie jederzeit mit `--verify-only` erneut (**verified working** am 2026-10-21). Das einzige echte Hindernis ist das Postfach: Das Panel erzwingt eine **Whitelist für E-Mail-Domains** (gmail akzeptiert; mailtrap.io und vomoto.com serverseitig abgelehnt), und die akzeptierten Gmail-Postfächer stammen aus einem **recycelten geteilten Posteingang**, der auch die Post anderer Leute enthält — daher nimmt das Tool seinen Code nur aus einer Mail, die neuer ist als der Snapshot vor dem Versand *und* dieses Panel nennt (`mail.genvis.xyz` (Absender), Betreff `Genvís AI邮箱验证邮件`). Ein fremder Code, der einmal im Labor registriert wurde, antwortete mit `Verification code is incorrect or has expired`; diese Falle ist hier geschlossen.

## 🎁 Kostenlose Stufe — wie viel du bekommst

| Was | Wert |
| --- | --- |
| Anmeldeguthaben | **1.000.000 Einheiten = 2 $** (`quota_for_new_user: 1000000`, `quota_per_unit: 500000`) |
| Verbrauchsnachweis | nach 1 Chat: `quota 1000000 → 999996, used_quota 4, request_count 1`; nach 2 Chats: `999992 / 8 / 2` |
| Captcha | **keines** — `turnstile_check:false`, die Registrierungsseite liefert kein Turnstile-Skript |
| E-Mail-Hürde | **6 Hex-Zeichen**, 10-Minuten-Fenster, Domain-Whitelist: **gmail akzeptiert**, `mailtrap.io` / `vomoto.com` abgelehnt |
| Weitere Hürden | kein Telefon, kein OAuth (GitHub/Google/WeChat/LinuxDo/OIDC alle `false`), kein Einladungscode, kein täglicher Check-in |
| Katalog | **34 Modell-IDs** auf `/v1/models` mit einem Live-Schlüssel |
| Die Einheit, die skaliert | **ein Konto = ein Schlüssel** |

> 💡 Die kostenlose Stufe wird von Genvís AI festgelegt und kann sich ändern. Prüfe die Live-Zahlen auf [apitoken.fun](https://apitoken.fun) — und lass das eigene Gate des Tools entscheiden:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelle — alle 34 davon

`GET /v1/models` mit einem Live-Schlüssel listet **34 Modell-IDs** auf. Die verifizierte Schlüsselzeile ist `deepseek-v4-flash` — der günstigste Eintrag auf der Preisliste und das Modell, mit dem jeder der 14 Schlüssel der Spur `200` antwortete (`content:"ok"`).

| Modell-ID | Verifiziert |
| --- | --- |
| `deepseek-v4-flash` | **14 von 14 Schlüsseln Chat-200** beim Erzeugen und erneut über `--verify-only` |
| `gemini-3.8-flash` · `gpt-5.6-luna` · `deepseek-v4-pro` · `glm-5.3` · `kimi-k3` · `grok-4.6` · `gpt-6-astra` · `nano-banana*` | von `/v1/models` mit denselben Schlüsseln aufgelistet |

Preisverhältnisse auf der eigenen Liste des Panels (1× = die Standardgruppe): `gemini-3.8-flash 0.045×`, `gpt-5.6-luna 0.1×`, `gemini-3.7-flash 0.45×`, `deepseek-v4-pro 0.66×`, `gpt-5.6-sol 2×`, `claude-opus-4-8 / claude-sonnet-5 / sora-2 37.5×` — ein 2-$-Konto kauft also ~44 deepseek-v4-flash-lastige Chats oder eine Handvoll Frontier-Aufrufe.

```bash
curl https://apitoken.fun/v1/chat/completions \
  -H "Authorization: Bearer MpqWYXkvfV…" -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4-flash","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 Die API verwenden

Basis-URL **`https://apitoken.fun/v1`** — OpenAI-kompatibel. Das Panel beantwortet außerdem `/v1/messages` (Anthropic-Form), `/v1beta/models/{model}:generateContent` (Gemini-Form) und `/v1/images/generations`.

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

## 🛠 Schnellstart

```bash
cd apitoken-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/launcher.js                     # interactive: mint / verify / screen / settings
# or: node src/cli.js --count 10 --pool proxies.txt
```

Ein Schlüssel wird **nur** dann in `keys.txt` geschrieben, wenn `/v1/chat/completions` mit 200 und echtem Inhalt antwortet; `accounts.jsonl` behält username / e-mail / quotaStart → quotaAfter / used. Das Postfach-Fenster beträgt standardmäßig 300 s, weil die Code-Mail dieses Panels langsam ist — gemessen **157–176 s** nach dem Versand bei den letzten fünf Konten der Spur.

### 🖱️ Der Launcher

Der Launcher fragt nach der Proxy-Liste (optional — ohne eine läuft die CLI direkt) und der Anzahl, merkt sie sich und führt die CLI aus — mint, verify, screen exits, settings, help, Connect to 9Router.

## ✅ Verifiziert funktionierend — jeder Schlüssel wird getestet

| Prüfung | Ergebnis |
| --- | --- |
| `GET /api/status` | **200** — `system_name:"Genvís AI"`, `register_enabled:true`, `email_verification:true`, `turnstile_check:false`, `checkin_enabled:false`, `quota_for_new_user:1000000`, `quota_per_unit:500000` |
| `GET /api/verification?email=…` | **200** `{"message":"","success":true}` (POST `/api/verification` und `/api/user/register/verify` antworten mit `404 Invalid URL` auf diesem Fork) |
| `POST /api/user/register` | **200** `{"success":true}` — 14/14 Konten |
| `POST /api/user/login` | **200** + `access_token` JWT; `/api/user/self` benötigt dieses Bearer-Token (ein reiner Cookie-Aufruf wird mit `401 AUTH_UNAUTHORIZED` beantwortet) |
| `POST /api/token/` | **200** — 48-stelliger Schlüssel einmalig zurückgegeben (kein `sk-`-Präfix), Gruppe `default` |
| `POST /v1/chat/completions` (`deepseek-v4-flash`) | **200** mit `content:"ok"` bei **14 von 14 Schlüsseln**, sowohl aus der Mint-Harness als auch aus dem `--verify-only` der mitgelieferten CLI |
| `GET /api/user/self` nach dem Gate | `quota 1000000 → 999996`, `used_quota 0 → 4`, `request_count 0 → 1` — das Guthaben wird wirklich abgerechnet |

## 🧭 So funktioniert es

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Genvís AI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://apitoken.fun/v1/chat/completions → real content = the key is live
```

| Schritt | Aufruf | Hinweise |
| --- | --- | --- |
| Gates | `GET /api/status` | Registrierung an, E-Mail-Verifizierung an, Captcha aus, 2 $ Anmeldeguthaben |
| Postfach | Emailnator `POST /api/generate-email` | eine frische `@gmail.com` pro Konto, in der **punktfreien** Form registriert (die Whitelist des Panels akzeptiert gmail; das geteilte Postfach wird recycelt, daher können Adressen bereits bekannt sein) |
| Baseline | `POST /api/message-list` | bereits im Postfach vorhandene IDs — nichts Älteres wird jemals akzeptiert |
| Code senden | `GET /api/verification?email=…` | 6-Hex-Code, 10-Minuten-Fenster; ~20 s Back-off bei Drosselung |
| Code | `/api/message-list` abfragen → `/api/message/<id>` | nur eine **markenpassende** Mail (`Genvís AI` / `genvis.xyz`) darf den Code liefern — das Postfach ist voller fremder Codes |
| Registrieren | `POST /api/user/register` | `{username,password,email,verification_code}` |
| Anmelden | `POST /api/user/login` | Session-Cookie **und** das `access_token`, das der Fork als `Authorization: Bearer` will |
| Schlüssel | `POST /api/token/` | 48-stelliger Schlüssel, Gruppe `default` (Fallback: inherit), einmalig offengelegt |
| Nachweis | `POST /v1/chat/completions` | 200 + Inhalt = behalten; dann zeichnet ein weiteres `/api/user/self` die Quota auf, die der Aufruf verbraucht hat |

## ⚙️ CLI-Optionen

```bash
node src/cli.js --count 10            # mint 10 keys (one account each, chat gate per key)
node src/cli.js --model deepseek-v4-flash
node src/cli.js --mail-window 300     # seconds to wait for the code mail
node src/cli.js --verify-only         # re-check every key in keys.txt (--limit N to cap)
node src/cli.js --screen              # exit pool self-test
node src/cli.js --connect-9router     # register the provider + a key on a local 9Router
node src/cli.js --help
```

| Env | Standard | Bedeutung |
| --- | --- | --- |
| `APITOKEN_PROXIES` | `proxies.txt` | Ausgangspool, eine Zeile pro Proxy — optional: ohne einen Pool verbindet sich die CLI direkt |
| `APITOKEN_MODEL` | `deepseek-v4-flash` | Modell für die Live-Verifizierung |

## 🛰️ Hinter einem Proxy

**Optional — bei Skalierung empfohlen (Limits pro IP, Sperren).** Das Tool funktioniert auch ohne Proxy.

- **Mit einem Pool:** übergib `--pool <file>` (oder setze `APITOKEN_PROXIES`), und jede Anfrage geht über einen Ausgang aus dieser Liste — eine tote Leitung lässt diesen Versuch scheitern, und die CLI wechselt zum nächsten Ausgang. Die Mail-Schiene (Emailnator) geht über denselben Ausgang.
- **Ohne einen Pool:** die CLI gibt `running WITHOUT a proxy (direct)` aus und verbindet sich direkt. An Registrierung, Schlüsselerzeugung oder Verifizierung ändert sich nichts — nur daran, wo die Pakete hinausgehen.
- Führe `--screen` gegen beide Modi aus: Es testet die Ausgänge, die du hast (oder die direkte Route), gegen Genvís AI vor einem echten Lauf.

## 📄 Dateien

| Pfad | Inhalt |
| --- | --- |
| `keys.txt` | ein live-verifizierter Schlüssel pro Zeile (48-stellig) — von git ignoriert |
| `accounts.jsonl` | username / e-mail / quotaStart → quotaAfter / usedStart → usedAfter / group / exit |
| `proxies.txt` | deine Ausgänge — von git ignoriert |
| `out/` | Lauf-Logs — von git ignoriert |

## 🔌 Mit 9Router verbinden

[9Router](https://9router.com) ist ein selbst gehosteter, OpenAI-kompatibler Router:

```bash
node src/cli.js --connect-9router --9router-base http://localhost:20128 --9router-password 123456 --api-key MpqWYXkvfV…
```

Standardwerte: `--9router-prefix apitoken`, `--9router-name Genvís AI`, `--base-url https://apitoken.fun/v1`, `--model deepseek-v4-flash`. Modelle werden als `apitoken/<model id>` bereitgestellt.

## 🔑 Was ein Schlüssel dir bringt

| | |
| --- | --- |
| 🏢 Anbieter | **Genvís AI** — [apitoken.fun](https://apitoken.fun) |
| 🎁 Was der Anbieter gibt | **2 $ (1.000.000 Einheiten)** bei der Anmeldung — captcha-frei, kein Check-in |
| 🔑 Was ein Schlüssel dir bringt | ein 48-stelliger Schlüssel auf seinem eigenen Konto, chat-verifiziert auf `deepseek-v4-flash` |
| 🌐 API-Form | OpenAI-kompatibel: `POST https://apitoken.fun/v1/chat/completions` (auch `/v1/messages`, `:generateContent`, `/v1/images/generations`) |
| 🔒 Deine Daten | nur `apitoken.fun` und dein Postfach-Backend werden kontaktiert; Schlüssel bleiben auf deinem Rechner |

## 🐞 Probleme

Wenn Genvís AI seine Registrierungs-Gates ändert (sie werden unter `/api/status` veröffentlicht), seine Mail-Whitelist, die Code-Form oder den Relay-Host, stoppt das Tool an diesem Schritt und sagt es — der Ablehnungstext wird wörtlich gemeldet. **[Öffne ein Issue](../../issues)** mit dem Befehl und der exakten Ausgabe.

## 📄 Lizenz

MIT © 2026 — siehe [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 apitoken-bulk-apikey contributors

</div>