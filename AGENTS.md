# 🤖 AGENTS.md — CaptionStudio.in Autonomous SEO & Engineering Handoff

Welcome, Agent! You do **not** need the owner to re-explain the site history, SEO strategy, or pending tasks. Everything is self-documented and machine-verifiable inside this repository.

## ⚡ Step 1: Run This Single Command First (Before Anything Else!)
```bash
python3 scripts/seo_agent_check.py
```
This script automatically:
1. Reads `ai-control/state.json`, `ai-control/snapshot.json`, and `ai-control/page-history.json` (plus live GSC/GA4 APIs if service account JSON keys exist in `/home/user/uploads/` or `$GOOGLE_APPLICATION_CREDENTIALS`).
2. Shows which pages **grew (`▲ GROW`)** or **dropped (`▼ DOWN`)** across comparable 28-day / 7-day windows.
3. Audits all technical SEO invariants (`H1 == 1`, Pinterest `p:domain_verify`, `data-nosnippet` on promos, image `alt` tags, valid XML sitemaps).
4. Prints **today's due impact checks and next scheduled build/refresh task**.

## 📚 Step 2: Read These 3 Source-of-Truth Files
1. **`MONTH_PLAN_NOV_DEC_2026.md`** — Exact date-by-date calendar (`02 Nov -> 15 Dec 2026`), baseline metrics, completed vs pending tasks, and KPI checks.
2. **`ai-control/AGENT_GUIDE.txt`** — Operating contract, agent naming/session logging rules, and how `/ai-control` (`snapshot.json`, `state.json`, `page-history.json`) works.
3. **`PINTEREST-DIRECT-PUSH-PACK.md`** & **`ai-control/pinterest.html`** — Complete Pinterest Rich Pin & 1-Click Direct Push Studio catalog (`p:domain_verify = 5a8c4edbc759e99bcece5dbc826f21cb`).

## 🛡️ Non-Negotiable Owner & SEO Guardrails (Never Violate!)
- **Telegram CTA (`https://t.me/skill2incomehub`, *"Hum earn krwate hai"*):** Keep it **soft, editorial, and user-initiated**. **NEVER** add forced redirects, countdown timers, or aggressive interstitial popups. Always place promo cards **below** `<h1>` + `<p class="hero-intro">` and keep `data-nosnippet` on every promo/nav strip so Google SERP snippets stay 100% clean.
- **Google AdSense (`ca-pub-5440521844299570`):** Preserve AdSense & consent scripts cleanly. Keep admin/utility pages (`ai-control*`, `ad-studio`, `diwaok`, `creator-pack`) marked `<meta name="robots" content="noindex, nofollow">`.
- **Content & Visual Quality Standard:** Never publish short ~1,500-word thin listicles or hide caption/bio lists inside JS-only arrays. Every new guide must have **3,500+ crawlable static HTML words**, **4+ custom soft White/Red/Gold images** (`1200×675` `.webp` + `.jpg`, rich `alt` + `data-pin-*`), 1-click Copy buttons, JSON-LD schemas, and the full 5-column Mega Footer.
- **Multi-Device Playwright Audit Before Push:** Verify across `1440px`, `768px`, `390px`, and `360px` (`H1 == 1`, `Overflow == false`, `BrokenImg == 0`, `JSErr == 0`), and log your work honestly in `ai-control/state.json` (`session_log` + `impact_reviews`).
