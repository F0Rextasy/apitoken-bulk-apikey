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

**Créez en masse des comptes Genvís AI avec des clés API générées automatiquement — inférence compatible OpenAI + connecteur 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-34%20served-412991?style=for-the-badge)](https://apitoken.fun/pricing)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Démarrage rapide](#-quick-start) · [🎁 Offre gratuite](#-free-tier--how-much-you-get) · [🤖 Modèles](#-models--all-34-of-them) · [🧪 Utiliser l'API](#-how-to-use-the-api) · [✅ Vérifié](#-verified-working--every-key-is-tested) · [🧭 Comment ça marche](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Options](#️-cli-options) · [🛰️ Proxys](#️-behind-a-proxy) · [🐞 Problèmes](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Pourquoi ce projet existe

Genvís AI (`apitoken.fun`) est un fork de New API qui offre **1 000 000 d'unités de quota — soit 2 $ à `quota_per_unit: 500000` — à chaque nouveau compte**, avec **aucun captcha** (`turnstile_check:false`, aucun script Turnstile sur la page d'inscription) et **aucun rituel de check-in à surveiller**. L'inscription se fait avec une adresse e-mail et un code hexadécimal de 6 caractères, et le crédit est bien réel : mesuré sur le panneau en direct, `GET /api/user/self` a répondu `quota: 1000000, used_quota: 0` juste après l'inscription et `quota: 999996, used_quota: 4, request_count: 1` après un appel à `deepseek-v4-flash` — chaque chat-200 fait bouger le chiffre. Le run de cette voie a généré **chaque compte a généré sa propre clé, toutes conservées uniquement après un chat 200 en direct** (10 via le harnais en masse sur une sortie WARP, 4 via le propre chemin `--count` de ce CLI), et le CLI livré les reteste à tout moment avec `--verify-only` (**vérifié fonctionnel** le 2026-10-21). La seule véritable barrière est la boîte mail : le panneau applique une **liste blanche de domaines e-mail** (gmail accepté ; mailtrap.io et vomoto.com refusés côté serveur), et les boîtes gmail qu'il accepte proviennent d'une **boîte partagée recyclée** qui contient aussi le courrier d'autres personnes — l'outil ne prend donc son code que dans un mail plus récent que l'instantané d'avant-envoi *et* qui nomme ce panneau (`mail.genvis.xyz` (expéditeur), objet `Genvís AI邮箱验证邮件`). Un code étranger enregistré une fois au labo a répondu `Verification code is incorrect or has expired` ; ce piège est fermé ici.

## 🎁 Offre gratuite — ce que vous obtenez

| Élément | Valeur |
| --- | --- |
| Crédit d'inscription | **1 000 000 d'unités = 2 $** (`quota_for_new_user: 1000000`, `quota_per_unit: 500000`) |
| Preuve de dépense | après 1 chat : `quota 1000000 → 999996, used_quota 4, request_count 1` ; après 2 chats : `999992 / 8 / 2` |
| Captcha | **aucun** — `turnstile_check:false`, la page d'inscription ne sert aucun script Turnstile |
| Barrière e-mail | **6 caractères hexadécimaux**, fenêtre de 10 minutes, liste blanche de domaines : **gmail accepté**, `mailtrap.io` / `vomoto.com` refusés |
| Autres barrières | pas de téléphone, pas d'OAuth (GitHub/Google/WeChat/LinuxDo/OIDC tous à `false`), pas de code d'invitation, pas de check-in quotidien |
| Catalogue | **34 identifiants de modèles** sur `/v1/models` avec une clé active |
| L'unité qui passe à l'échelle | **un compte = une clé** |

> 💡 L'offre gratuite est définie par Genvís AI et peut changer. Vérifiez les chiffres en direct sur [apitoken.fun](https://apitoken.fun) — et laissez la propre barrière de l'outil décider :

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modèles — les 34

`GET /v1/models` avec une clé active liste **34 identifiants de modèles**. La ligne de clé vérifiée est `deepseek-v4-flash` — l'entrée la moins chère de la grille tarifaire et le modèle avec lequel chacune des clés de cette voie a répondu `200` (`content:"ok"`).

| Identifiant du modèle | Vérifié |
| --- | --- |
| `deepseek-v4-flash` | **chaque clé, chat-200** à la génération, et de nouveau via `--verify-only` |
| `gemini-3.8-flash` · `gpt-5.6-luna` · `deepseek-v4-pro` · `glm-5.3` · `kimi-k3` · `grok-4.6` · `gpt-6-astra` · `nano-banana*` | listés par `/v1/models` sur les mêmes clés |

Ratios tarifaires sur la propre grille du panneau (1× = le groupe par défaut) : `gemini-3.8-flash 0.045×`, `gpt-5.6-luna 0.1×`, `gemini-3.7-flash 0.45×`, `deepseek-v4-pro 0.66×`, `gpt-5.6-sol 2×`, `claude-opus-4-8 / claude-sonnet-5 / sora-2 37.5×` — un compte à 2 $ achète donc environ 44 chats intensifs en deepseek-v4-flash ou une poignée d'appels aux modèles de pointe.

```bash
curl https://apitoken.fun/v1/chat/completions \
  -H "Authorization: Bearer MpqWYXkvfV…" -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4-flash","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

## 🧪 Comment utiliser l'API

URL de base **`https://apitoken.fun/v1`** — compatible OpenAI. Le panneau répond aussi à `/v1/messages` (format Anthropic), `/v1beta/models/{model}:generateContent` (format Gemini) et `/v1/images/generations`.

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

## 🛠 Démarrage rapide

```bash
cd apitoken-bulk-apikey
printf 'socks5://host:port\n' > proxies.txt   # optional — without it the tool runs direct
node src/launcher.js                     # interactive: mint / verify / screen / settings
# or: node src/cli.js --count 10 --pool proxies.txt
```

Une clé n'est écrite dans `keys.txt` **qu'après** que `/v1/chat/completions` a répondu 200 avec du contenu réel ; `accounts.jsonl` conserve username / e-mail / quotaStart → quotaAfter / used. La fenêtre de la boîte mail est par défaut de 300 s car le mail de code de ce panneau est lent — mesuré **157–176 s** après l'envoi sur les cinq derniers comptes de cette voie.

### 🖱️ Le lanceur

Le lanceur demande la liste de proxys (facultative — sans elle, le CLI se connecte directement) et le nombre, les mémorise, et exécute le CLI — mint, verify, screen exits, settings, help, Connect to 9Router.

## ✅ Vérifié fonctionnel — chaque clé est testée

| Vérification | Résultat |
| --- | --- |
| `GET /api/status` | **200** — `system_name:"Genvís AI"`, `register_enabled:true`, `email_verification:true`, `turnstile_check:false`, `checkin_enabled:false`, `quota_for_new_user:1000000`, `quota_per_unit:500000` |
| `GET /api/verification?email=…` | **200** `{"message":"","success":true}` (POST `/api/verification` et `/api/user/register/verify` répondent `404 Invalid URL` sur ce fork) |
| `POST /api/user/register` | **200** `{"success":true}` — 14/14 comptes |
| `POST /api/user/login` | **200** + JWT `access_token` ; `/api/user/self` exige ce jeton Bearer (un appel avec cookie seul reçoit `401 AUTH_UNAUTHORIZED`) |
| `POST /api/token/` | **200** — clé de 48 caractères renvoyée une seule fois (sans préfixe `sk-`), groupe `default` |
| `POST /v1/chat/completions` (`deepseek-v4-flash`) | **200** avec `content:"ok"` sur chaque clé, à la fois depuis le harnais de génération et depuis le `--verify-only` du CLI livré |
| `GET /api/user/self` après la barrière | `quota 1000000 → 999996`, `used_quota 0 → 4`, `request_count 0 → 1` — le crédit est réellement facturé |

> **Barrières de qualité.** Chaque clé ici a passé un `chat-200` en direct avant d'être écrite dans `keys.txt`
> (les clés mortes ne sont jamais livrées). Les combinaisons de routeur suivent la même règle au niveau du modèle : une entrée n'est
> ajoutée **que si le modèle répond `chat-200` et peut appeler des outils** — un modèle sans support des outils,
> une clé morte ou un fournisseur mort est écarté plutôt qu'ajouté. Relancez l'étape de vérification à tout moment ;
> les échecs sont signalés, jamais masqués.

## 🧭 Comment ça marche

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Genvís AI page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://apitoken.fun/v1/chat/completions → real content = the key is live
```

| Étape | Appel | Notes |
| --- | --- | --- |
| barrières | `GET /api/status` | inscription activée, vérification e-mail activée, captcha désactivé, crédit d'inscription de 2 $ |
| boîte mail | Emailnator `POST /api/generate-email` | une nouvelle adresse `@gmail.com` par compte, enregistrée sous la forme **sans point** (la liste blanche du panneau accepte gmail ; la boîte partagée est recyclée, les adresses peuvent donc déjà être connues) |
| référence | `POST /api/message-list` | identifiants déjà présents dans la boîte — rien de plus ancien n'est jamais accepté |
| envoi du code | `GET /api/verification?email=…` | code de 6 caractères hexadécimaux, fenêtre de 10 minutes ; ~20 s de back-off en cas de limitation |
| code | poll `/api/message-list` → `/api/message/<id>` | seul un mail **correspondant à la marque** (`Genvís AI` / `genvis.xyz`) peut fournir le code — la boîte est pleine de codes étrangers |
| inscription | `POST /api/user/register` | `{username,password,email,verification_code}` |
| connexion | `POST /api/user/login` | cookie de session **et** le `access_token` que le fork attend comme `Authorization: Bearer` |
| clé | `POST /api/token/` | clé de 48 caractères, groupe `default` (repli : inherit), révélée une seule fois |
| preuve | `POST /v1/chat/completions` | 200 + contenu = conserver ; puis un autre `/api/user/self` enregistre le quota brûlé par l'appel |

## ⚙️ Options du CLI

```bash
node src/cli.js --count 10            # mint 10 keys (one account each, chat gate per key)
node src/cli.js --model deepseek-v4-flash
node src/cli.js --mail-window 300     # seconds to wait for the code mail
node src/cli.js --verify-only         # re-check every key in keys.txt (--limit N to cap)
node src/cli.js --screen              # exit pool self-test
node src/cli.js --connect-9router     # register the provider + a key on a local 9Router
node src/cli.js --help
```

| Env | Défaut | Signification |
| --- | --- | --- |
| `APITOKEN_PROXIES` | `proxies.txt` | pool de sorties, une ligne par proxy — facultatif : sans pool, le CLI se connecte directement |
| `APITOKEN_MODEL` | `deepseek-v4-flash` | modèle pour la vérification en direct |

## 🛰️ Derrière un proxy

**Facultatif — recommandé à grande échelle (limites par IP, bannissements).** L'outil fonctionne aussi sans proxy.

- **Avec un pool :** passez `--pool <file>` (ou définissez `APITOKEN_PROXIES`) et chaque requête passe par une sortie de cette liste — une ligne morte fait échouer cette tentative et le CLI passe à la sortie suivante. Le rail mail (Emailnator) passe par la même sortie.
- **Sans pool :** le CLI affiche `running WITHOUT a proxy (direct)` et se connecte directement. Rien ne change pour l'inscription, la génération de clés ou la vérification — seul le point de départ des paquets change.
- Lancez `--screen` dans l'un ou l'autre mode : il teste les sorties dont vous disposez (ou la route directe) contre Genvís AI avant un vrai run.

## 📄 Fichiers

| Chemin | Contenu |
| --- | --- |
| `keys.txt` | une clé vérifiée en direct par ligne (48 caractères) — ignoré par git |
| `accounts.jsonl` | username / e-mail / quotaStart → quotaAfter / usedStart → usedAfter / group / exit |
| `proxies.txt` | vos sorties — ignoré par git |
| `out/` | journaux d'exécution — ignorés par git |

## 🔌 Connexion à 9Router

[9Router](https://9router.com) est un routeur auto-hébergé, compatible OpenAI :

```bash
node src/cli.js --connect-9router --9router-base http://localhost:20128 --9router-password 123456 --api-key MpqWYXkvfV…
```

Valeurs par défaut : `--9router-prefix apitoken`, `--9router-name Genvís AI`, `--base-url https://apitoken.fun/v1`, `--model deepseek-v4-flash`. Les modèles sont servis sous la forme `apitoken/<model id>`.

## 🔌 Connexion à OmniRoute

[OmniRoute](https://omniroute.online) est un routeur auto-hébergé, compatible OpenAI :

```bash
node src/cli.js --connect-omniroute --omniroute-base http://localhost:20128 --omniroute-password 123456 --api-key MpqWYXkvfV…
```

Valeurs par défaut : `--omniroute-prefix apitoken`, `--omniroute-name Genvís AI`, `--base-url https://apitoken.fun/v1`, `--model deepseek-v4-flash`. Les modèles sont servis sous la forme `apitoken/<model id>`.

## 🔑 Ce qu'une clé vous apporte

| | |
| --- | --- |
| 🏢 Fournisseur | **Genvís AI** — [apitoken.fun](https://apitoken.fun) |
| 🎁 Ce que le fournisseur offre | **2 $ (1 000 000 d'unités)** à l'inscription — sans captcha, sans check-in |
| 🔑 Ce qu'une clé vous apporte | une clé de 48 caractères sur son propre compte, vérifiée par chat sur `deepseek-v4-flash` |
| 🌐 Format de l'API | compatible OpenAI : `POST https://apitoken.fun/v1/chat/completions` (aussi `/v1/messages`, `:generateContent`, `/v1/images/generations`) |
| 🔒 Vos données | seuls `apitoken.fun` et votre backend de boîte mail sont contactés ; les clés restent sur votre machine |

## 🐞 Problèmes

Si Genvís AI modifie ses barrières d'inscription (elles sont publiées sous `/api/status`), sa liste blanche de mails, la forme du code ou l'hôte du relais, l'outil s'arrête à cette étape et le signale — le corps du refus est rapporté mot pour mot. **[Ouvrez un ticket](../../issues)** avec la commande et la sortie exacte.

## 📄 Licence

MIT © 2026 — voir [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 apitoken-bulk-apikey contributors

</div>