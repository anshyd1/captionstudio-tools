<div align="center">

# 🎬 CaptionStudio.in

### Free caption, hashtag & bio tools for Indian Instagram creators

[![Live Site](https://img.shields.io/badge/🌐_Live-captionstudio.in-FF6B35?style=for-the-badge)](https://captionstudio.in)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![CDN](https://img.shields.io/badge/CDN-Cloudflare-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://cloudflare.com)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![No Build](https://img.shields.io/badge/Build_Step-None-success?style=flat-square)

**Static site · Hand-written HTML · Zero build step**

Built by **[Ansh Yadav](https://captionstudio.in/about)** — Gorakhpur, Uttar Pradesh 🇮🇳

</div>

---

## 📖 About

CaptionStudio is a free, ad-supported static site offering copy-paste Instagram
captions, bios and hashtag sets for Indian creators — in Hindi, English and
Hinglish — plus a few lightweight browser-based generator tools.

No accounts, no signup, no backend. Everything runs client-side.

---

## 📂 Repository Layout

```
captionstudio-tools/
│
├── 🏠 /                     root pages (index, about, tools, earning, guide, legal)
├── 📝 /blog/                article pages + index.html listing
├── 🛠️  /tools/               caption · hashtag · bio generators
├── 📊 /data/                blog.json · homepage-blogs.json
├── 🖼️  /img/                 images (webp + jpg)
├── 📦 /assets/              shared assets
│
├── ⚙️  vercel.json           redirects · security headers · cleanUrls
├── 🗺️  sitemap*.xml          index + child sitemaps
├── 🔔 indexnow.py           IndexNow submitter
├── 🧹 sw.js                 cleanup worker — unregisters a rogue third-party SW
└── 🔧 fix_seo*.py           SEO repair scripts (idempotent, --dry-run first)
```

---

## 🚀 Quick Start

```bash
git clone https://github.com/anshyd1/captionstudio-tools.git
cd captionstudio-tools

python3 -m http.server 8000
```

> ⚠️ **Routing differs locally.** `vercel.json` sets `cleanUrls: true`, so local
> `.html` links behave differently than production. Use `vercel dev` for
> accurate routing.

### 📤 Deploying

| | |
|---|---|
| **Trigger** | Push to `main` |
| **Build time** | ~2 minutes |
| **Platform** | Vercel (auto-deploy) |

> 🚨 `.github/workflows/` contains a **GitHub Pages workflow** that is *not* the
> production path and does not honour `vercel.json`. It should be disabled.

---

## 🎨 Conventions

### Page structure

Every page is standalone HTML with inline `<style>`. There is no shared
stylesheet and no framework — keep it that way unless the whole site is
refactored at once.

### Tables

Always wrap tables so they scroll instead of stretching the page on mobile:

```html
<div class="table-wrap">
  <table> … </table>
</div>
```

```css
.table-wrap {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin: 2rem 0;
}
.table-wrap > table { margin: 0; min-width: 100%; }
```

### Titles

25–60 characters. Must not end mid-entity (`&amp;`) or with an unbalanced `(`.

> ⚠️ `trim_title()` in `fix_seo2.py` cuts inside HTML entities. Its strip set is
> `" -—–|:,"` — it should include `&/(+`. Always check output before committing.

### Images

Every `<img>` needs `width`, `height`, `alt` and `loading="lazy"`.

---

## 🌿 Content Policy — Evergreen Only

> **This site does not publish trend or event content.**

Trend pages spike briefly and then decay to nothing, while evergreen pages hold
steady for months. Analytics across the 2026 season confirmed this clearly
enough that trend content was retired entirely.

### Rules

| # | Rule |
|:---:|:---|
| 1️⃣ | **No match-day, tournament, festival or news-cycle pages.** No "X vs Y captions", no "today's match", no "IPL final memes". |
| 2️⃣ | **Every new page must answer a year-round intent** — a caption category, a bio type, a how-to. |
| 3️⃣ | **Update in place.** Refresh the existing article instead of publishing a dated variant. Dated variants cause cannibalization. |
| 4️⃣ | **Keep `dateModified` accurate** — it should reflect the day the page actually changed. |
| 5️⃣ | **One page per intent.** Check whether an existing page already targets the query first. |

> ℹ️ A famous person is **not** automatically an evergreen subject. Player and
> celebrity pages tied to a tournament decay on the same curve as the event.

---

## 🔔 IndexNow

Notifies Bing, Yandex, Seznam and Naver when pages change. DuckDuckGo and Yahoo
inherit Bing's index.

```bash
python3 indexnow.py --check                 # verify key file is reachable
python3 indexnow.py --changed               # submit pages changed in last commit
python3 indexnow.py --urls /blog/my-page    # submit specific URLs
python3 indexnow.py --dry-run --all         # preview without submitting
```

| Response | Meaning |
|:---:|:---|
| `200` / `202` | ✅ Accepted |
| `403` | Key file not reachable |
| `422` | Key mismatch |
| `429` | Rate limited |

> ⚠️ **Don't run `--all` routinely.** It is for one-time bulk submission only;
> repeated bulk submits look like spam. Use `--changed` after each deploy.
>
> ⚠️ **Cloudflare blocks the default `Python-urllib` User-Agent** on this domain
> (returns 403). Any script fetching captionstudio.in must send a browser UA.

---

## 📉 Analytics

GA4 and Search Console are configured for this site. **Property IDs, tokens and
performance data are not kept in this repository** — see the private ops notes.

Custom events:

| Event | Fires when |
|:---|:---|
| `caption_copy` | User copies a caption |
| `tool_generate` | User runs a generator |
| `scroll_depth` | Scroll milestones |

> ℹ️ GA4 coverage was incomplete before **21 Aug 2026** (commit `9da22df` added
> GA4 to root pages). The session jump on that date is a **tracking fix, not
> growth** — don't read it as an increase.

---

## 🐛 Known Issues

| Priority | Issue | Detail |
|:---:|:---|:---|
| 🔴 | **GitHub Pages workflow active** | Does not honour `vercel.json`. Should be disabled. |
| 🔴 | **Cannibalization** | Several queries served by 2+ URLs; `.html` and clean URLs both indexed. |
| 🟠 | **`www` still indexed** | Redirect exists in `vercel.json` but search engines retain www variants. |
| 🟠 | **Tap targets** | Some pages have interactive elements under 32px. |
| 🟡 | **Stale dates** | A few pages still show July `dateModified` values. |
| 🟡 | **Legacy `.html` URLs** | Older indexed URLs still carry the `.html` suffix. |
| 🟢 | **Repo size** | `.git` is disproportionately large; a zip archive is tracked in `assets/`. |
| 🟢 | **E-E-A-T** | Author signals missing on most pages. |

<details>
<summary><b>✅ Recently fixed</b></summary>

<br>

| Date | Fix |
|:---|:---|
| 1 Sep 2026 | Truncated `<title>` on the birthday page — ended mid-entity at `&amp;` |
| 1 Sep 2026 | 27 unwrapped tables across 11 pages caused horizontal overflow on mobile |
| 1 Sep 2026 | Bio page titles and descriptions retargeted to shortened search phrasing |
| 1 Sep 2026 | IndexNow activated |

</details>

---

## 🔧 Maintenance Scripts

```bash
python3 fix_seo.py  --dry-run    # orphan pages, related-guides clusters, dateModified
python3 fix_seo2.py --dry-run    # title trimming, CLS width/height, lazy loading
python3 fix_seo3.py --dry-run    # E-E-A-T author signals
```

All are idempotent. **Always run `--dry-run` first.**

---

## ✔️ Before You Commit

- [ ] `dateModified` reflects the day the page actually changed
- [ ] `<title>` is 25–60 chars, doesn't end mid-entity or with an unbalanced `(`
- [ ] New page serves a **year-round** intent, not a trend
- [ ] No existing page already targets this query
- [ ] Images have `width`, `height`, `alt` and `loading="lazy"`
- [ ] Tables are wrapped in `<div class="table-wrap">`
- [ ] Tap targets are at least 32px
- [ ] No analytics IDs, tokens or traffic data added to tracked files
- [ ] Run `python3 indexnow.py --changed` after deploy

---

<div align="center">

### 📬 Contact

[![Website](https://img.shields.io/badge/Website-captionstudio.in-FF6B35?style=flat-square)](https://captionstudio.in)
[![Telegram](https://img.shields.io/badge/Telegram-skill2incomehub-26A5E4?style=flat-square&logo=telegram&logoColor=white)](https://t.me/skill2incomehub)

**Content © CaptionStudio** · Code available for reference

</div>
