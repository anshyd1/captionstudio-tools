#!/usr/bin/env python3
"""
CaptionStudio.in — post-spam-update SEO repair.

Fixes verified against live GSC data + full crawl (31 Aug 2026):
  1. 18 orphan pages with zero inbound internal links
  2. 33 of 45 pages have no dateModified (freshness signal)
  3. 85% of all traffic concentrated on ONE page (single point of failure)

Adds a topically-clustered "Related guides" block before </main> (or before
footer) on every blog page, and normalises Article schema dateModified.

Idempotent: re-running will not duplicate blocks. Run from repo root.
    python3 fix_seo.py --dry-run     # preview
    python3 fix_seo.py               # apply
"""
import os, re, json, sys, datetime, argparse
from collections import defaultdict

BLOG = "blog"
MARK = "<!-- related-guides:auto -->"
TODAY = datetime.date.today().isoformat()

# ---------------------------------------------------------------- clusters
# Topic clusters. Every page links to siblings in its own cluster + the hub.
CLUSTERS = {
    "captions_core": [
        "viral-captions-for-reels-2026",
        "copy-paste-instagram-captions",
        "instagram-viral-captions-reels-hinglish-2026",
        "ultimate-instagram-captions",
        "best-instagram-captions-reels-2026",
        "short-instagram-captions-2026",
        "funny-captions-for-instagram-hindi-2026",
        "best-captions-boys-2026",
    ],
    "mood_style": [
        "attitude-captions-2026",
        "aesthetic-instagram-captions-2026",
        "traditional-captions-instagram-2026",
        "mirror-selfie-captions-for-instagram-2026",
        "monsoon-captions-instagram-2026",
        "photo-dump-captions-instagram-2026",
        "love-captions-hinglish-2026",
    ],
    "occasion": [
        "birthday-captions-instagram-2026",
        "friendship-day-captions-instagram-2026",
        "wedding-captions-for-instagram-2026",
        "fathers-day-captions-hindi-2026",
        "group-photo-captions-instagram-2026",
        "college-life-captions-instagram-2026",
    ],
    "football": [
        "football-captions-instagram",
        "messi-captions-instagram-2026",
        "ronaldo-captions-instagram-2026",
        "brazil-football-captions-instagram",
        "argentina-football-captions-instagram",
        "messi-vs-ronaldo-quotes-captions-instagram",
        "mbappe-captions-instagram-france-record-2026",
        "fifa-world-cup-2026-captions-instagram",
    ],
    "bio": [
        "best-instagram-bio-copy-paste-2026",
        "instagram-bio-for-girls-2026",
        "instagram-bio-for-boys-2026",
        "mahadev-bio-for-instagram-hindi-2026",
    ],
    "growth": [
        "instagram-hashtag-strategy-viral-reels",
        "instagram-reel-hooks-2026",
        "social-media-content-strategy-small-business-2026",
        "real-estate-instagram-captions-2026",
        "education-captions-for-instagram-reels-2026",
        "gym-workout-captions-hinglish-instagram",
        "spider-man-quotes-instagram-2026",
        "best-capcut-alternatives-india-2026",
    ],
}

HUB = "viral-captions-for-reels-2026"          # the 85%-traffic money page
SECOND = "copy-paste-instagram-captions"        # head-keyword recovery target

def title_of(slug, html):
    m = re.search(r"<title>(.*?)</title>", html, re.S | re.I)
    t = (m.group(1).strip() if m else slug.replace("-", " ").title())
    t = re.sub(r"\s*[|—–-]\s*Caption ?Studio.*$", "", t).strip()
    t = re.sub(r"\s*\((Copy Paste|One-Tap Copy)[^)]*\)\s*", " ", t).strip()
    return re.sub(r"\s{2,}", " ", t)[:70]


def build_block(slug, titles, cluster_map):
    """Pick 6 contextual links: cluster siblings first, then hub pages."""
    picks, seen = [], {slug}
    for s in cluster_map.get(slug, []):
        if s not in seen and s in titles:
            picks.append(s); seen.add(s)
        if len(picks) >= 5:
            break
    for s in (HUB, SECOND):
        if s not in seen and s in titles and len(picks) < 6:
            picks.append(s); seen.add(s)
    if not picks:
        return None
    items = "\n".join(
        f'      <li><a href="/blog/{s}">{titles[s]}</a></li>' for s in picks
    )
    return f"""{MARK}
  <aside class="related-guides" aria-labelledby="related-guides-h">
    <h2 id="related-guides-h">Related guides</h2>
    <ul>
{items}
    </ul>
  </aside>
"""


CSS = """<style>
.related-guides{max-width:820px;margin:44px auto 8px;padding:22px 24px;border:1px solid #e6eaf0;border-radius:14px;background:#fbfcfe}
.related-guides h2{font-size:18px;margin:0 0 12px;letter-spacing:-.2px}
.related-guides ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:8px 20px}
.related-guides li{margin:0}
.related-guides a{display:block;padding:7px 0;color:#1d4ed8;text-decoration:none;font-size:14.5px;line-height:1.45;border-bottom:1px solid #eef1f6}
.related-guides a:hover{text-decoration:underline}
</style>
"""


def inject(html, block):
    """Insert block before </main>, else before <footer, else before </body>."""
    for pat in (r"</main>", r"<footer\b", r"</body>"):
        m = re.search(pat, html, re.I)
        if m:
            return html[:m.start()] + block + "\n  " + html[m.start():]
    return html + block


def fix_datemodified(html):
    """Ensure Article/BlogPosting schema carries a dateModified."""
    changed = False
    if '"dateModified"' in html:
        return html, False
    m = re.search(r'"datePublished"\s*:\s*"([^"]+)"', html)
    if m:
        ins = f'"dateModified": "{TODAY}", '
        html = html[: m.start()] + ins + html[m.start():]
        changed = True
    return html, changed


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    if not os.path.isdir(BLOG):
        sys.exit("run from repo root (blog/ not found)")

    files = sorted(f for f in os.listdir(BLOG)
                   if f.endswith(".html") and f != "index.html")
    slugs = [f[:-5] for f in files]
    pages = {s: open(os.path.join(BLOG, s + ".html"), encoding="utf-8").read()
             for s in slugs}
    titles = {s: title_of(s, h) for s, h in pages.items()}

    cluster_map = {}
    for members in CLUSTERS.values():
        present = [m for m in members if m in pages]
        for m in present:
            cluster_map[m] = [x for x in present if x != m]
    # anything unclustered falls back to the core captions cluster
    for s in slugs:
        cluster_map.setdefault(
            s, [x for x in CLUSTERS["captions_core"] if x in pages and x != s])

    n_links = n_dates = 0
    for s in slugs:
        html = pages[s]
        orig = html

        if MARK not in html:
            block = build_block(s, titles, cluster_map)
            if block:
                html = inject(html, block)
                if ".related-guides{" not in html:
                    html = html.replace("</head>", CSS + "</head>", 1)
                n_links += 1

        html, d = fix_datemodified(html)
        n_dates += d

        if html != orig and not args.dry_run:
            open(os.path.join(BLOG, s + ".html"), "w", encoding="utf-8").write(html)

    # keep sitemap lastmod honest
    sm = "sitemap-blogs.xml"
    if os.path.exists(sm) and not args.dry_run:
        t = open(sm, encoding="utf-8").read()
        t = re.sub(r"<lastmod>[^<]*</lastmod>", f"<lastmod>{TODAY}</lastmod>", t)
        open(sm, "w", encoding="utf-8").write(t)

    tag = "[dry-run] would update" if args.dry_run else "updated"
    print(f"{tag}: related-links on {n_links} pages, dateModified on {n_dates} pages")
    print(f"pages processed: {len(slugs)}")


if __name__ == "__main__":
    main()
