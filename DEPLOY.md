# CaptionStudio.in — Recovery Deploy Notes

**Date:** 31 Aug 2026
**Context:** Recovering from the Google June 2026 Spam Update (rolled out 24–26 June,
sitewide demotion for scaled content abuse — 66 pages published in June alone).

---

## What was verified before changing anything

Checked against live GSC API data (16 months) and the full repo history:

| Check | Result |
|---|---|
| All 44 blog pages return 200 | ✅ pass |
| Canonicals present | ✅ 44/44 |
| Sitemap matches live files | ✅ 44 = 44 (`blog/index.html` correctly excluded) |
| `data/blog.json` matches live files | ✅ 44 = 44 |
| `vercel.json` redirects | ✅ 221 rules, 0 duplicates, 0 chains, 0 self-redirects |
| Redirect destinations resolve | ✅ all 308/307 → 200 (tested live) |
| Deleted pages still getting traffic | ✅ 0 clicks (only stray impressions) |
| GA4 tag coverage | ✅ 45/45 pages |
| Broken internal links | ✅ 0 |
| JSON-LD parses | ✅ 0 errors |

**The 20 Aug prune was executed correctly.** Nothing there needed undoing.

### Correction to earlier analysis
An earlier pass flagged 3 "broken redirects"
(`/blog/instagram-search-optimization-2026.webp`, `/blog/`, `/blog/:rest*`).
That was wrong — those are valid Vercel wildcard patterns and all resolve
correctly when tested live. No action needed.

---

## What this change actually fixes

Three real problems the data exposed:

### 1. 18 orphan pages (zero inbound internal links)
Google reaches them only via sitemap; they receive no internal authority.
After this change **every one of the 44 pages has 1–12 inbound links** and
there are **421 internal `/blog/` links** across the site (was ~90).

### 2. No `dateModified` on any page
Only `datePublished` existed. Post-spam-update, freshness is a trust signal.
All 44 pages now carry `dateModified`.

### 3. 85% of all traffic sits on ONE page
`/blog/viral-captions-for-reels-2026` = 615 of 721 clicks (21–28 Aug).
If that page slips, the site loses nearly everything. The related-guides
blocks start distributing authority to the other 43 pages.

---

## Files changed

```
blog/*.html          44 files — related-guides block + dateModified
sitemap-blogs.xml    lastmod refreshed
fix_seo.py           the script (idempotent, safe to re-run)
```

Re-run any time after adding a post:

```bash
python3 fix_seo.py --dry-run   # preview
python3 fix_seo.py             # apply
```

---

## Deploy

```bash
git add -A
git commit -m "SEO: fix 18 orphan pages, add related-guides clusters, add dateModified

- 421 internal blog links (was ~90); every page now has 1-12 inbound
- Topic clusters: captions, mood/style, occasion, football, bio, growth
- dateModified added to all 44 Article schemas
- Verified: 0 broken links, 0 JSON-LD errors, 90/90 balanced tags
- Reduces single-page dependency (85% of traffic was on one URL)"
git push
```

Vercel auto-deploys. After it goes live:

1. GSC → Sitemaps → resubmit `https://captionstudio.in/sitemap.xml`
2. GSC → URL Inspection → request indexing for `/blog/copy-paste-instagram-captions`
3. Annotate **24 June 2026** in your reporting as the spam-update date

---

## ⛔ Do NOT do these

- **Do not publish 4–5 posts/day again.** That velocity caused the demotion.
  Ceiling: **2 genuinely useful posts per week** for the next 6 months.
- **Do not create match-specific event pages**
  (`argentina-vs-algeria-world-cup-2026-captions` style). One evergreen hub,
  updated per tournament.
- **Do not submit a reconsideration request.** Algorithmic demotions have no
  appeal process. Only time + clean history lifts them.

---

## What the data says about recovery

Current state (21–28 Aug): **721 clicks / 8 days ≈ 90 clicks/day**, position 3.2,
CTR 22%. Rankings are healthy — the demotion suppresses *impressions*
(how often you're shown), not your ability to convert when shown.

| Window | Expectation | Why |
|---|---|---|
| Sep – Oct 2026 | 85–110/day, flat | Serving the demotion. Flat ≠ failure. |
| Nov – Dec 2026 | 150–400/day | First realistic reassessment window. Recovery is a step change, not a slope. |
| Q1 2027 | 400–800/day | If reassessment lands + internal linking compounds. |

Google's own guidance: recovery from a spam demotion "can take many months."

### The one number that matters most
`instagram caption copy` — 16,018 impressions in June, ~0 now. It is your
single biggest lost keyword. The page still exists but no longer targets the
phrase. Put the exact phrase in the H1 and `<title>` of
`/blog/copy-paste-instagram-captions`. It won't fully return until the domain
demotion lifts, but it should be ready when it does.
