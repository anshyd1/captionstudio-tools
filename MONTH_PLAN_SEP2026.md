# 📅 CaptionStudio — September 2026 Full Month Task Plan
### 10K/day Recovery — Day 1 (06 Sep) se Day 30 (05 Oct) tak

**Current:** 91 clicks/day (2,559/28d) | **Target Day 30:** 250/day | **10K:** 06 Aug 2027
**Blockers fixed today:** Sitemap lastmod de-bulked (34× same → 20 unique dates)

---

## ✅ AAJ KA KAAM — Day 1 (06 Sep 2026, Saturday) — COMMIT TAIYAR ✅

| # | Task | Time | Status |
|---|------|------|--------|
| 1 | **Sitemap lastmod fix** — `fix_lastmod.py --apply` → 34 blogs ke dates diverse (Apr–Jul 19 + Sep 15). `git commit 0346721` taiyar | 30 min | **DONE — commit local ready** |
| 2 | GSC me sitemap re-submit — Search Console → Sitemaps → Remove `sitemap.xml` → Add again `https://captionstudio.in/sitemap.xml` | 5 min | **Tum kar do (Owner ho)** |
| 3 | Vercel deploy verify — `git push` ke baad Vercel 2 min me deploy, `curl -I sitemap-blogs.xml` me last-modified = today | 2 min | After push |
| 4 | Indexing API — aaj sirf 5 URLs push (jo 01 Sep ko update hue): `viral-captions`, `group-photo`, `wedding`, `birthday`, `college-life` | 10 min | Evening |

**Commit details (push-ready):**
```
Commit: 0346721e6b884ff857287af6131990a91edc7207
Message: Fix: restore diverse lastmod dates (de-bulk 34× 2026-08-31) — Day 1 surgery
Files: sitemap-blogs.xml (68 lines), sitemap-main.xml, sitemap-tools.xml, fix_lastmod.py (new)
Branch: main
GitHub API: https://api.github.com/repos/anshyd1/captionstudio-tools/commits/0346721
Diff: git show 0346721
```

**Push kaise kare (2 options):**

**Option A — Mujhe push karne do (fast):**
Tum GitHub PAT (Personal Access Token) do with `repo` scope, mai yahi se push kar dunga:
```bash
# Tum token bhejo, mai chala dunga:
git push https://<TOKEN>@github.com/anshyd1/captionstudio-tools.git main
```

**Option B — Tum khud push karo (secure):**
1. Is workspace se patch download karo: `0346721.patch` (niche diya)
2. Apne laptop pe:
```bash
git clone https://github.com/anshyd1/captionstudio-tools.git
cd captionstudio-tools
# patch copy karo
git apply 0346721.patch
git add -A
git commit -m "Fix: restore diverse lastmod dates — Day 1 surgery"
git push origin main
```
3. Vercel auto-deploy 2 min me live.

---

## 🔜 KAL KA KAAM — Day 2 (07 Sep 2026, Sunday)

| # | Task | Time | Owner |
|---|------|------|-------|
| 1 | **vercel.json cleanup** — 246 → 90 redirects. Script `cleanup_vercel.py` chala ke 2-hop chains (`brazil-vs-japan → brazil → viral`) ko 1-hop karo, 13 off-niche (AI guides, email) ko 410 do. | 40 min | Mai bana dunga, tum push |
| 2 | Test redirects live — `curl -I /blog/brazil-vs-japan...` should be 410 not 308 (5 URLs test) | 10 min | Tum + Mai |
| 3 | GSC → Pages → `Discovered - currently not indexed` count note karo (baseline for Day 14) | 5 min | Tum |
| 4 | 1 thin page pe Creator Note add — `aesthetic-instagram-captions-2026` pe 120-word Ansh ki story (Hinglish) | 30 min | Tum likho, mai HTML me daal dunga |

**Output Day 2:** Crawl budget 2×, GSC me `Page with redirect` errors 50% kam hone lage

---

## 🔜 PARSO KA KAAM — Day 3 (08 Sep 2026, Monday)

| # | Task | Time |
|---|------|------|
| 1 | **Thin page #2** — `attitude-captions-2026` pe 120-word Creator Note + 3 FAQs rewrite (AI nahi, tumhari tone) | 30 min |
| 2 | **Internal link cluster** — `viral-captions` page se `aesthetic`, `attitude`, `love-viral` ko link do (3 links add) | 15 min |
| 3 | **Indexing API (5 URLs)** — jo 2 din me update kiye: `aesthetic`, `attitude`, `vercel.json` nahi (sirf content wale) | 10 min |
| 4 | GA4 check — `caption_copy` event 45% → 48% hua kya? (GA4 realtime) | 5 min |

**Output Day 3:** 2 pages ka dwell time badhega, long-tail impressions +10%

---

## 📆 PURE SEPTEMBER KA CALENDAR (Day 1–30)

| Week | Dates | Focus | Daily Task (30 min) | Weekly Output |
|------|-------|-------|---------------------|---------------|
| **W1** | 06–12 Sep | **Surgery** | Roz 1 thin page pe Creator Note (120 words) + 1 internal link | 6 pages fixed, sitemap 20 unique dates, GSC 0→10 indexed |
| **W2** | 13–19 Sep | **Unlock** | Har 2 din me 1 naya evergreen page (GSC query pos 8–15 se topic). Title 49-58 chars. | 3 new pages, 250/day avg (Day 19) |
| **W3** | 20–26 Sep | **CTR Fix** | 15 long titles trim + Pinterest pin (1 vertical/day) + 1 Quora answer | CTR 21%→24%, 5 pages 0→30 clicks |
| **W4** | 27 Sep–03 Oct | **Scale** | Hafte me 3 pages, image alt fix (6→3 images/page), 1 guest post | 40 pages indexed, 250/day stable → 300/day |
| **W4+** | 04–05 Oct | **Review** | GSC export → kaunse 10 pages abhi bhi `Discovered` me hai? Unhe priority next month | Day 30 report: 250/day ✅ |

### Day-wise checklist (06 Sep – 05 Oct)

| Date | Day | Task (copy-paste karo) |
|------|-----|------------------------|
| **06 Sep** | Sat | **Day 1: sitemap fix commit push + GSC re-submit + 5 URLs Indexing API** |
| 07 Sep | Sun | Day 2: vercel 246→90 + 1 Creator Note (aesthetic) |
| 08 Sep | Mon | Day 3: Creator Note (attitude) + 3 internal links |
| 09 Sep | Tue | Creator Note (love-viral) + GSC Pages note |
| 10 Sep | Wed | Creator Note (short) + 1 new page outline (GSC query: “instagram viral captions for reels hinglish”) |
| 11 Sep | Thu | Creator Note (best-captions-boys) + Quora answer #1 |
| 12 Sep | Fri | Review W1: GSC indexed count kitna badha? (target 10) |
| 13 Sep | Sat | **New Page #1:** `instagram-viral-captions-hinglish-2026` (pos 8→2 target) |
| 14 Sep | Sun | Creator Note (hindi-captions) + Pinterest pin batch |
| 15 Sep | Mon | **New Page #2:** `best-instagram-bio-boy-attitude-2026` |
| 16 Sep | Tue | Creator Note (gym-workout) + internal cluster |
| 17 Sep | Wed | **New Page #3:** `photo-dump-captions-2026` refresh + title trim |
| 18 Sep | Thu | CTR fix: 5 titles trim (42→58 chars) |
| 19 Sep | Fri | GSC Day 14 check: impressions 12k→18k? |
| 20 Sep | Sat | **Review W2:** 3 new pages indexed? (target) |
| 21 Sep | Sun | Pinterest 5 pins schedule + Telegram post |
| 22 Sep | Mon | **New Page #4:** `monsoon-captions-2026` seasonal refresh |
| 23 Sep | Tue | Creator Note (real-estate) + GA4 copy event check |
| 24 Sep | Wed | **New Page #5:** `college-life-2026` E-E-A-T add |
| 25 Sep | Thu | Image alt fix: 10 pages (6→3 images) |
| 26 Sep | Fri | Quora #2 + Reddit post |
| 27 Sep | Sat | **New Page #6:** `social-media-content-strategy-2026` hub |
| 28 Sep | Sun | Internal links: hub → 6 pages |
| 29 Sep | Mon | **New Page #7:** `ugc-creator-guide-2026` |
| 30 Sep | Tue | W4 review: 40 indexed? |
| 01 Oct | Wed | **New Page #8:** `best-capcut-alternatives-2026` update |
| 02 Oct | Thu | Pinterest + GA4 60% copy rate check |
| 03 Oct | Fri | Guest post outreach (Gorakhpur creator) |
| 04 Oct | Sat | GSC export + Day 30 report draft |
| 05 Oct | Sun | **Day 30 Milestone: 250/day avg?** If yes, celebrate + plan Oct (1K path). If 200, add 2 more pages. |

---

## 📊 GITHUB API LINKS (tumhare kaam ke)

- Repo: https://github.com/anshyd1/captionstudio-tools
- Commits API: https://api.github.com/repos/anshyd1/captionstudio-tools/commits
- Latest commit API: https://api.github.com/repos/anshyd1/captionstudio-tools/commits/main
- Aaj ka commit (local, push ke baad live hoga): `0346721e6b884ff857287af6131990a91edc7207`
- Vercel deploy hook: Push to `main` → auto-deploy 2 min (Vercel dashboard)
- GSC: https://search.google.com/search-console → Property: `sc-domain:captionstudio.in` → Sitemaps

**Push ke baad verify:**
```bash
curl -s https://captionstudio.in/sitemap-blogs.xml | grep lastmod | sort | uniq -c
# should be 20 unique, not 1

curl -s -I https://captionstudio.in/sitemap-blogs.xml | grep last-modified
# should be today

# GSC API check (same key):
python3 fix_lastmod.py --verify
```

---

## 🚀 Next Step: Aaj ka push

Tum bolo:
1. **“PAT bhejo”** — mai yahi se `git push` kar dunga (fastest, 1 min)
2. **“Patch download kara do”** — mai `0346721.patch` download link dunga, tum khud push kar doge

Dono me Vercel 2 min me live.

*Plan by live GSC + Git + Live site cross-verification • 06 Sep 2026*
