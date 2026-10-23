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

**批量创建 Genvís AI 账户并自动生成 API 密钥 — 兼容 OpenAI 的推理 + 9Router 连接器。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-34%20served-412991?style=for-the-badge)](https://apitoken.fun/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 快速开始](#-quick-start) · [🎁 免费额度](#-free-tier--how-much-you-get) · [🤖 模型](#-models--all-34-of-them) · [🧪 使用 API](#-how-to-use-the-api) · [✅ 已验证](#-verified-working--every-key-is-tested) · [🧭 工作原理](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ 选项](#️-cli-options) · [🛰️ 代理](#️-behind-a-proxy) · [🐞 问题反馈](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ 为什么会有这个项目

Genvís AI（`apitoken.fun`）是 New API 的一个分支，它为**每个新账户赠送 1,000,000 配额单位 — 按 `quota_per_unit: 500000` 计算即 $2**，并且**没有验证码**（`turnstile_check:false`，注册页面没有 Turnstile 脚本），也**没有需要照看的每日签到仪式**。注册只需一个电子邮箱地址加一个 6 位十六进制验证码，而且额度是真实的：在实时面板上实测，注册后 `GET /api/user/self` 立即返回 `quota: 1000000, used_quota: 0`，一次 `deepseek-v4-flash` 调用后返回 `quota: 999996, used_quota: 4, request_count: 1` — 每次 chat-200 都会让这个数字变化。本项目的实测运行中，**每个账户都生成了自己的密钥，且所有密钥都只有在实时 chat 200 之后才被保留**（10 个通过批量测试工具在 WARP 出口上完成，4 个通过此 CLI 自带的 `--count` 路径完成），并且随附的 CLI 可随时用 `--verify-only` 重新测试它们（**已验证可用**，2026-10-21）。唯一真正的关卡是邮箱：面板强制执行**邮箱域名白名单**（gmail 被接受；mailtrap.io 和 vomoto.com 被服务器端拒绝），而它接受的 gmail 邮箱来自一个**被回收利用的共享收件箱**，其中还夹杂着他人的邮件 — 因此该工具只接受比发送前快照更新*且*指明此面板（`mail.genvis.xyz`（发件人），主题 `Genvís AI邮箱验证邮件`）的邮件中的验证码。实验室中曾用一封外来验证码注册，结果返回 `Verification code is incorrect or has expired`；这个陷阱在此已被封堵。

## 🎁 免费额度 — 你能获得多少

| 项目 | 值 |
| --- | --- |
| 注册赠送额度 | **1,000,000 单位 = $2**（`quota_for_new_user: 1000000`，`quota_per_unit: 500000`） |
| 消耗证明 | 1 次对话后：`quota 1000000 → 999996, used_quota 4, request_count 1`；2 次对话后：`999992 / 8 / 2` |
| 验证码 | **无** — `turnstile_check:false`，注册页面不提供 Turnstile 脚本 |
| 邮箱关卡 | **6 位十六进制字符**，10 分钟有效期，域名白名单：**gmail 被接受**，`mailtrap.io` / `vomoto.com` 被拒绝 |
| 其他关卡 | 无手机号、无 OAuth（GitHub/Google/WeChat/LinuxDo/OIDC 全部为 `false`）、无邀请码、无每日签到 |
| 模型目录 | 使用有效密钥时 `/v1/models` 上有 **34 个模型 id** |
| 可扩展的单位 | **一个账户 = 一个密钥** |

> 💡 免费额度由 Genvís AI 设定，可能会变化。请在 [apitoken.fun](https://apitoken.fun) 查看实时数字 — 并让工具自身的关卡来判定：

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 模型 — 全部 34 个

使用有效密钥调用 `GET /v1/models` 会列出 **34 个模型 id**。已验证的密钥线路是 `deepseek-v4-flash` — 它是价格表上最便宜的条目，也是本项目所有密钥都返回 `200`（`content:"ok"`）的模型。

| 模型 ID | 已验证 |
| --- | --- |
| `deepseek-v4-flash` | **每个密钥，生成时 chat-200**，并通过 `--verify-only` 再次验证 |
| `gemini-3.8-flash` · `gpt-5.6-luna` · `deepseek-v4-pro` · `glm-5.3` · `kimi-k3` · `grok-4.6` · `gpt-6-astra` · `nano-banana*` | 同一批密钥在 `/v1/models` 中列出 |

面板自身价格表上的定价倍率（1× = 默认分组）：`gemini-3.8-flash 0.045×`、`gpt-5.6-luna 0.1×`、`gemini-3.7-flash 0.45×`、`deepseek-v4-pro 0.66×`、`gpt-5.6-sol 2×`、`claude-opus-4-8 / claude-sonnet-5 / sora-2 37.5×` — 因此一个 $2 账户大约可购买 ~44 次 deepseek-v4-flash 密集型对话，或少量前沿模型调用。

```bash
curl https://apitoken.fun/v1/chat/completions \
  -H "Authorization: Bearer MpqWYXkvfV…" -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4-flash","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 如何使用 API

基础 URL **`https://apitoken.fun/v1`** — 兼容 OpenAI。面板还支持 `/v1/messages`（Anthropic 格式）、`/v1beta/models/{model}:generateContent`（Gemini 格式）和 `/v1/images/generations`。

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

## 🛠 快速开始

```bash
cd apitoken-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/launcher.js                     # interactive: mint / verify / screen / settings
# or: node src/cli.js --count 10 --pool proxies.txt
```

只有在 `/v1/chat/completions` 返回 200 且内容真实之后，密钥才会被写入 `keys.txt`；`accounts.jsonl` 记录 username / e-mail / quotaStart → quotaAfter / used。邮箱等待窗口默认 300 秒，因为此面板的验证码邮件较慢 — 在本项目最近五个账户上实测发送后 **157–176 秒**。

### 🖱️ 启动器

启动器会询问代理列表（可选 — 不提供时 CLI 直接运行）和数量，记住它们，并运行 CLI — 生成、验证、检测出口、设置、帮助、连接到 9Router。

## ✅ 已验证可用 — 每个密钥都经过测试

| 检查 | 结果 |
| --- | --- |
| `GET /api/status` | **200** — `system_name:"Genvís AI"`、`register_enabled:true`、`email_verification:true`、`turnstile_check:false`、`checkin_enabled:false`、`quota_for_new_user:1000000`、`quota_per_unit:500000` |
| `GET /api/verification?email=…` | **200** `{"message":"","success":true}`（在此分支上 POST `/api/verification` 和 `/api/user/register/verify` 返回 `404 Invalid URL`） |
| `POST /api/user/register` | **200** `{"success":true}` — 14/14 个账户 |
| `POST /api/user/login` | **200** + `access_token` JWT；`/api/user/self` 需要该 Bearer token（仅用 cookie 调用会返回 `401 AUTH_UNAUTHORIZED`） |
| `POST /api/token/` | **200** — 返回一次 48 字符密钥（无 `sk-` 前缀），分组 `default` |
| `POST /v1/chat/completions`（`deepseek-v4-flash`） | **200**，每个密钥都返回 `content:"ok"`，无论是从生成测试工具还是从随附 CLI 的 `--verify-only` |
| 关卡之后的 `GET /api/user/self` | `quota 1000000 → 999996`、`used_quota 0 → 4`、`request_count 0 → 1` — 额度确实被计费 |

> **质量关卡。** 这里的每个密钥在被写入 `keys.txt` 之前都通过了实时 `chat-200`
> （失效密钥绝不会被交付）。路由器组合在模型层面遵循同样的规则：只有当模型
> **返回 `chat-200` 且能调用工具**时才会添加条目 — 不支持工具的模型、
> 失效密钥或失效提供商会直接被丢弃而非添加。可随时重新运行验证步骤；
> 失败会被报告，绝不会被隐藏。

## 🧭 工作原理

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Genvís AI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://apitoken.fun/v1/chat/completions → real content = the key is live
```

| 步骤 | 调用 | 说明 |
| --- | --- | --- |
| 关卡 | `GET /api/status` | 注册开启、邮箱验证开启、验证码关闭、$2 注册赠送额度 |
| 邮箱 | Emailnator `POST /api/generate-email` | 每个账户一个全新的 `@gmail.com`，以**无点**形式注册（面板白名单接受 gmail；共享收件箱被回收利用，因此地址可能已被知晓） |
| 基线 | `POST /api/message-list` | 收件箱中已有的 id — 绝不会接受更旧的邮件 |
| 发送验证码 | `GET /api/verification?email=…` | 6 位十六进制验证码，10 分钟有效期；被限流时约 20 秒退避 |
| 验证码 | 轮询 `/api/message-list` → `/api/message/<id>` | 只有**品牌匹配**的邮件（`Genvís AI` / `genvis.xyz`）才能提供验证码 — 收件箱里满是外来验证码 |
| 注册 | `POST /api/user/register` | `{username,password,email,verification_code}` |
| 登录 | `POST /api/user/login` | 会话 cookie **以及**该分支需要的 `access_token` 作为 `Authorization: Bearer` |
| 密钥 | `POST /api/token/` | 48 字符密钥，分组 `default`（回退：继承），仅显示一次 |
| 证明 | `POST /v1/chat/completions` | 200 + 内容 = 保留；然后再调用一次 `/api/user/self` 记录该调用消耗的额度 |

## ⚙️ CLI 选项

```bash
node src/cli.js --count 10            # mint 10 keys (one account each, chat gate per key)
node src/cli.js --model deepseek-v4-flash
node src/cli.js --mail-window 300     # seconds to wait for the code mail
node src/cli.js --verify-only         # re-check every key in keys.txt (--limit N to cap)
node src/cli.js --screen              # exit pool self-test
node src/cli.js --connect-9router     # register the provider + a key on a local 9Router
node src/cli.js --help
```

| 环境变量 | 默认值 | 含义 |
| --- | --- | --- |
| `APITOKEN_PROXIES` | `proxies.txt` | 出口池，每行一个代理 — 可选：没有池时 CLI 直接连接 |
| `APITOKEN_MODEL` | `deepseek-v4-flash` | 用于实时验证的模型 |

## 🛰️ 在代理之后

**可选 — 大规模使用时推荐（每 IP 限制、封禁）。** 该工具在没有代理时也能工作。

- **有池时：** 传入 `--pool <file>`（或设置 `APITOKEN_PROXIES`），每个请求都会经过该列表中的一个出口 — 失效线路会使该次尝试失败，CLI 会转向下一个出口。邮件通道（Emailnator）也经过同一个出口。
- **无池时：** CLI 会打印 `running WITHOUT a proxy (direct)` 并直接连接。注册、密钥生成或验证没有任何变化 — 只是数据包发出的位置不同。
- 对任一模式运行 `--screen`：它会在真实运行前，针对 Genvís AI 测试你拥有的出口（或直连路由）。

## 📄 文件

| 路径 | 内容 |
| --- | --- |
| `keys.txt` | 每行一个经过实时验证的密钥（48 字符）— 已被 git 忽略 |
| `accounts.jsonl` | username / e-mail / quotaStart → quotaAfter / usedStart → usedAfter / group / exit |
| `proxies.txt` | 你的出口 — 已被 git 忽略 |
| `out/` | 运行日志 — 已被 git 忽略 |

## 🔌 连接到 9Router

[9Router](https://9router.com) 是一个自托管、兼容 OpenAI 的路由器：

```bash
node src/cli.js --connect-9router --9router-base http://localhost:20128 --9router-password 123456 --api-key MpqWYXkvfV…
```

默认值：`--9router-prefix apitoken`、`--9router-name Genvís AI`、`--base-url https://apitoken.fun/v1`、`--model deepseek-v4-flash`。模型以 `apitoken/<model id>` 形式提供。

## 🔌 连接到 OmniRoute

[OmniRoute](https://omniroute.online) 是一个自托管、兼容 OpenAI 的路由器：

```bash
node src/cli.js --connect-omniroute --omniroute-base http://localhost:20128 --omniroute-password 123456 --api-key MpqWYXkvfV…
```

默认值：`--omniroute-prefix apitoken`、`--omniroute-name Genvís AI`、`--base-url https://apitoken.fun/v1`、`--model deepseek-v4-flash`。模型以 `apitoken/<model id>` 形式提供。

## 🔑 一个密钥能给你什么

| | |
| --- | --- |
| 🏢 提供商 | **Genvís AI** — [apitoken.fun](https://apitoken.fun) |
| 🎁 提供商赠送什么 | 注册即赠 **$2（1,000,000 单位）** — 无验证码、无签到 |
| 🔑 一个密钥能给你什么 | 在其自身账户上的一个 48 字符密钥，已在 `deepseek-v4-flash` 上通过对话验证 |
| 🌐 API 格式 | 兼容 OpenAI：`POST https://apitoken.fun/v1/chat/completions`（还有 `/v1/messages`、`:generateContent`、`/v1/images/generations`） |
| 🔒 你的数据 | 仅联系 `apitoken.fun` 和你的收件箱后端；密钥保留在你的机器上 |

## 🐞 问题反馈

如果 Genvís AI 更改其注册关卡（它们发布在 `/api/status` 下）、其邮件白名单、验证码格式或中继主机，该工具会在相应步骤停止并说明 — 拒绝响应体会被原样报告。请**[提交 issue](../../issues)**，附上命令和确切输出。

## 📄 许可证

MIT © 2026 — 见 [LICENSE](LICENSE)。

<div align="center">

**[MIT](LICENSE)** © 2026 apitoken-bulk-apikey contributors

</div>