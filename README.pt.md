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

**Crie contas Genvís AI em massa com chaves de API geradas automaticamente — inferência compatível com OpenAI + conector 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-34%20served-412991?style=for-the-badge)](https://apitoken.fun/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Início rápido](#-quick-start) · [🎁 Plano gratuito](#-free-tier--how-much-you-get) · [🤖 Modelos](#-models--all-34-of-them) · [🧪 Use a API](#-how-to-use-the-api) · [✅ Verificado](#-verified-working--every-key-is-tested) · [🧭 Como funciona](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Opções](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problemas](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Por que isto existe

Genvís AI (`apitoken.fun`) é um fork do New API que paga **1.000.000 de unidades de cota — $2 com `quota_per_unit: 500000` — para cada nova conta**, com **sem captcha** (`turnstile_check:false`, nenhum script Turnstile na página de registro) e **nenhum ritual de check-in para acompanhar**. O registro é um endereço de e-mail mais um código hexadecimal de 6 caracteres, e o crédito é real: medido no painel ao vivo, `GET /api/user/self` respondeu `quota: 1000000, used_quota: 0` logo após o cadastro e `quota: 999996, used_quota: 4, request_count: 1` após uma chamada `deepseek-v4-flash` — cada chat-200 move o número. A própria execução da lane cunhou **14 contas → 14 chaves, todas mantidas apenas após um chat 200 ao vivo** (10 pelo harness em massa em uma saída WARP, 4 pelo próprio caminho `--count` desta CLI), e a CLI fornecida as retesta a qualquer momento com `--verify-only` (**14/14 ao vivo** em 2026-10-21). O único portão real é a caixa de correio: o painel impõe uma **lista de domínios de e-mail permitidos** (gmail aceito; mailtrap.io e vomoto.com recusados no lado do servidor), e as caixas gmail que ele aceita vêm de uma **caixa de entrada compartilhada reciclada** que também carrega o correio de outras pessoas — então a ferramenta pega seu código apenas de um e-mail que seja mais novo que o snapshot pré-envio *e* que nomeie este painel (`mail.genvis.xyz` (remetente), assunto `Genvís AI邮箱验证邮件`). Um código estrangeiro registrado uma vez no laboratório respondeu `Verification code is incorrect or has expired`; essa armadilha está fechada aqui.

## 🎁 Plano gratuito — quanto você recebe

| O quê | Valor |
| --- | --- |
| Crédito de cadastro | **1.000.000 de unidades = $2** (`quota_for_new_user: 1000000`, `quota_per_unit: 500000`) |
| Prova de gasto | após 1 chat: `quota 1000000 → 999996, used_quota 4, request_count 1`; após 2 chats: `999992 / 8 / 2` |
| Captcha | **nenhum** — `turnstile_check:false`, a página de registro não serve nenhum script Turnstile |
| Portão de e-mail | **6 caracteres hexadecimais**, janela de 10 minutos, lista de domínios permitidos: **gmail aceito**, `mailtrap.io` / `vomoto.com` recusados |
| Outros portões | sem telefone, sem OAuth (GitHub/Google/WeChat/LinuxDo/OIDC todos `false`), sem código de convite, sem check-in diário |
| Catálogo | **34 ids de modelo** em `/v1/models` com uma chave ao vivo |
| A unidade que escala | **uma conta = uma chave** |

> 💡 O plano gratuito é definido pela Genvís AI e pode mudar. Confira os números ao vivo em [apitoken.fun](https://apitoken.fun) — e deixe o próprio portão da ferramenta decidir:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelos — todos os 34

`GET /v1/models` com uma chave ao vivo lista **34 ids de modelo**. A linha de chave verificada é `deepseek-v4-flash` — a entrada mais barata na tabela de preços e o modelo com o qual todas as 14 chaves da lane responderam `200` (`content:"ok"`).

| ID do modelo | Verificado |
| --- | --- |
| `deepseek-v4-flash` | **14 de 14 chaves chat-200** na cunhagem, e novamente via `--verify-only` |
| `gemini-3.8-flash` · `gpt-5.6-luna` · `deepseek-v4-pro` · `glm-5.3` · `kimi-k3` · `grok-4.6` · `gpt-6-astra` · `nano-banana*` | listados por `/v1/models` nas mesmas chaves |

Razões de preço na própria tabela do painel (1× = o grupo padrão): `gemini-3.8-flash 0.045×`, `gpt-5.6-luna 0.1×`, `gemini-3.7-flash 0.45×`, `deepseek-v4-pro 0.66×`, `gpt-5.6-sol 2×`, `claude-opus-4-8 / claude-sonnet-5 / sora-2 37.5×` — então uma conta de $2 compra ~44 chats pesados de deepseek-v4-flash ou um punhado de chamadas de fronteira.

```bash
curl https://apitoken.fun/v1/chat/completions \
  -H "Authorization: Bearer MpqWYXkvfV…" -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4-flash","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 Como usar a API

URL base **`https://apitoken.fun/v1`** — compatível com OpenAI. O painel também responde `/v1/messages` (formato Anthropic), `/v1beta/models/{model}:generateContent` (formato Gemini) e `/v1/images/generations`.

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

## 🛠 Início rápido

```bash
cd apitoken-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/launcher.js                     # interactive: mint / verify / screen / settings
# or: node src/cli.js --count 10 --pool proxies.txt
```

Uma chave é escrita em `keys.txt` **apenas** após `/v1/chat/completions` responder 200 com conteúdo real; `accounts.jsonl` mantém username / e-mail / quotaStart → quotaAfter / used. A janela da caixa de correio tem como padrão 300 s porque o e-mail de código deste painel é lento — medido **157–176 s** após o envio nas últimas cinco contas da lane.

### 🖱️ O launcher

O launcher pede a lista de proxies (opcional — sem uma, a CLI roda direto) e a contagem, lembra delas e executa a CLI — mint, verify, screen exits, settings, help, Connect to 9Router.

## ✅ Verificado e funcionando — toda chave é testada

| Verificação | Resultado |
| --- | --- |
| `GET /api/status` | **200** — `system_name:"Genvís AI"`, `register_enabled:true`, `email_verification:true`, `turnstile_check:false`, `checkin_enabled:false`, `quota_for_new_user:1000000`, `quota_per_unit:500000` |
| `GET /api/verification?email=…` | **200** `{"message":"","success":true}` (POST `/api/verification` e `/api/user/register/verify` respondem `404 Invalid URL` neste fork) |
| `POST /api/user/register` | **200** `{"success":true}` — 14/14 contas |
| `POST /api/user/login` | **200** + `access_token` JWT; `/api/user/self` precisa desse token Bearer (uma chamada apenas com cookie é respondida com `401 AUTH_UNAUTHORIZED`) |
| `POST /api/token/` | **200** — chave de 48 caracteres retornada uma vez (sem prefixo `sk-`), grupo `default` |
| `POST /v1/chat/completions` (`deepseek-v4-flash`) | **200** com `content:"ok"` em **14 de 14 chaves**, tanto pelo harness de cunhagem quanto pelo `--verify-only` da CLI fornecida |
| `GET /api/user/self` após o portão | `quota 1000000 → 999996`, `used_quota 0 → 4`, `request_count 0 → 1` — o crédito é realmente cobrado |

## 🧭 Como funciona

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Genvís AI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://apitoken.fun/v1/chat/completions → real content = the key is live
```

| Etapa | Chamada | Notas |
| --- | --- | --- |
| portões | `GET /api/status` | registro ativo, verificação de e-mail ativa, captcha desativado, crédito de cadastro de $2 |
| caixa de correio | Emailnator `POST /api/generate-email` | um `@gmail.com` novo por conta, registrado na forma **sem pontos** (a lista de permitidos do painel aceita gmail; a caixa compartilhada é reciclada, então endereços podem já ser conhecidos) |
| linha de base | `POST /api/message-list` | ids já na caixa — nada mais antigo é aceito |
| enviar código | `GET /api/verification?email=…` | código de 6 hexadecimais, janela de 10 minutos; ~20 s de back-off em throttling |
| código | poll `/api/message-list` → `/api/message/<id>` | apenas um e-mail **com marca correspondente** (`Genvís AI` / `genvis.xyz`) pode fornecer o código — a caixa está cheia de códigos estrangeiros |
| registrar | `POST /api/user/register` | `{username,password,email,verification_code}` |
| login | `POST /api/user/login` | cookie de sessão **e** o `access_token` que o fork quer como `Authorization: Bearer` |
| chave | `POST /api/token/` | chave de 48 caracteres, grupo `default` (fallback: inherit), revelada uma vez |
| prova | `POST /v1/chat/completions` | 200 + conteúdo = manter; então mais um `/api/user/self` registra a cota que a chamada consumiu |

## ⚙️ Opções da CLI

```bash
node src/cli.js --count 10            # mint 10 keys (one account each, chat gate per key)
node src/cli.js --model deepseek-v4-flash
node src/cli.js --mail-window 300     # seconds to wait for the code mail
node src/cli.js --verify-only         # re-check every key in keys.txt (--limit N to cap)
node src/cli.js --screen              # exit pool self-test
node src/cli.js --connect-9router     # register the provider + a key on a local 9Router
node src/cli.js --help
```

| Env | Padrão | Significado |
| --- | --- | --- |
| `APITOKEN_PROXIES` | `proxies.txt` | pool de saída, uma linha por proxy — opcional: sem um pool a CLI conecta diretamente |
| `APITOKEN_MODEL` | `deepseek-v4-flash` | modelo para a verificação ao vivo |

## 🛰️ Atrás de um proxy

**Opcional — recomendado em escala (limites por IP, banimentos).** A ferramenta também funciona sem proxy.

- **Com um pool:** passe `--pool <file>` (ou defina `APITOKEN_PROXIES`) e cada requisição passa por uma saída dessa lista — uma linha morta falha naquela tentativa e a CLI passa para a próxima saída. O trilho de correio (Emailnator) passa pela mesma saída.
- **Sem um pool:** a CLI imprime `running WITHOUT a proxy (direct)` e conecta diretamente. Nada sobre cadastro, cunhagem de chave ou verificação muda — apenas de onde os pacotes saem.
- Execute `--screen` em qualquer um dos modos: ele testa as saídas que você tem (ou a rota direta) contra a Genvís AI antes de uma execução real.

## 📄 Arquivos

| Caminho | Conteúdo |
| --- | --- |
| `keys.txt` | uma chave verificada ao vivo por linha (48 caracteres) — ignorado pelo git |
| `accounts.jsonl` | username / e-mail / quotaStart → quotaAfter / usedStart → usedAfter / group / exit |
| `proxies.txt` | suas saídas — ignorado pelo git |
| `out/` | logs de execução — ignorado pelo git |

## 🔌 Conectar ao 9Router

[9Router](https://9router.com) é um roteador auto-hospedado e compatível com OpenAI:

```bash
node src/cli.js --connect-9router --9router-base http://localhost:20128 --9router-password 123456 --api-key MpqWYXkvfV…
```

Padrões: `--9router-prefix apitoken`, `--9router-name Genvís AI`, `--base-url https://apitoken.fun/v1`, `--model deepseek-v4-flash`. Os modelos são servidos como `apitoken/<model id>`.

## 🔑 O que uma chave te dá

| | |
| --- | --- |
| 🏢 Provedor | **Genvís AI** — [apitoken.fun](https://apitoken.fun) |
| 🎁 O que o provedor dá | **$2 (1.000.000 de unidades)** no cadastro — sem captcha, sem check-in |
| 🔑 O que uma chave te dá | uma chave de 48 caracteres em sua própria conta, verificada por chat em `deepseek-v4-flash` |
| 🌐 Formato da API | Compatível com OpenAI: `POST https://apitoken.fun/v1/chat/completions` (também `/v1/messages`, `:generateContent`, `/v1/images/generations`) |
| 🔒 Seus dados | apenas `apitoken.fun` e seu backend de caixa de entrada são contatados; as chaves ficam na sua máquina |

## 🐞 Problemas

Se a Genvís AI mudar seus portões de registro (eles são publicados em `/api/status`), sua lista de permitidos de correio, o formato do código ou o host de relay, a ferramenta para nessa etapa e avisa — o corpo da recusa é reportado literalmente. **[Abra uma issue](../../issues)** com o comando e a saída exata.

## 📄 Licença

MIT © 2026 — veja [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 apitoken-bulk-apikey contributors

</div>