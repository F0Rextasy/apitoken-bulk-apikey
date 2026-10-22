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

**Массовое создание аккаунтов Genvís AI с автоматически сгенерированными API-ключами — инференс, совместимый с OpenAI, + коннектор 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-34%20served-412991?style=for-the-badge)](https://apitoken.fun/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Быстрый старт](#-quick-start) · [🎁 Бесплатный тариф](#-free-tier--how-much-you-get) · [🤖 Модели](#-models--all-34-of-them) · [🧪 Использование API](#-how-to-use-the-api) · [✅ Проверено](#-verified-working--every-key-is-tested) · [🧭 Как это работает](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Опции](#️-cli-options) · [🛰️ Прокси](#️-behind-a-proxy) · [🐞 Проблемы](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Зачем это нужно

Genvís AI (`apitoken.fun`) — это форк New API, который начисляет **1 000 000 единиц квоты — $2 при `quota_per_unit: 500000` — каждому новому аккаунту**, при этом **без капчи** (`turnstile_check:false`, на странице регистрации нет скрипта Turnstile) и **без ежедневной отметки, за которой нужно следить**. Регистрация — это адрес электронной почты плюс 6-символьный hex-код, и кредит реальный: по замерам на живой панели `GET /api/user/self` вернул `quota: 1000000, used_quota: 0` сразу после регистрации и `quota: 999996, used_quota: 4, request_count: 1` после одного вызова `deepseek-v4-flash` — каждый chat-200 сдвигает это число. Собственный прогон этого направления создал **14 аккаунтов → 14 ключей, и все они были сохранены только после живого chat 200** (10 через массовый харнесс на выходе proxy, 4 через собственный путь `--count` этого CLI), а поставляемый CLI в любой момент перепроверяет их с помощью `--verify-only` (**14/14 живых** на 2026-10-21). Единственный настоящий барьер — это почтовый ящик: панель применяет **белый список доменов электронной почты** (gmail принимается; mailtrap.io и vomoto.com отклонены на стороне сервера), а принимаемые gmail-ящики берутся из **переиспользуемого общего инбокса**, в котором также лежит чужая почта — поэтому инструмент берёт код только из письма, которое новее снимка, сделанного перед отправкой, *и* при этом называет эту панель (отправитель `mail.genvis.xyz`, тема `Genvís AI邮箱验证邮件`). Чужой код, однажды зарегистрированный в лаборатории, получил ответ `Verification code is incorrect or has expired`; эта ловушка здесь закрыта.

## 🎁 Бесплатный тариф — сколько вы получаете

| Что | Значение |
| --- | --- |
| Кредит при регистрации | **1 000 000 единиц = $2** (`quota_for_new_user: 1000000`, `quota_per_unit: 500000`) |
| Доказательство расхода | после 1 чата: `quota 1000000 → 999996, used_quota 4, request_count 1`; после 2 чатов: `999992 / 8 / 2` |
| Капча | **отсутствует** — `turnstile_check:false`, страница регистрации не отдаёт скрипт Turnstile |
| Барьер электронной почты | **6 hex-символов**, окно 10 минут, белый список доменов: **gmail принимается**, `mailtrap.io` / `vomoto.com` отклоняются |
| Прочие барьеры | без телефона, без OAuth (GitHub/Google/WeChat/LinuxDo/OIDC — все `false`), без инвайт-кода, без ежедневной отметки |
| Каталог | **34 id моделей** на `/v1/models` с живым ключом |
| Единица масштабирования | **один аккаунт = один ключ** |

> 💡 Бесплатный тариф задаётся Genvís AI и может измениться. Проверяйте актуальные цифры на [apitoken.fun](https://apitoken.fun) — и пусть решает собственный барьер инструмента:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Модели — все 34

`GET /v1/models` с живым ключом перечисляет **34 id моделей**. Проверенная строка модели — `deepseek-v4-flash` — самая дешёвая позиция в прайс-листе и модель, на которую все 14 ключей этого направления ответили `200` (`content:"ok"`).

| ID модели | Проверено |
| --- | --- |
| `deepseek-v4-flash` | **14 из 14 ключей chat-200** при создании и снова через `--verify-only` |
| `gemini-3.8-flash` · `gpt-5.6-luna` · `deepseek-v4-pro` · `glm-5.3` · `kimi-k3` · `grok-4.6` · `gpt-6-astra` · `nano-banana*` | перечислены `/v1/models` на тех же ключах |

Ценовые коэффициенты в собственной таблице панели (1× = группа по умолчанию): `gemini-3.8-flash 0.045×`, `gpt-5.6-luna 0.1×`, `gemini-3.7-flash 0.45×`, `deepseek-v4-pro 0.66×`, `gpt-5.6-sol 2×`, `claude-opus-4-8 / claude-sonnet-5 / sora-2 37.5×` — так что аккаунт на $2 покупает ~44 чата с преобладанием deepseek-v4-flash или несколько вызовов фронтирных моделей.

```bash
curl https://apitoken.fun/v1/chat/completions \
  -H "Authorization: Bearer MpqWYXkvfV…" -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4-flash","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 Как использовать API

Базовый URL **`https://apitoken.fun/v1`** — совместим с OpenAI. Панель также отвечает на `/v1/messages` (формат Anthropic), `/v1beta/models/{model}:generateContent` (формат Gemini) и `/v1/images/generations`.

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

## 🛠 Быстрый старт

```bash
cd apitoken-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/launcher.js                     # interactive: mint / verify / screen / settings
# or: node src/cli.js --count 10 --pool proxies.txt
```

Ключ записывается в `keys.txt` **только** после того, как `/v1/chat/completions` ответит 200 с реальным содержимым; `accounts.jsonl` хранит username / e-mail / quotaStart → quotaAfter / used. Окно почтового ящика по умолчанию — 300 с, потому что письмо с кодом от этой панели приходит медленно — по замерам **157–176 с** после отправки на последних пяти аккаунтах этого направления.

### 🖱️ Лаунчер

Лаунчер запрашивает список прокси (необязательно — без него CLI работает напрямую) и количество, запоминает их и запускает CLI — mint, verify, screen exits, settings, help, Connect to 9Router.

## ✅ Проверено в работе — каждый ключ протестирован

| Проверка | Результат |
| --- | --- |
| `GET /api/status` | **200** — `system_name:"Genvís AI"`, `register_enabled:true`, `email_verification:true`, `turnstile_check:false`, `checkin_enabled:false`, `quota_for_new_user:1000000`, `quota_per_unit:500000` |
| `GET /api/verification?email=…` | **200** `{"message":"","success":true}` (POST `/api/verification` и `/api/user/register/verify` отвечают `404 Invalid URL` на этом форке) |
| `POST /api/user/register` | **200** `{"success":true}` — 14/14 аккаунтов |
| `POST /api/user/login` | **200** + `access_token` JWT; `/api/user/self` требует этот Bearer-токен (вызов только с cookie получает ответ `401 AUTH_UNAUTHORIZED`) |
| `POST /api/token/` | **200** — 48-символьный ключ возвращается один раз (без префикса `sk-`), группа `default` |
| `POST /v1/chat/completions` (`deepseek-v4-flash`) | **200** с `content:"ok"` на **14 из 14 ключей**, как из харнесса создания, так и из `--verify-only` поставляемого CLI |
| `GET /api/user/self` после барьера | `quota 1000000 → 999996`, `used_quota 0 → 4`, `request_count 0 → 1` — кредит действительно списывается |

## 🧭 Как это работает

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Genvís AI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://apitoken.fun/v1/chat/completions → real content = the key is live
```

| Шаг | Вызов | Примечания |
| --- | --- | --- |
| барьеры | `GET /api/status` | регистрация включена, проверка почты включена, капча выключена, кредит $2 при регистрации |
| почтовый ящик | Emailnator `POST /api/generate-email` | один свежий `@gmail.com` на аккаунт, регистрируется в **форме без точек** (белый список панели принимает gmail; общий ящик переиспользуется, поэтому адреса могут быть уже известны) |
| базовая линия | `POST /api/message-list` | id, уже находящиеся в ящике — ничего старше никогда не принимается |
| отправка кода | `GET /api/verification?email=…` | 6-hex код, окно 10 минут; ~20 с откат при троттлинге |
| код | опрос `/api/message-list` → `/api/message/<id>` | только письмо с **совпадающим брендом** (`Genvís AI` / `genvis.xyz`) может предоставить код — ящик полон чужих кодов |
| регистрация | `POST /api/user/register` | `{username,password,email,verification_code}` |
| вход | `POST /api/user/login` | cookie сессии **и** `access_token`, который форк хочет видеть как `Authorization: Bearer` |
| ключ | `POST /api/token/` | 48-символьный ключ, группа `default` (запасной вариант: inherit), показывается один раз |
| доказательство | `POST /v1/chat/completions` | 200 + содержимое = сохранить; затем ещё один `/api/user/self` фиксирует квоту, которую сжёг вызов |

## ⚙️ Опции CLI

```bash
node src/cli.js --count 10            # mint 10 keys (one account each, chat gate per key)
node src/cli.js --model deepseek-v4-flash
node src/cli.js --mail-window 300     # seconds to wait for the code mail
node src/cli.js --verify-only         # re-check every key in keys.txt (--limit N to cap)
node src/cli.js --screen              # exit pool self-test
node src/cli.js --connect-9router     # register the provider + a key on a local 9Router
node src/cli.js --help
```

| Переменная | По умолчанию | Значение |
| --- | --- | --- |
| `APITOKEN_PROXIES` | `proxies.txt` | пул выходов, по одной строке на прокси — необязательно: без пула CLI подключается напрямую |
| `APITOKEN_MODEL` | `deepseek-v4-flash` | модель для живой проверки |

## 🛰️ За прокси

**Необязательно — рекомендуется при масштабировании (лимиты на IP, баны).** Инструмент работает и без прокси.

- **С пулом:** передайте `--pool <file>` (или задайте `APITOKEN_PROXIES`), и каждый запрос пойдёт через выход из этого списка — мёртвая линия проваливает эту попытку, и CLI переходит к следующему выходу. Почтовый канал (Emailnator) идёт через тот же выход.
- **Без пула:** CLI печатает `running WITHOUT a proxy (direct)` и подключается напрямую. В регистрации, создании ключей или проверке ничего не меняется — только то, откуда уходят пакеты.
- Запустите `--screen` в любом из режимов: он тестирует имеющиеся у вас выходы (или прямой маршрут) против Genvís AI перед реальным запуском.

## 📄 Файлы

| Путь | Содержимое |
| --- | --- |
| `keys.txt` | по одному проверенному вживую ключу на строку (48 символов) — игнорируется git |
| `accounts.jsonl` | username / e-mail / quotaStart → quotaAfter / usedStart → usedAfter / group / exit |
| `proxies.txt` | ваши выходы — игнорируется git |
| `out/` | логи запусков — игнорируется git |

## 🔌 Подключение к 9Router

[9Router](https://9router.com) — это самостоятельно размещаемый роутер, совместимый с OpenAI:

```bash
node src/cli.js --connect-9router --9router-base http://localhost:20128 --9router-password 123456 --api-key MpqWYXkvfV…
```

Значения по умолчанию: `--9router-prefix apitoken`, `--9router-name Genvís AI`, `--base-url https://apitoken.fun/v1`, `--model deepseek-v4-flash`. Модели подаются как `apitoken/<model id>`.

## 🔌 Подключение к OmniRoute

[OmniRoute](https://omniroute.online) — это самостоятельно размещаемый роутер, совместимый с OpenAI:

```bash
node src/cli.js --connect-omniroute --omniroute-base http://localhost:20128 --omniroute-password 123456 --api-key MpqWYXkvfV…
```

Значения по умолчанию: `--omniroute-prefix apitoken`, `--omniroute-name Genvís AI`, `--base-url https://apitoken.fun/v1`, `--model deepseek-v4-flash`. Модели подаются как `apitoken/<model id>`.
## 🔑 Что даёт один ключ

| | |
| --- | --- |
| 🏢 Провайдер | **Genvís AI** — [apitoken.fun](https://apitoken.fun) |
| 🎁 Что даёт провайдер | **$2 (1 000 000 единиц)** при регистрации — без капчи, без ежедневной отметки |
| 🔑 Что даёт один ключ | один 48-символьный ключ на собственном аккаунте, проверенный чатом на `deepseek-v4-flash` |
| 🌐 Формат API | совместим с OpenAI: `POST https://apitoken.fun/v1/chat/completions` (также `/v1/messages`, `:generateContent`, `/v1/images/generations`) |
| 🔒 Ваши данные | связь только с `apitoken.fun` и вашим почтовым бэкендом; ключи остаются на вашей машине |

## 🐞 Проблемы

Если Genvís AI изменит свои барьеры регистрации (они публикуются в `/api/status`), свой почтовый белый список, форму кода или хост релея, инструмент остановится на этом шаге и сообщит об этом — тело отказа приводится дословно. **[Откройте issue](../../issues)** с командой и точным выводом.

## 📄 Лицензия

MIT © 2026 — см. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 apitoken-bulk-apikey contributors

</div>