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

**Crea cuentas de Genvís AI en masa con claves API generadas automáticamente — inferencia compatible con OpenAI + conector 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-34%20served-412991?style=for-the-badge)](https://apitoken.fun/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Inicio rápido](#-quick-start) · [🎁 Nivel gratuito](#-free-tier--how-much-you-get) · [🤖 Modelos](#-models--all-34-of-them) · [🧪 Usar la API](#-how-to-use-the-api) · [✅ Verificado](#-verified-working--every-key-is-tested) · [🧭 Cómo funciona](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Opciones](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problemas](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Por qué existe esto

Genvís AI (`apitoken.fun`) es un fork de New API que paga **1.000.000 de unidades de cuota — $2 con `quota_per_unit: 500000` — a cada cuenta nueva**, sin **captcha** (`turnstile_check:false`, sin script de Turnstile en la página de registro) y **sin ritual de check-in que atender**. El registro es una dirección de correo electrónico más un código hexadecimal de 6 caracteres, y el crédito es real: medido en el panel en vivo, `GET /api/user/self` respondió `quota: 1000000, used_quota: 0` justo después del registro y `quota: 999996, used_quota: 4, request_count: 1` tras una llamada a `deepseek-v4-flash` — cada chat-200 mueve el número. La propia ejecución del carril acuñó **14 cuentas → 14 claves, todas conservadas solo tras un chat 200 en vivo** (10 mediante el arnés masivo en una salida proxy, 4 mediante la propia ruta `--count` de esta CLI), y la CLI incluida las vuelve a probar en cualquier momento con `--verify-only` (**14/14 en vivo** el 2026-10-21). La única barrera real es el buzón: el panel aplica una **lista blanca de dominios de correo electrónico** (gmail aceptado; mailtrap.io y vomoto.com rechazados del lado del servidor), y los buzones de gmail que acepta provienen de una **bandeja compartida reciclada** que también contiene correo de otras personas — por lo que la herramienta toma su código solo de un correo más reciente que la instantánea previa al envío *y* que mencione este panel (`mail.genvis.xyz` (remitente), asunto `Genvís AI邮箱验证邮件`). Un código ajeno registrado una vez en el laboratorio respondió `Verification code is incorrect or has expired`; esa trampa queda cerrada aquí.

## 🎁 Nivel gratuito — cuánto obtienes

| Qué | Valor |
| --- | --- |
| Crédito de registro | **1.000.000 de unidades = $2** (`quota_for_new_user: 1000000`, `quota_per_unit: 500000`) |
| Prueba de gasto | tras 1 chat: `quota 1000000 → 999996, used_quota 4, request_count 1`; tras 2 chats: `999992 / 8 / 2` |
| Captcha | **ninguno** — `turnstile_check:false`, la página de registro no sirve ningún script de Turnstile |
| Barrera de correo | **6 caracteres hexadecimales**, ventana de 10 minutos, lista blanca de dominios: **gmail aceptado**, `mailtrap.io` / `vomoto.com` rechazados |
| Otras barreras | sin teléfono, sin OAuth (GitHub/Google/WeChat/LinuxDo/OIDC todos `false`), sin código de invitación, sin check-in diario |
| Catálogo | **34 ids de modelo** en `/v1/models` con una clave en vivo |
| La unidad que escala | **una cuenta = una clave** |

> 💡 El nivel gratuito lo define Genvís AI y puede cambiar. Consulta los números en vivo en [apitoken.fun](https://apitoken.fun) — y deja que la propia barrera de la herramienta decida:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelos — los 34

`GET /v1/models` con una clave en vivo lista **34 ids de modelo**. La línea de clave verificada es `deepseek-v4-flash` — la entrada más barata de la hoja de precios y el modelo con el que las 14 claves del carril respondieron `200` (`content:"ok"`).

| ID de modelo | Verificado |
| --- | --- |
| `deepseek-v4-flash` | **14 de 14 claves con chat-200** al acuñar, y de nuevo mediante `--verify-only` |
| `gemini-3.8-flash` · `gpt-5.6-luna` · `deepseek-v4-pro` · `glm-5.3` · `kimi-k3` · `grok-4.6` · `gpt-6-astra` · `nano-banana*` | listados por `/v1/models` con las mismas claves |

Ratios de precios en la propia hoja del panel (1× = el grupo predeterminado): `gemini-3.8-flash 0.045×`, `gpt-5.6-luna 0.1×`, `gemini-3.7-flash 0.45×`, `deepseek-v4-pro 0.66×`, `gpt-5.6-sol 2×`, `claude-opus-4-8 / claude-sonnet-5 / sora-2 37.5×` — así que una cuenta de $2 compra ~44 chats intensivos en deepseek-v4-flash o un puñado de llamadas de frontera.

```bash
curl https://apitoken.fun/v1/chat/completions \
  -H "Authorization: Bearer MpqWYXkvfV…" -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4-flash","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 Cómo usar la API

URL base **`https://apitoken.fun/v1`** — compatible con OpenAI. El panel también responde `/v1/messages` (formato Anthropic), `/v1beta/models/{model}:generateContent` (formato Gemini) y `/v1/images/generations`.

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

## 🛠 Inicio rápido

```bash
cd apitoken-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/launcher.js                     # interactive: mint / verify / screen / settings
# or: node src/cli.js --count 10 --pool proxies.txt
```

Una clave se escribe en `keys.txt` **solo** después de que `/v1/chat/completions` responda 200 con contenido real; `accounts.jsonl` conserva usuario / correo / quotaStart → quotaAfter / used. La ventana del buzón es de 300 s por defecto porque el correo con el código de este panel es lento — medido **157–176 s** tras el envío en las últimas cinco cuentas del carril.

### 🖱️ El lanzador

El lanzador pide la lista de proxies (opcional — sin una, la CLI se ejecuta directa) y la cantidad, las recuerda y ejecuta la CLI — acuñar, verificar, cribar salidas, ajustes, ayuda, Conectar a 9Router.

## ✅ Verificado y funcionando — cada clave se prueba

| Comprobación | Resultado |
| --- | --- |
| `GET /api/status` | **200** — `system_name:"Genvís AI"`, `register_enabled:true`, `email_verification:true`, `turnstile_check:false`, `checkin_enabled:false`, `quota_for_new_user:1000000`, `quota_per_unit:500000` |
| `GET /api/verification?email=…` | **200** `{"message":"","success":true}` (POST `/api/verification` y `/api/user/register/verify` responden `404 Invalid URL` en este fork) |
| `POST /api/user/register` | **200** `{"success":true}` — 14/14 cuentas |
| `POST /api/user/login` | **200** + JWT `access_token`; `/api/user/self` necesita ese token Bearer (una llamada solo con cookie responde `401 AUTH_UNAUTHORIZED`) |
| `POST /api/token/` | **200** — clave de 48 caracteres devuelta una vez (sin prefijo `sk-`), grupo `default` |
| `POST /v1/chat/completions` (`deepseek-v4-flash`) | **200** con `content:"ok"` en **14 de 14 claves**, tanto desde el arnés de acuñación como desde `--verify-only` de la CLI incluida |
| `GET /api/user/self` tras la barrera | `quota 1000000 → 999996`, `used_quota 0 → 4`, `request_count 0 → 1` — el crédito se factura de verdad |

## 🧭 Cómo funciona

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Genvís AI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://apitoken.fun/v1/chat/completions → real content = the key is live
```

| Paso | Llamada | Notas |
| --- | --- | --- |
| barreras | `GET /api/status` | registro activo, verificación por correo activa, captcha desactivado, crédito de registro de $2 |
| buzón | Emailnator `POST /api/generate-email` | un `@gmail.com` nuevo por cuenta, registrado en la forma **sin puntos** (la lista blanca del panel acepta gmail; la bandeja compartida es reciclada, así que las direcciones pueden ser ya conocidas) |
| línea base | `POST /api/message-list` | ids ya presentes en la bandeja — nunca se acepta nada más antiguo |
| enviar código | `GET /api/verification?email=…` | código de 6 hex, ventana de 10 minutos; ~20 s de espera ante limitación |
| código | sondear `/api/message-list` → `/api/message/<id>` | solo un correo **con marca coincidente** (`Genvís AI` / `genvis.xyz`) puede aportar el código — la bandeja está llena de códigos ajenos |
| registrar | `POST /api/user/register` | `{username,password,email,verification_code}` |
| iniciar sesión | `POST /api/user/login` | cookie de sesión **y** el `access_token` que el fork quiere como `Authorization: Bearer` |
| clave | `POST /api/token/` | clave de 48 caracteres, grupo `default` (alternativa: heredar), revelada una vez |
| prueba | `POST /v1/chat/completions` | 200 + contenido = conservar; luego otro `/api/user/self` registra la cuota que consumió la llamada |

## ⚙️ Opciones de la CLI

```bash
node src/cli.js --count 10            # mint 10 keys (one account each, chat gate per key)
node src/cli.js --model deepseek-v4-flash
node src/cli.js --mail-window 300     # seconds to wait for the code mail
node src/cli.js --verify-only         # re-check every key in keys.txt (--limit N to cap)
node src/cli.js --screen              # exit pool self-test
node src/cli.js --connect-9router     # register the provider + a key on a local 9Router
node src/cli.js --help
```

| Variable de entorno | Predeterminado | Significado |
| --- | --- | --- |
| `APITOKEN_PROXIES` | `proxies.txt` | grupo de salidas, una línea por proxy — opcional: sin un grupo, la CLI se conecta directamente |
| `APITOKEN_MODEL` | `deepseek-v4-flash` | modelo para la verificación en vivo |

## 🛰️ Detrás de un proxy

**Opcional — recomendado a escala (límites por IP, bloqueos).** La herramienta también funciona sin proxy.

- **Con un grupo:** pasa `--pool <file>` (o define `APITOKEN_PROXIES`) y cada solicitud pasa por una salida de esa lista — una línea muerta hace fallar ese intento y la CLI pasa a la siguiente salida. El carril de correo (Emailnator) pasa por la misma salida.
- **Sin un grupo:** la CLI imprime `running WITHOUT a proxy (direct)` y se conecta directamente. Nada del registro, la acuñación de claves o la verificación cambia — solo desde dónde salen los paquetes.
- Ejecuta `--screen` en cualquiera de los dos modos: prueba las salidas que tengas (o la ruta directa) contra Genvís AI antes de una ejecución real.

## 📄 Archivos

| Ruta | Contenido |
| --- | --- |
| `keys.txt` | una clave verificada en vivo por línea (48 caracteres) — ignorada por git |
| `accounts.jsonl` | usuario / correo / quotaStart → quotaAfter / usedStart → usedAfter / grupo / salida |
| `proxies.txt` | tus salidas — ignorado por git |
| `out/` | registros de ejecución — ignorados por git |

## 🔌 Conectar a 9Router

[9Router](https://9router.com) es un router autoalojado compatible con OpenAI:

```bash
node src/cli.js --connect-9router --9router-base http://localhost:20128 --9router-password 123456 --api-key MpqWYXkvfV…
```

Predeterminados: `--9router-prefix apitoken`, `--9router-name Genvís AI`, `--base-url https://apitoken.fun/v1`, `--model deepseek-v4-flash`. Los modelos se sirven como `apitoken/<model id>`.

## 🔑 Qué te da una clave

| | |
| --- | --- |
| 🏢 Proveedor | **Genvís AI** — [apitoken.fun](https://apitoken.fun) |
| 🎁 Qué da el proveedor | **$2 (1.000.000 de unidades)** al registrarte — sin captcha, sin check-in |
| 🔑 Qué te da una clave | una clave de 48 caracteres en su propia cuenta, verificada por chat en `deepseek-v4-flash` |
| 🌐 Formato de API | compatible con OpenAI: `POST https://apitoken.fun/v1/chat/completions` (también `/v1/messages`, `:generateContent`, `/v1/images/generations`) |
| 🔒 Tus datos | solo se contacta con `apitoken.fun` y tu backend de buzón; las claves permanecen en tu máquina |

## 🐞 Problemas

Si Genvís AI cambia sus barreras de registro (se publican en `/api/status`), su lista blanca de correo, la forma del código o el host de retransmisión, la herramienta se detiene en ese paso y lo indica — el cuerpo del rechazo se reporta textualmente. **[Abre un issue](../../issues)** con el comando y la salida exacta.

## 📄 Licencia

MIT © 2026 — consulta [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 apitoken-bulk-apikey contributors

</div>