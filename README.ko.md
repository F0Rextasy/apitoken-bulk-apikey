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

**자동 생성된 API 키로 Genvís AI 계정을 대량 생성 — OpenAI 호환 추론 + 9Router 커넥터.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-34%20served-412991?style=for-the-badge)](https://apitoken.fun/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 빠른 시작](#-quick-start) · [🎁 무료 티어](#-free-tier--how-much-you-get) · [🤖 모델](#-models--all-34-of-them) · [🧪 API 사용하기](#-how-to-use-the-api) · [✅ 검증됨](#-verified-working--every-key-is-tested) · [🧭 작동 방식](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ 옵션](#️-cli-options) · [🛰️ 프록시](#️-behind-a-proxy) · [🐞 이슈](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ 이 도구가 존재하는 이유

Genvís AI(`apitoken.fun`)는 New API 포크로, **모든 신규 계정에 1,000,000 할당량 단위 — `quota_per_unit: 500000` 기준 $2 — 를 지급**하며, **캡차가 없고**(`turnstile_check:false`, 가입 페이지에 Turnstile 스크립트 없음) **챙겨야 할 출석 체크 의식도 없습니다**. 가입은 이메일 주소와 6자리 16진수 코드로 이루어지며, 크레딧은 실제입니다. 라이브 패널에서 측정한 결과, 가입 직후 `GET /api/user/self`는 `quota: 1000000, used_quota: 0`을 응답했고, `deepseek-v4-flash` 호출 한 번 후에는 `quota: 999996, used_quota: 4, request_count: 1`을 응답했습니다 — 모든 chat-200이 숫자를 움직입니다. 이 레인의 자체 실행에서 **각 계정이 자체 키를 발급받았고, 모두 라이브 chat 200 이후에만 보관되었습니다**(WARP 출구에서 벌크 하네스를 통해 10개, 이 CLI 자체의 `--count` 경로를 통해 4개). 그리고 배포된 CLI는 `--verify-only`로 언제든 이들을 재검증합니다(2026-10-21 기준 **검증된 작동**). 유일한 실제 관문은 메일함입니다. 패널은 **이메일 도메인 화이트리스트**를 적용하며(gmail 허용, mailtrap.io와 vomoto.com은 서버 측에서 거부됨), 허용되는 gmail 메일함은 다른 사람들의 메일도 함께 담긴 **재활용된 공유 받은편지함**에서 나옵니다 — 따라서 이 도구는 발송 전 스냅샷보다 최신이면서 *동시에* 이 패널을 명시하는 메일에서만 코드를 가져옵니다(`mail.genvis.xyz`(발신자), 제목 `Genvís AI邮箱验证邮件`). 실험실에서 한 번 등록된 외부 코드는 `Verification code is incorrect or has expired`를 응답했습니다. 그 함정은 여기서 차단됩니다.

## 🎁 무료 티어 — 얼마나 받을 수 있나

| 항목 | 값 |
| --- | --- |
| 가입 크레딧 | **1,000,000 단위 = $2** (`quota_for_new_user: 1000000`, `quota_per_unit: 500000`) |
| 사용 증명 | 채팅 1회 후: `quota 1000000 → 999996, used_quota 4, request_count 1`; 채팅 2회 후: `999992 / 8 / 2` |
| 캡차 | **없음** — `turnstile_check:false`, 가입 페이지에 Turnstile 스크립트 없음 |
| 이메일 관문 | **6자리 16진수**, 10분 유효, 도메인 화이트리스트: **gmail 허용**, `mailtrap.io` / `vomoto.com` 거부 |
| 기타 관문 | 전화번호 없음, OAuth 없음(GitHub/Google/WeChat/LinuxDo/OIDC 모두 `false`), 초대 코드 없음, 일일 출석 체크 없음 |
| 카탈로그 | 라이브 키로 `/v1/models`에 **34개 모델 id** |
| 확장되는 단위 | **계정 하나 = 키 하나** |

> 💡 무료 티어는 Genvís AI가 설정하며 변경될 수 있습니다. 라이브 수치는 [apitoken.fun](https://apitoken.fun)에서 확인하세요 — 그리고 도구 자체의 관문이 판단하게 하세요:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 모델 — 34개 전부

라이브 키로 `GET /v1/models`는 **34개 모델 id**를 나열합니다. 검증된 키 라인은 `deepseek-v4-flash`입니다 — 가격표에서 가장 저렴한 항목이며, 이 레인의 모든 키가 `200`을 응답한 모델입니다(`content:"ok"`).

| 모델 ID | 검증됨 |
| --- | --- |
| `deepseek-v4-flash` | **모든 키, 발급 시 chat-200**, 그리고 `--verify-only`를 통해서도 다시 |
| `gemini-3.8-flash` · `gpt-5.6-luna` · `deepseek-v4-pro` · `glm-5.3` · `kimi-k3` · `grok-4.6` · `gpt-6-astra` · `nano-banana*` | 동일한 키로 `/v1/models`에 나열됨 |

패널 자체 시트의 가격 비율(1× = 기본 그룹): `gemini-3.8-flash 0.045×`, `gpt-5.6-luna 0.1×`, `gemini-3.7-flash 0.45×`, `deepseek-v4-pro 0.66×`, `gpt-5.6-sol 2×`, `claude-opus-4-8 / claude-sonnet-5 / sora-2 37.5×` — 따라서 $2 계정으로 약 44회의 deepseek-v4-flash 중심 채팅 또는 소수의 프런티어 호출을 살 수 있습니다.

```bash
curl https://apitoken.fun/v1/chat/completions \
  -H "Authorization: Bearer MpqWYXkvfV…" -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4-flash","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 API 사용하기

Base URL **`https://apitoken.fun/v1`** — OpenAI 호환. 패널은 `/v1/messages`(Anthropic 형식), `/v1beta/models/{model}:generateContent`(Gemini 형식), `/v1/images/generations`도 응답합니다.

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

## 🛠 빠른 시작

```bash
cd apitoken-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/launcher.js                     # interactive: mint / verify / screen / settings
# or: node src/cli.js --count 10 --pool proxies.txt
```

키는 `/v1/chat/completions`가 실제 콘텐츠와 함께 200을 응답한 **후에만** `keys.txt`에 기록됩니다. `accounts.jsonl`은 username / e-mail / quotaStart → quotaAfter / used를 보관합니다. 메일함 대기 시간은 기본 300초인데, 이 패널의 코드 메일이 느리기 때문입니다 — 이 레인의 마지막 다섯 계정에서 발송 후 **157–176초**로 측정되었습니다.

### 🖱️ 런처

런처는 프록시 목록(선택 사항 — 없으면 CLI는 직접 실행)과 개수를 묻고, 이를 기억한 뒤 CLI를 실행합니다 — 발급, 검증, 출구 스크린, 설정, 도움말, 9Router 연결.

## ✅ 검증된 작동 — 모든 키가 테스트됨

| 확인 | 결과 |
| --- | --- |
| `GET /api/status` | **200** — `system_name:"Genvís AI"`, `register_enabled:true`, `email_verification:true`, `turnstile_check:false`, `checkin_enabled:false`, `quota_for_new_user:1000000`, `quota_per_unit:500000` |
| `GET /api/verification?email=…` | **200** `{"message":"","success":true}` (이 포크에서 POST `/api/verification`와 `/api/user/register/verify`는 `404 Invalid URL`을 응답) |
| `POST /api/user/register` | **200** `{"success":true}` — 14/14 계정 |
| `POST /api/user/login` | **200** + `access_token` JWT; `/api/user/self`는 해당 Bearer 토큰이 필요(쿠키만 사용한 호출은 `401 AUTH_UNAUTHORIZED` 응답) |
| `POST /api/token/` | **200** — 48자 키가 한 번 반환됨(`sk-` 접두사 없음), 그룹 `default` |
| `POST /v1/chat/completions` (`deepseek-v4-flash`) | 발급 하네스와 배포된 CLI의 `--verify-only` 양쪽 모두에서 모든 키에 `content:"ok"`와 함께 **200** |
| 관문 후 `GET /api/user/self` | `quota 1000000 → 999996`, `used_quota 0 → 4`, `request_count 0 → 1` — 크레딧이 실제로 청구됨 |

> **품질 관문.** 여기의 모든 키는 `keys.txt`에 기록되기 전에 라이브 `chat-200`을 통과했습니다
> (죽은 키는 절대 배포되지 않습니다). 라우터 조합도 모델 수준에서 같은 규칙을 따릅니다: 항목은
> **모델이 `chat-200`을 응답하고 도구를 호출할 수 있을 때만** 추가됩니다 — 도구 지원이 없는 모델,
> 죽은 키 또는 죽은 제공자는 추가되지 않고 제거됩니다. 검증 단계를 언제든 다시 실행하세요;
> 실패는 보고되며, 절대 숨겨지지 않습니다.

## 🧭 작동 방식

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Genvís AI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://apitoken.fun/v1/chat/completions → real content = the key is live
```

| 단계 | 호출 | 비고 |
| --- | --- | --- |
| 관문 | `GET /api/status` | 가입 켜짐, 이메일 인증 켜짐, 캡차 꺼짐, $2 가입 크레딧 |
| 메일함 | Emailnator `POST /api/generate-email` | 계정당 하나의 새 `@gmail.com`, **점 없는** 형식으로 등록됨(패널의 화이트리스트가 gmail을 허용; 공유 메일함은 재활용되므로 주소가 이미 알려져 있을 수 있음) |
| 기준선 | `POST /api/message-list` | 메일함에 이미 있는 id — 그보다 오래된 것은 절대 허용되지 않음 |
| 코드 발송 | `GET /api/verification?email=…` | 6자리 16진수 코드, 10분 유효; 스로틀링 시 약 20초 백오프 |
| 코드 | `/api/message-list` → `/api/message/<id>` 폴링 | **브랜드가 일치하는** 메일(`Genvís AI` / `genvis.xyz`)만 코드를 제공할 수 있음 — 메일함은 외부 코드로 가득 차 있음 |
| 가입 | `POST /api/user/register` | `{username,password,email,verification_code}` |
| 로그인 | `POST /api/user/login` | 세션 쿠키 **및** 포크가 `Authorization: Bearer`로 요구하는 `access_token` |
| 키 | `POST /api/token/` | 48자 키, 그룹 `default`(대체: 상속), 한 번만 공개 |
| 증명 | `POST /v1/chat/completions` | 200 + 콘텐츠 = 보관; 그런 다음 `/api/user/self` 한 번 더 호출하여 해당 호출이 소모한 할당량을 기록 |

## ⚙️ CLI 옵션

```bash
node src/cli.js --count 10            # mint 10 keys (one account each, chat gate per key)
node src/cli.js --model deepseek-v4-flash
node src/cli.js --mail-window 300     # seconds to wait for the code mail
node src/cli.js --verify-only         # re-check every key in keys.txt (--limit N to cap)
node src/cli.js --screen              # exit pool self-test
node src/cli.js --connect-9router     # register the provider + a key on a local 9Router
node src/cli.js --help
```

| 환경 변수 | 기본값 | 의미 |
| --- | --- | --- |
| `APITOKEN_PROXIES` | `proxies.txt` | 출구 풀, 프록시당 한 줄 — 선택 사항: 풀이 없으면 CLI는 직접 연결 |
| `APITOKEN_MODEL` | `deepseek-v4-flash` | 라이브 검증에 사용할 모델 |

## 🛰️ 프록시 뒤에서

**선택 사항 — 대규모에서는 권장(IP별 제한, 차단).** 이 도구는 프록시 없이도 작동합니다.

- **풀이 있을 때:** `--pool <file>`을 전달하거나(또는 `APITOKEN_PROXIES` 설정) 모든 요청이 해당 목록의 출구를 통해 나갑니다 — 죽은 회선은 해당 시도를 실패시키고 CLI는 다음 출구로 이동합니다. 메일 레일(Emailnator)도 같은 출구를 통과합니다.
- **풀이 없을 때:** CLI는 `running WITHOUT a proxy (direct)`를 출력하고 직접 연결합니다. 가입, 키 발급 또는 검증에 대해 달라지는 것은 없습니다 — 패킷이 나가는 위치만 다를 뿐입니다.
- 어느 모드에서든 `--screen`을 실행하세요: 실제 실행 전에 보유한 출구(또는 직접 경로)를 Genvís AI에 대해 테스트합니다.

## 📄 파일

| 경로 | 내용 |
| --- | --- |
| `keys.txt` | 라이브 검증된 키 한 줄에 하나(48자) — git 무시됨 |
| `accounts.jsonl` | username / e-mail / quotaStart → quotaAfter / usedStart → usedAfter / group / exit |
| `proxies.txt` | 사용자의 출구 — git 무시됨 |
| `out/` | 실행 로그 — git 무시됨 |

## 🔌 9Router에 연결

[9Router](https://9router.com)는 자체 호스팅, OpenAI 호환 라우터입니다:

```bash
node src/cli.js --connect-9router --9router-base http://localhost:20128 --9router-password 123456 --api-key MpqWYXkvfV…
```

기본값: `--9router-prefix apitoken`, `--9router-name Genvís AI`, `--base-url https://apitoken.fun/v1`, `--model deepseek-v4-flash`. 모델은 `apitoken/<model id>`로 제공됩니다.

## 🔌 OmniRoute에 연결

[OmniRoute](https://omniroute.online)는 자체 호스팅, OpenAI 호환 라우터입니다:

```bash
node src/cli.js --connect-omniroute --omniroute-base http://localhost:20128 --omniroute-password 123456 --api-key MpqWYXkvfV…
```

기본값: `--omniroute-prefix apitoken`, `--omniroute-name Genvís AI`, `--base-url https://apitoken.fun/v1`, `--model deepseek-v4-flash`. 모델은 `apitoken/<model id>`로 제공됩니다.

## 🔑 키 하나로 얻는 것

| | |
| --- | --- |
| 🏢 제공자 | **Genvís AI** — [apitoken.fun](https://apitoken.fun) |
| 🎁 제공자가 주는 것 | 가입 시 **$2(1,000,000 단위)** — 캡차 없음, 출석 체크 없음 |
| 🔑 키 하나로 얻는 것 | 자체 계정의 48자 키 하나, `deepseek-v4-flash`에서 채팅 검증됨 |
| 🌐 API 형식 | OpenAI 호환: `POST https://apitoken.fun/v1/chat/completions` (`/v1/messages`, `:generateContent`, `/v1/images/generations`도 지원) |
| 🔒 데이터 | `apitoken.fun`과 사용자의 받은편지함 백엔드만 접촉됨; 키는 사용자의 컴퓨터에 남음 |

## 🐞 이슈

Genvís AI가 가입 관문(`/api/status` 아래에 공개됨), 메일 화이트리스트, 코드 형식 또는 릴레이 호스트를 변경하면, 도구는 해당 단계에서 멈추고 그렇게 알립니다 — 거부 본문은 그대로 보고됩니다. 명령과 정확한 출력을 포함하여 **[이슈를 열어주세요](../../issues)**.

## 📄 라이선스

MIT © 2026 — [LICENSE](LICENSE) 참조.

<div align="center">

**[MIT](LICENSE)** © 2026 apitoken-bulk-apikey contributors

</div>