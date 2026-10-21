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

**Genvís AI hesaplarını otomatik oluşturulan API anahtarlarıyla toplu oluşturun — OpenAI uyumlu çıkarım + 9Router bağlayıcısı.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-34%20served-412991?style=for-the-badge)](https://apitoken.fun/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Hızlı başlangıç](#-quick-start) · [🎁 Ücretsiz katman](#-free-tier--how-much-you-get) · [🤖 Modeller](#-models--all-34-of-them) · [🧪 API'yi kullanın](#-how-to-use-the-api) · [✅ Doğrulandı](#-verified-working--every-key-is-tested) · [🧭 Nasıl çalışır](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Seçenekler](#️-cli-options) · [🛰️ Proxy'ler](#️-behind-a-proxy) · [🐞 Sorunlar](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Bu neden var

Genvís AI (`apitoken.fun`), her yeni hesaba **1.000.000 kota birimi — `quota_per_unit: 500000` ile 2$ —** ödeyen bir New API çatalıdır; **captcha yok** (`turnstile_check:false`, kayıt sayfasında Turnstile betiği yok) ve **ilgilenmeniz gereken bir günlük giriş ritüeli yok**. Kayıt, bir e-posta adresi ve 6 karakterlik hex koddan oluşur ve kredi gerçektir: canlı panelde ölçüldüğünde, `GET /api/user/self` kayıttan hemen sonra `quota: 1000000, used_quota: 0` ve bir `deepseek-v4-flash` çağrısından sonra `quota: 999996, used_quota: 4, request_count: 1` yanıtını verdi — her chat-200 sayıyı değiştirir. Hattın kendi çalışması **14 hesap → 14 anahtar** üretti, hepsi yalnızca canlı bir chat 200'den sonra tutuldu (10'u bir WARP çıkışında toplu koşum üzerinden, 4'ü bu CLI'nin kendi `--count` yolu üzerinden) ve gönderilen CLI bunları `--verify-only` ile her an yeniden test eder (2026-10-21'de **14/14 canlı**). Tek gerçek kapı posta kutusudur: panel bir **e-posta alan adı beyaz listesi** uygular (gmail kabul edilir; mailtrap.io ve vomoto.com sunucu tarafında reddedilir) ve kabul ettiği gmail kutuları, başkalarının postalarını da taşıyan **geri dönüştürülmüş paylaşımlı bir gelen kutusundan** gelir — bu yüzden araç kodunu yalnızca gönderim öncesi anlık görüntüden daha yeni olan *ve* bu paneli adlandıran bir postadan alır (`mail.genvis.xyz` (gönderen), konu `Genvís AI邮箱验证邮件`). Laboratuvarda bir kez kaydedilen yabancı bir kod `Verification code is incorrect or has expired` yanıtını verdi; bu tuzak burada kapatılmıştır.

## 🎁 Ücretsiz katman — ne kadar alırsınız

| Ne | Değer |
| --- | --- |
| Kayıt kredisi | **1.000.000 birim = 2$** (`quota_for_new_user: 1000000`, `quota_per_unit: 500000`) |
| Harcama kanıtı | 1 sohbetten sonra: `quota 1000000 → 999996, used_quota 4, request_count 1`; 2 sohbetten sonra: `999992 / 8 / 2` |
| Captcha | **yok** — `turnstile_check:false`, kayıt sayfası hiçbir Turnstile betiği sunmaz |
| E-posta kapısı | **6 hex karakter**, 10 dakikalık pencere, alan adı beyaz listesi: **gmail kabul edilir**, `mailtrap.io` / `vomoto.com` reddedilir |
| Diğer kapılar | telefon yok, OAuth yok (GitHub/Google/WeChat/LinuxDo/OIDC hepsi `false`), davet kodu yok, günlük giriş yok |
| Katalog | canlı bir anahtarla `/v1/models` üzerinde **34 model kimliği** |
| Ölçeklenen birim | **bir hesap = bir anahtar** |

> 💡 Ücretsiz katman Genvís AI tarafından belirlenir ve değişebilir. Canlı sayıları [apitoken.fun](https://apitoken.fun) adresinden kontrol edin — ve kararı aracın kendi kapısına bırakın:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modeller — 34'ünün tamamı

Canlı bir anahtarla `GET /v1/models` **34 model kimliği** listeler. Doğrulanmış anahtar satırı `deepseek-v4-flash`'tır — fiyatlandırma tablosundaki en ucuz giriş ve hattın 14 anahtarının tamamının `200` yanıtı verdiği model (`content:"ok"`).

| Model Kimliği | Doğrulandı |
| --- | --- |
| `deepseek-v4-flash` | üretim anında **14 anahtarın 14'ü chat-200** ve `--verify-only` üzerinden tekrar |
| `gemini-3.8-flash` · `gpt-5.6-luna` · `deepseek-v4-pro` · `glm-5.3` · `kimi-k3` · `grok-4.6` · `gpt-6-astra` · `nano-banana*` | aynı anahtarlarla `/v1/models` tarafından listelenir |

Panelin kendi tablosundaki fiyatlandırma oranları (1× = varsayılan grup): `gemini-3.8-flash 0.045×`, `gpt-5.6-luna 0.1×`, `gemini-3.7-flash 0.45×`, `deepseek-v4-pro 0.66×`, `gpt-5.6-sol 2×`, `claude-opus-4-8 / claude-sonnet-5 / sora-2 37.5×` — yani 2$'lık bir hesap yaklaşık 44 deepseek-v4-flash ağırlıklı sohbet veya bir avuç öncü çağrı satın alır.

```bash
curl https://apitoken.fun/v1/chat/completions \
  -H "Authorization: Bearer MpqWYXkvfV…" -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4-flash","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 API nasıl kullanılır

Temel URL **`https://apitoken.fun/v1`** — OpenAI uyumlu. Panel ayrıca `/v1/messages` (Anthropic biçimi), `/v1beta/models/{model}:generateContent` (Gemini biçimi) ve `/v1/images/generations` yanıtlar.

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

## 🛠 Hızlı başlangıç

```bash
cd apitoken-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/launcher.js                     # interactive: mint / verify / screen / settings
# or: node src/cli.js --count 10 --pool proxies.txt
```

Bir anahtar `keys.txt` dosyasına **yalnızca** `/v1/chat/completions` gerçek içerikle 200 yanıtı verdikten sonra yazılır; `accounts.jsonl` kullanıcı adı / e-posta / quotaStart → quotaAfter / used bilgilerini tutar. Posta kutusu penceresi varsayılan olarak 300 s'dir çünkü bu panelin kod postası yavaştır — hattın son beş hesabında gönderimden sonra **157–176 s** ölçüldü.

### 🖱️ Başlatıcı

Başlatıcı proxy listesini (isteğe bağlı — olmadan CLI doğrudan çalışır) ve sayıyı sorar, bunları hatırlar ve CLI'yi çalıştırır — üret, doğrula, çıkışları tara, ayarlar, yardım, 9Router'a Bağlan.

## ✅ Çalıştığı doğrulandı — her anahtar test edilir

| Kontrol | Sonuç |
| --- | --- |
| `GET /api/status` | **200** — `system_name:"Genvís AI"`, `register_enabled:true`, `email_verification:true`, `turnstile_check:false`, `checkin_enabled:false`, `quota_for_new_user:1000000`, `quota_per_unit:500000` |
| `GET /api/verification?email=…` | **200** `{"message":"","success":true}` (POST `/api/verification` ve `/api/user/register/verify` bu çatalda `404 Invalid URL` yanıtlar) |
| `POST /api/user/register` | **200** `{"success":true}` — 14/14 hesap |
| `POST /api/user/login` | **200** + `access_token` JWT; `/api/user/self` bu Bearer token'ı gerektirir (yalnızca çerezle yapılan çağrıya `401 AUTH_UNAUTHORIZED` yanıtı verilir) |
| `POST /api/token/` | **200** — 48 karakterlik anahtar bir kez döndürülür (`sk-` öneki yok), grup `default` |
| `POST /v1/chat/completions` (`deepseek-v4-flash`) | **14 anahtarın 14'ünde** `content:"ok"` ile **200**, hem üretim koşumundan hem de gönderilen CLI'nin `--verify-only` komutundan |
| Kapıdan sonra `GET /api/user/self` | `quota 1000000 → 999996`, `used_quota 0 → 4`, `request_count 0 → 1` — kredi gerçekten faturalandırılır |

## 🧭 Nasıl çalışır

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Genvís AI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://apitoken.fun/v1/chat/completions → real content = the key is live
```

| Adım | Çağrı | Notlar |
| --- | --- | --- |
| kapılar | `GET /api/status` | kayıt açık, e-posta doğrulama açık, captcha kapalı, 2$ kayıt kredisi |
| posta kutusu | Emailnator `POST /api/generate-email` | hesap başına bir taze `@gmail.com`, **noktasız** biçimde kaydedilir (panelin beyaz listesi gmail'i kabul eder; paylaşımlı kutu geri dönüştürülür, bu yüzden adresler zaten biliniyor olabilir) |
| temel | `POST /api/message-list` | kutuda zaten bulunan kimlikler — daha eski hiçbir şey asla kabul edilmez |
| kod gönder | `GET /api/verification?email=…` | 6 hex kod, 10 dakikalık pencere; kısıtlamada ~20 s geri çekilme |
| kod | `/api/message-list` → `/api/message/<id>` yokla | kodu yalnızca **marka eşleşmeli** bir posta (`Genvís AI` / `genvis.xyz`) sağlayabilir — kutu yabancı kodlarla doludur |
| kayıt | `POST /api/user/register` | `{username,password,email,verification_code}` |
| giriş | `POST /api/user/login` | oturum çerezi **ve** çatalın `Authorization: Bearer` olarak istediği `access_token` |
| anahtar | `POST /api/token/` | 48 karakterlik anahtar, grup `default` (yedek: devral), bir kez gösterilir |
| kanıt | `POST /v1/chat/completions` | 200 + içerik = tut; ardından bir `/api/user/self` daha çağrının yaktığı kotayı kaydeder |

## ⚙️ CLI seçenekleri

```bash
node src/cli.js --count 10            # mint 10 keys (one account each, chat gate per key)
node src/cli.js --model deepseek-v4-flash
node src/cli.js --mail-window 300     # seconds to wait for the code mail
node src/cli.js --verify-only         # re-check every key in keys.txt (--limit N to cap)
node src/cli.js --screen              # exit pool self-test
node src/cli.js --connect-9router     # register the provider + a key on a local 9Router
node src/cli.js --help
```

| Ortam | Varsayılan | Anlam |
| --- | --- | --- |
| `APITOKEN_PROXIES` | `proxies.txt` | çıkış havuzu, satır başına bir proxy — isteğe bağlı: havuz olmadan CLI doğrudan bağlanır |
| `APITOKEN_MODEL` | `deepseek-v4-flash` | canlı doğrulama için model |

## 🛰️ Proxy arkasında

**İsteğe bağlı — ölçekte önerilir (IP başına limitler, yasaklar).** Araç proxy olmadan da çalışır.

- **Havuzla:** `--pool <file>` geçin (veya `APITOKEN_PROXIES` ayarlayın) ve her istek o listeden bir çıkış üzerinden gider — ölü bir hat o denemeyi başarısız kılar ve CLI bir sonraki çıkışa geçer. Posta hattı (Emailnator) aynı çıkış üzerinden gider.
- **Havuz olmadan:** CLI `running WITHOUT a proxy (direct)` yazdırır ve doğrudan bağlanır. Kayıt, anahtar üretimi veya doğrulamayla ilgili hiçbir şey değişmez — yalnızca paketlerin nereden çıktığı değişir.
- Her iki moda karşı `--screen` çalıştırın: gerçek bir koşumdan önce sahip olduğunuz çıkışları (veya doğrudan rotayı) Genvís AI'ye karşı test eder.

## 📄 Dosyalar

| Yol | İçerik |
| --- | --- |
| `keys.txt` | satır başına bir canlı doğrulanmış anahtar (48 karakter) — git tarafından yok sayılır |
| `accounts.jsonl` | kullanıcı adı / e-posta / quotaStart → quotaAfter / usedStart → usedAfter / grup / çıkış |
| `proxies.txt` | çıkışlarınız — git tarafından yok sayılır |
| `out/` | koşum günlükleri — git tarafından yok sayılır |

## 🔌 9Router'a Bağlan

[9Router](https://9router.com) kendi kendine barındırılan, OpenAI uyumlu bir yönlendiricidir:

```bash
node src/cli.js --connect-9router --9router-base http://localhost:20128 --9router-password 123456 --api-key MpqWYXkvfV…
```

Varsayılanlar: `--9router-prefix apitoken`, `--9router-name Genvís AI`, `--base-url https://apitoken.fun/v1`, `--model deepseek-v4-flash`. Modeller `apitoken/<model id>` olarak sunulur.

## 🔑 Bir anahtar size ne kazandırır

| | |
| --- | --- |
| 🏢 Sağlayıcı | **Genvís AI** — [apitoken.fun](https://apitoken.fun) |
| 🎁 Sağlayıcının verdikleri | kayıtta **2$ (1.000.000 birim)** — captcha yok, günlük giriş yok |
| 🔑 Bir anahtar size ne kazandırır | kendi hesabında bir 48 karakterlik anahtar, `deepseek-v4-flash` üzerinde sohbet doğrulamalı |
| 🌐 API biçimi | OpenAI uyumlu: `POST https://apitoken.fun/v1/chat/completions` (ayrıca `/v1/messages`, `:generateContent`, `/v1/images/generations`) |
| 🔒 Verileriniz | yalnızca `apitoken.fun` ve gelen kutusu arka ucunuzla iletişim kurulur; anahtarlar makinenizde kalır |

## 🐞 Sorunlar

Genvís AI kayıt kapılarını (bunlar `/api/status` altında yayımlanır), posta beyaz listesini, kod biçimini veya aktarma ana bilgisayarını değiştirirse, araç o adımda durur ve bunu bildirir — ret gövdesi kelimesi kelimesine raporlanır. Komut ve tam çıktıyla birlikte **[bir sorun açın](../../issues)**.

## 📄 Lisans

MIT © 2026 — bkz. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 apitoken-bulk-apikey katkıda bulunanlar

</div>