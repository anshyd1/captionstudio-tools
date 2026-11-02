# 📅 CaptionStudio.in — November & December 2026 Self-Operating SEO Masterplan
**Last Updated:** 02 November 2026 (IST) by **Agent Atlas (`atlas-20261102-s6p9`)**  
**Live Control Centre:** `https://captionstudio.in/ai-control` | **Pinterest Push Studio:** `https://captionstudio.in/ai-control/pinterest`  
**1-Command Health & Grow/Down Check:** `python3 scripts/seo_agent_check.py`

---

## 🤖 AGLE AGENT KE LIYE DIRECT STARTUP INSTRUCTIONS (Owner Ke Bina Bataye Kya Karna Hai)

Jab bhi koi naya Agent is repo ya workspace ko khole, **bina owner se basic sawaal puche** sabse pehle ye 4 steps follow kare:
1. **Run 1-Command Audit:** Terminal mein `python3 scripts/seo_agent_check.py` chalao. Ye script khud `ai-control/snapshot.json`, `ai-control/page-history.json`, `ai-control/state.json`, aur (agar Google service-account key uplabdh ho toh) **live GSC + GA4 API** check karke bata degi:
   - Kaunsa page **▲ GROW** hua aur kaunsa **▼ DOWN** gaya,
   - Kisi HTML/JS/Sitemap/Pinterest guardrail mein koi error toh nahi aaya,
   - Aaj ki IST date ke hisaab se **kaunsa Check ya Build task due hai**.
2. **Read `ai-control/AGENT_GUIDE.txt`:** Apna distinct English Agent Name + ID chuno (jaise `Agent Nova`, `Agent Orion`) aur kaam khatam hone par `ai-control/state.json` (`session_log` + `impact_reviews`), `snapshot.json`, aur `page-history.json` zaroor update karo taaki `/ai-control/worklog`, `/ai-control/impact`, aur `/ai-control/pages` par Owner ko seedha result dikhe.
3. **Strict Site-Safety Rules (Kabhi Mat Todna!):**
   - **NO Aggressive Popups / Auto-Redirects:** `@skill2incomehub` (*"Hum earn krwate hai"*) ke Telegram cards hamesha **soft, user-initiated** rahenge, **`<h1>` + `<p class="hero-intro">` ke NEECHE** rahenge, aur unpar **`data-nosnippet`** laga rahega (taaki Google SERP snippet mein promo text na aaye aur site kabhi top-heavy penalty se na gire!).
   - **NO Thin / JS-Hidden Articles:** Har naya blog guide **3,500+ crawlable static HTML words** ka hoga (captions/bios `<script>` array mein chhupa kar khali `<ol>` mat chhodna!), **minimum 4 soft premium White, Red & Gold/Yellow custom images** (`.webp` + `.jpg`, `1200×675`) hongi, 6 JSON-LD schemas, 5-column Mega Footer, aur Pinterest `data-pin-*` + `p:domain_verify` tags honge.
   - **4-Device Playwright Check Mandatory:** Push se pehle `1440px`, `768px`, `390px`, aur `360px` par `H1 == 1`, `Overflow == false`, `BrokenImg == 0`, aur `JSErr == 0` verify karna zaroori hai.

---

## 📊 BASELINE SNAPSHOT (02 Nov 2026 — Isse Agle Checks Compare Honge)

- **GA4 (28d: `05 Oct – 01 Nov 2026`):** `5,377` Views (`#1` `/blog/best-instagram-bio-copy-paste-2026` = `3,248` views; `/blog/viral-captions-for-reels-2026` = `393` views; `/` = `372` views; `/tools/bio-generator` = `296`; `/tools/caption-generator` = `263`; `/blog/best-capcut-alternatives-india-2026` = `127` [**+38% GROW** vs Oct 13!]).
- **GSC Web Search (28d: `04 Oct – 31 Oct 2026`):** `684` Clicks, `5,502` Impressions (`/` Homepage grew **95 -> 227 clicks [+139% GROW!]**; `/blog/viral-captions-for-reels-2026` = `452` clicks, `3,506` impr, Pos `4.6`).
- **GSC Image Search Baseline:** Sirf `9` impressions (215 images ab `sitemap-images.xml` + Pinterest Rich Pins mein live hain — target `200–500+` impressions in 28d).
- **5 Rescued Top-3 Zero-Click Pages Baseline (Fixed on 02 Nov):**
  1. `/blog/group-photo-captions-instagram-2026` — `388` impr, Pos `2.4`, `0` clicks -> *Fixed snippet order + `data-nosnippet` + JS copy bug + Girls/Cousins fast-copy box*
  2. `/blog/mirror-selfie-captions-for-instagram-2026` — `142` impr, Pos `2.4`, `0` clicks -> *Fixed snippet + 1-Word Girls/Boys fast-copy box*
  3. `/blog/funny-captions-for-instagram-hindi-2026` — `115` impr, Pos `3.0`, `0` clicks -> *Fixed snippet + Short Hindi 1-liners box*
  4. `/blog/college-life-captions-instagram-2026` — `78` impr, Pos `1.2`, `0` clicks -> *Fixed snippet + JS copy bug + Campus/Farewell box*
  5. `/blog/photo-dump-captions-instagram-2026` — `49` impr, Pos `1.3`, `0` clicks -> *Fixed snippet + JS copy bug + Camera Roll Lately box*

---

## 🗓️ DATE-BY-DATE EXECUTION CALENDAR (Kab Kya Karna Hai: 02 Nov -> 15 Dec 2026)

| Date Window | Status | Task ID & Exact Work | Kaise Verify Karna Hai (KPI / Proof) |
|---|---|---|---|
| **02 Nov 2026** | ✅ **DONE** | **Full Site SEO Audit + 74-File Refresh + JS/H1/SSR Repair + Traffic Bridges + Pinterest Push Studio (`/ai-control/pinterest`) + 42nd Blog (`/blog/2026-recap-new-year-2027-captions-instagram`) + Control Centre Live Data Sync** | Commits `bf14029`, `8efc5d9` + follow-up live; `40/40` Playwright PASS; 5 Sitemaps (`204`), Indexing API (`200`), IndexNow (`200`). |
| **03 Nov – 08 Nov** *(Owner / Daily 2-Min)* | 📌 **ACTIVE** | **Pinterest Direct Push Routine:** Open `https://captionstudio.in/ai-control/pinterest` aur roz **5–8 pins** (*2026 Recap, Wedding, Girls Bio, Ram/Mahakal Bio, AI Prompts, Group Photo*) apne Pinterest boards par push karo. | Pinterest outbound clicks GA4 `sessionSourceMedium` (`pinterest / referral`) mein aane lagenge. |
| **09 Nov 2026** *(7-Day Check #1)* | ⏳ **NEXT CHECK** | **7-Day Post-Refresh Audit (`nov09-zero-click-ctr-check` & `nov09-girls-bio-and-6-pillars-indexing`):**<br>1. `python3 scripts/seo_agent_check.py` run karo.<br>2. Check karo ki 5 Rescued Top-3 pages par CTR `0%` se uthkar clicks aane shuru hue ya nahi.<br>3. Check karo `instagram-bio-for-girls-2026` (SSR `3,250w`) aur `2026-recap-new-year-2027-captions-instagram` par GA4 bridge clicks + GSC impressions aaye ya nahi. | `state.json` `impact_reviews` mein 7d observation likho. Agar koi نیا pillar unindexed ho toh Indexing API se push karo. |
| **10 Nov – 14 Nov** *(Build #1)* | ⏳ **READY** | **Publish Winter & Mountain Travel Pillar (`nov10-build-winter-mountain-captions`):**<br>Target URL: `/blog/winter-mountain-trip-captions-instagram-2026`<br>Keywords: *winter captions for instagram, manali trip captions, mountain & foggy chai captions, winter photo dump*.<br>Specs: `3,500+` static words, 4 soft White/Red/Gold images, interactive Trip Vibe Picker, Pinterest `data-pin-*`, link from `photo-dump`, `group-photo`, `2026-recap`, `viral-captions`. | Update `data/blog.json`, `blog/index.html` SSR, `sitemap-blogs.xml`, `sitemap-images.xml`, `llms.txt`, `/ai-control/pinterest` + Playwright 4-device check. |
| **16 Nov – 20 Nov** *(Build #2 + 14d Check)* | ⏳ **READY** | **1. Mid-Month 14d Grow/Down Check (18 Nov):** Compare 14d GSC/GA4 vs prior 14d. Check `"instagram viral captions"` (Pos `6.1` -> target Top 3) aur `"short hindi captions"` (`hindi-captions-instagram` Pos `8.2` -> target Top 5).<br>**2. Publish Bio Silo Child Pillar (`nov16-build-attitude-bio-hinglish`):**<br>Target URL: `/blog/attitude-instagram-bio-hinglish-2026` (*Feeds directly off the 3,248-view #1 Bio Magnet!*). | Add new link into `#1 Bio Magnet` top switcher (`cs-bio-silo-bridge`) + `tools/bio-generator` vault links. |
| **22 Nov – 26 Nov** *(Build #3)* | ⏳ **READY** | **Publish Spiritual Bio Silo Pillar (`nov22-build-radhe-krishna-khatu-shyam-bio`):**<br>Target URL: `/blog/radhe-krishna-khatu-shyam-bio-instagram-2026`<br>Keywords: *radhe krishna bio for instagram, khatu shyam bio in hindi, vrindavan aesthetic bio*. | Cross-link with `jai-shree-ram-mahakal-radhe-krishna-bio-instagram-2026`, `mahadev-bio`, and `instagram-bio-for-girls-2026`. |
| **28 Nov – 05 Dec** *(Build #4 & #5)* | ⏳ **READY** | **Publish Creator Earning & AI Script Pillars (`nov28-build-theme-page-earning-and-chatgpt-reels`):**<br>1. `/blog/instagram-theme-page-earning-guide-india-2026` *(Faceless Reels Monetization in ₹)*<br>2. `/blog/chatgpt-prompts-for-instagram-reels-scripts-2026` *(Copy-Paste Hinglish Hook & Script Prompts)* | Feeds high-RPM AdSense + natural student signups to `@skill2incomehub` without popups. |
| **02 Dec – 15 Dec** *(28d Review + Peak Surge)* | ⏳ **SCHEDULED** | **1. Full 28-Day Impact Review (`dec02-monthly-28d-impact-review`):** Pull complete 28d GA4 + GSC, append **Sample #3** to `ai-control/page-history.json`, update `snapshot.json` & `impact_reviews` (`confirmed_benefit` / `pending` / `repair`).<br>**2. Push `2026-recap-new-year-2027-captions-instagram` to #1 Homepage Hero Slot on Dec 10** ahead of India's Dec 20–Jan 2 Year-End Reel wave! | Full 28-day non-branded GSC click growth + GSC Image Search growth + GA4 multi-page traffic spread verified. |
