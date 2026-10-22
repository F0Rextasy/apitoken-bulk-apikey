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

**Genvís AI アカウントを自動生成された API キーとともに一括作成 — OpenAI 互換の推論 + 9Router コネクタ。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-34%20served-412991?style=for-the-badge)](https://apitoken.fun/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 クイックスタート](#-quick-start) · [🎁 無料枠](#-free-tier--how-much-you-get) · [🤖 モデル](#-models--all-34-of-them) · [🧪 API の使い方](#-how-to-use-the-api) · [✅ 検証済み](#-verified-working--every-key-is-tested) · [🧭 仕組み](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ オプション](#️-cli-options) · [🛰️ プロキシ](#️-behind-a-proxy) · [🐞 問題報告](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ これが存在する理由

Genvís AI (`apitoken.fun`) は New API のフォークであり、**新規アカウントごとに 1,000,000 クォータ単位 — `quota_per_unit: 500000` で $2 相当 —** を支払い、**キャプチャなし** (`turnstile_check:false`、登録ページに Turnstile スクリプトなし)、**面倒を見る必要のあるチェックイン儀式もなし**です。登録はメールアドレスと 6 文字の 16 進コードだけで、クレジットは本物です。ライブパネルで計測すると、`GET /api/user/self` はサインアップ直後に `quota: 1000000, used_quota: 0` を返し、`deepseek-v4-flash` を 1 回呼び出した後は `quota: 999996, used_quota: 4, request_count: 1` を返しました — チャット 200 のたびに数値が動きます。このレーンの実行自体が **14 アカウント → 14 キーを鋳造し、そのすべてがライブチャット 200 の後にのみ保持され** (10 は 代理出口での一括ハーネス経由、4 はこの CLI 自身の `--count` パス経由)、同梱の CLI は `--verify-only` でいつでも再テストできます (2026-10-21 時点で **14/14 ライブ**)。唯一の本当の関門はメールボックスです。パネルは **メールドメインのホワイトリスト**を強制し (gmail は受け入れ、mailtrap.io と vomoto.com はサーバー側で拒否)、受け入れる gmail ボックスは**リサイクルされた共有受信箱**から来ており、他人のメールも運んでいます — そのためツールは、送信前スナップショットより新しいメールで、*かつ*このパネルを名指しするもの (`mail.genvis.xyz` (送信者)、件名 `Genvís AI邮箱验证邮件`) からのみコードを取得します。ラボで一度登録された外部のコードは `Verification code is incorrect or has expired` を返しました。その罠はここで塞がれています。

## 🎁 無料枠 — どれだけ得られるか

| 項目 | 値 |
| --- | --- |
| サインアップクレジット | **1,000,000 単位 = $2** (`quota_for_new_user: 1000000`, `quota_per_unit: 500000`) |
| 消費の証明 | チャット 1 回後: `quota 1000000 → 999996, used_quota 4, request_count 1`、チャット 2 回後: `999992 / 8 / 2` |
| キャプチャ | **なし** — `turnstile_check:false`、登録ページは Turnstile スクリプトを配信しない |
| メール関門 | **6 文字の 16 進数**、10 分間の有効期限、ドメインホワイトリスト: **gmail は受け入れ**、`mailtrap.io` / `vomoto.com` は拒否 |
| その他の関門 | 電話番号なし、OAuth なし (GitHub/Google/WeChat/LinuxDo/OIDC すべて `false`)、招待コードなし、毎日のチェックインなし |
| カタログ | ライブキーで `/v1/models` に **34 のモデル ID** |
| スケールする単位 | **1 アカウント = 1 キー** |

> 💡 無料枠は Genvís AI によって設定されており、変更される可能性があります。最新の数値は [apitoken.fun](https://apitoken.fun) で確認してください — そしてツール自身の関門に判断を委ねてください:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 モデル — そのすべて 34 種

ライブキーで `GET /v1/models` は **34 のモデル ID** を列挙します。検証済みのキー行は `deepseek-v4-flash` です — 価格表で最も安いエントリであり、このレーンの 14 キーすべてが `200` を返したモデルです (`content:"ok"`)。

| モデル ID | 検証済み |
| --- | --- |
| `deepseek-v4-flash` | 鋳造時に **14 キー中 14 がチャット 200**、そして `--verify-only` 経由でも再度 |
| `gemini-3.8-flash` · `gpt-5.6-luna` · `deepseek-v4-pro` · `glm-5.3` · `kimi-k3` · `grok-4.6` · `gpt-6-astra` · `nano-banana*` | 同じキーで `/v1/models` により列挙 |

パネル自身の表における価格比率 (1× = デフォルトグループ): `gemini-3.8-flash 0.045×`、`gpt-5.6-luna 0.1×`、`gemini-3.7-flash 0.45×`、`deepseek-v4-pro 0.66×`、`gpt-5.6-sol 2×`、`claude-opus-4-8 / claude-sonnet-5 / sora-2 37.5×` — つまり $2 のアカウントで約 44 回の deepseek-v4-flash 重視のチャット、またはフロンティア呼び出しを数回分購入できます。

```bash
curl https://apitoken.fun/v1/chat/completions \
  -H "Authorization: Bearer MpqWYXkvfV…" -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4-flash","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 API の使い方

ベース URL **`https://apitoken.fun/v1`** — OpenAI 互換。パネルは `/v1/messages` (Anthropic 形式)、`/v1beta/models/{model}:generateContent` (Gemini 形式)、`/v1/images/generations` にも応答します。

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

## 🛠 クイックスタート

```bash
cd apitoken-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/launcher.js                     # interactive: mint / verify / screen / settings
# or: node src/cli.js --count 10 --pool proxies.txt
```

キーは `/v1/chat/completions` が実際のコンテンツとともに 200 を返した**後にのみ** `keys.txt` に書き込まれます。`accounts.jsonl` は username / e-mail / quotaStart → quotaAfter / used を保持します。このパネルのコードメールは遅いため、メールボックスのウィンドウはデフォルトで 300 秒です — このレーンの直近 5 アカウントでは送信後 **157〜176 秒**を計測しました。

### 🖱️ ランチャー

ランチャーはプロキシリスト (任意 — なしの場合は CLI は直接実行) と件数を尋ね、それらを記憶して CLI を実行します — mint、verify、screen exits、settings、help、Connect to 9Router。

## ✅ 動作検証済み — すべてのキーがテストされる

| チェック | 結果 |
| --- | --- |
| `GET /api/status` | **200** — `system_name:"Genvís AI"`, `register_enabled:true`, `email_verification:true`, `turnstile_check:false`, `checkin_enabled:false`, `quota_for_new_user:1000000`, `quota_per_unit:500000` |
| `GET /api/verification?email=…` | **200** `{"message":"","success":true}` (このフォークでは POST `/api/verification` と `/api/user/register/verify` は `404 Invalid URL` を返す) |
| `POST /api/user/register` | **200** `{"success":true}` — 14/14 アカウント |
| `POST /api/user/login` | **200** + `access_token` JWT、`/api/user/self` にはその Bearer トークンが必要 (Cookie のみの呼び出しは `401 AUTH_UNAUTHORIZED` を返す) |
| `POST /api/token/` | **200** — 48 文字のキーが一度だけ返される (`sk-` プレフィックスなし)、グループ `default` |
| `POST /v1/chat/completions` (`deepseek-v4-flash`) | **14 キー中 14** で `content:"ok"` とともに **200**、鋳造ハーネスからも同梱 CLI の `--verify-only` からも |
| 関門後の `GET /api/user/self` | `quota 1000000 → 999996`、`used_quota 0 → 4`、`request_count 0 → 1` — クレジットは実際に課金される |

## 🧭 仕組み

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Genvís AI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://apitoken.fun/v1/chat/completions → real content = the key is live
```

| ステップ | 呼び出し | 備考 |
| --- | --- | --- |
| 関門 | `GET /api/status` | 登録オン、メール検証オン、キャプチャオフ、$2 のサインアップクレジット |
| メールボックス | Emailnator `POST /api/generate-email` | アカウントごとに 1 つの新しい `@gmail.com`、**ドットなし**の形式で登録 (パネルのホワイトリストは gmail を受け入れる。共有ボックスはリサイクルされるため、アドレスは既に知られている可能性がある) |
| ベースライン | `POST /api/message-list` | ボックスに既にある ID — それより古いものは決して受け入れられない |
| コード送信 | `GET /api/verification?email=…` | 6 桁の 16 進コード、10 分間の有効期限、スロットリング時は約 20 秒のバックオフ |
| コード | `/api/message-list` → `/api/message/<id>` をポーリング | **ブランド一致**のメール (`Genvís AI` / `genvis.xyz`) のみがコードを提供できる — ボックスは外部のコードでいっぱい |
| 登録 | `POST /api/user/register` | `{username,password,email,verification_code}` |
| ログイン | `POST /api/user/login` | セッション Cookie **および**フォークが `Authorization: Bearer` として要求する `access_token` |
| キー | `POST /api/token/` | 48 文字のキー、グループ `default` (フォールバック: inherit)、一度だけ表示 |
| 証明 | `POST /v1/chat/completions` | 200 + コンテンツ = 保持、その後もう一度 `/api/user/self` で呼び出しが消費したクォータを記録 |

## ⚙️ CLI オプション

```bash
node src/cli.js --count 10            # mint 10 keys (one account each, chat gate per key)
node src/cli.js --model deepseek-v4-flash
node src/cli.js --mail-window 300     # seconds to wait for the code mail
node src/cli.js --verify-only         # re-check every key in keys.txt (--limit N to cap)
node src/cli.js --screen              # exit pool self-test
node src/cli.js --connect-9router     # register the provider + a key on a local 9Router
node src/cli.js --help
```

| 環境変数 | デフォルト | 意味 |
| --- | --- | --- |
| `APITOKEN_PROXIES` | `proxies.txt` | 出口プール、1 行につき 1 プロキシ — 任意: プールなしの場合 CLI は直接接続 |
| `APITOKEN_MODEL` | `deepseek-v4-flash` | ライブ検証用のモデル |

## 🛰️ プロキシの背後で

**任意 — 大規模時は推奨 (IP ごとの制限、BAN)。** ツールはプロキシなしでも動作します。

- **プールあり:** `--pool <file>` を渡す (または `APITOKEN_PROXIES` を設定する) と、すべてのリクエストがそのリストの出口を経由します — 死んだ回線はその試行を失敗させ、CLI は次の出口に移ります。メールレール (Emailnator) も同じ出口を経由します。
- **プールなし:** CLI は `running WITHOUT a proxy (direct)` と表示し、直接接続します。サインアップ、キー鋳造、検証について何も変わりません — パケットが出ていく場所だけが変わります。
- どちらのモードでも `--screen` を実行してください: 実際の実行前に、持っている出口 (または直接ルート) を Genvís AI に対してテストします。

## 📄 ファイル

| パス | 内容 |
| --- | --- |
| `keys.txt` | 1 行につき 1 つのライブ検証済みキー (48 文字) — git 無視 |
| `accounts.jsonl` | username / e-mail / quotaStart → quotaAfter / usedStart → usedAfter / group / exit |
| `proxies.txt` | あなたの出口 — git 無視 |
| `out/` | 実行ログ — git 無視 |

## 🔌 9Router に接続

[9Router](https://9router.com) はセルフホスト型の OpenAI 互換ルーターです:

```bash
node src/cli.js --connect-9router --9router-base http://localhost:20128 --9router-password 123456 --api-key MpqWYXkvfV…
```

デフォルト: `--9router-prefix apitoken`、`--9router-name Genvís AI`、`--base-url https://apitoken.fun/v1`、`--model deepseek-v4-flash`。モデルは `apitoken/<model id>` として提供されます。

## 🔌 OmniRoute に接続

[OmniRoute](https://omniroute.online) はセルフホスト型の OpenAI 互換ルーターです:

```bash
node src/cli.js --connect-omniroute --omniroute-base http://localhost:20128 --omniroute-password 123456 --api-key MpqWYXkvfV…
```

デフォルト: `--omniroute-prefix apitoken`、`--omniroute-name Genvís AI`、`--base-url https://apitoken.fun/v1`、`--model deepseek-v4-flash`。モデルは `apitoken/<model id>` として提供されます。
## 🔑 1 つのキーで得られるもの

| | |
| --- | --- |
| 🏢 プロバイダー | **Genvís AI** — [apitoken.fun](https://apitoken.fun) |
| 🎁 プロバイダーが提供するもの | サインアップ時に **$2 (1,000,000 単位)** — キャプチャなし、チェックインなし |
| 🔑 1 つのキーで得られるもの | 独自のアカウント上の 48 文字のキー 1 つ、`deepseek-v4-flash` でチャット検証済み |
| 🌐 API 形式 | OpenAI 互換: `POST https://apitoken.fun/v1/chat/completions` (`/v1/messages`、`:generateContent`、`/v1/images/generations` も) |
| 🔒 あなたのデータ | 接触するのは `apitoken.fun` とあなたの受信箱バックエンドのみ、キーはあなたのマシンに留まる |

## 🐞 問題報告

Genvís AI が登録関門 (`/api/status` の下に公開されている)、メールホワイトリスト、コードの形式、またはリレーホストを変更した場合、ツールはそのステップで停止し、その旨を伝えます — 拒否本文はそのまま報告されます。コマンドと正確な出力を添えて **[issue を開いてください](../../issues)**。

## 📄 ライセンス

MIT © 2026 — [LICENSE](LICENSE) を参照。

<div align="center">

**[MIT](LICENSE)** © 2026 apitoken-bulk-apikey contributors

</div>