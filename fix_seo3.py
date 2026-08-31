#!/usr/bin/env python3
"""
CaptionStudio.in — round 3: E-E-A-T author signals.

After the June 2026 spam update (scaled content abuse), demonstrable human
authorship is one of the strongest trust signals available. Findings:
  - Person schema on only 7 of 45 pages
  - Visible byline on 30 of 45 pages
  - No author bio box anywhere (byline is just a name, no credentials)
  - 8 images still missing alt text

This adds, idempotently:
  1. Person schema (matching the existing pattern on aesthetic-captions page)
     with a per-page knowsAbout derived from the page topic
  2. A visible author bio box before the related-guides block, linking to
     /about and real social profiles
  3. author field inside existing Article/BlogPosting schema
  4. alt text on the remaining images

Run from repo root:
    python3 fix_seo3.py --dry-run
    python3 fix_seo3.py
"""
import os, re, json, html as H, argparse

BLOG = "blog"
AUTHOR_MARK = "<!-- author-box:auto -->"
PERSON_MARK = "<!-- person-schema:auto -->"

AUTHOR = "Ansh Yadav"
JOB = "Founder & Editor, CaptionStudio"
SAME_AS = ["https://t.me/skill2incomehub", "https://instagram.com/ansh7.0k"]

# topic -> knowsAbout, keeps schema honest rather than identical everywhere
TOPICS = [
    (r"bio", ["Instagram bio writing", "creator profile optimisation"]),
    (r"hashtag", ["Instagram hashtag strategy", "reach optimisation"]),
    (r"hook|reel", ["Instagram Reels hooks", "short-form video retention"]),
    (r"football|messi|ronaldo|fifa|brazil|argentina|mbappe",
     ["sports social media captions", "football fan content"]),
    (r"attitude|savage|aesthetic|love|sad|funny",
     ["Instagram caption writing", "Hinglish content"]),
    (r"birthday|wedding|friendship|festival|monsoon|traditional",
     ["occasion captions", "Indian festival content"]),
    (r"ugc|earn|money|brand|business|real-estate",
     ["creator monetisation India", "UGC and brand deals"]),
    (r"growth|strategy|algorithm",
     ["Instagram growth strategy", "social media SEO"]),
]
BASE_KNOWS = ["Instagram captions", "creator economy India"]


def knows_for(slug):
    out = []
    for pat, vals in TOPICS:
        if re.search(pat, slug):
            out = vals
            break
    return out + BASE_KNOWS


BIO_CSS = """<style>
.author-box{max-width:820px;margin:38px auto 0;padding:20px 22px;border:1px solid #e6eaf0;border-radius:14px;background:#fff;display:flex;gap:16px;align-items:flex-start}
.author-box .ab-av{flex:0 0 54px;width:54px;height:54px;border-radius:50%;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:20px;letter-spacing:.5px}
.author-box .ab-body{flex:1;min-width:0}
.author-box .ab-name{font-size:15.5px;font-weight:700;margin:0 0 2px}
.author-box .ab-role{font-size:12.5px;color:#64748b;margin:0 0 8px}
.author-box .ab-text{font-size:13.8px;line-height:1.6;color:#334155;margin:0 0 9px}
.author-box .ab-links a{font-size:13px;color:#4f46e5;text-decoration:none;margin-right:14px}
.author-box .ab-links a:hover{text-decoration:underline}
@media(max-width:560px){.author-box{flex-direction:column;gap:12px}}
</style>
"""

BIO_HTML = f"""{AUTHOR_MARK}
  <aside class="author-box">
    <div class="ab-av" aria-hidden="true">AY</div>
    <div class="ab-body">
      <p class="ab-name">{AUTHOR}</p>
      <p class="ab-role">{H.escape(JOB)} · Gorakhpur, Uttar Pradesh</p>
      <p class="ab-text">Ansh founded CaptionStudio in 2024 after watching Indian creators
      struggle with caption tools built for Western audiences. He writes and edits every
      guide here, testing captions and hooks on real Instagram accounts before publishing.</p>
      <p class="ab-links">
        <a href="/about">About the author</a>
        <a href="https://instagram.com/ansh7.0k" rel="me noopener" target="_blank">Instagram</a>
        <a href="https://t.me/skill2incomehub" rel="me noopener" target="_blank">Telegram</a>
      </p>
    </div>
  </aside>
"""


def person_schema(slug):
    obj = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": AUTHOR,
        "jobTitle": JOB,
        "url": "https://captionstudio.in/about",
        "worksFor": {"@type": "Organization", "name": "CaptionStudio",
                     "url": "https://captionstudio.in"},
        "sameAs": SAME_AS,
        "knowsAbout": knows_for(slug),
    }
    return (PERSON_MARK + '\n<script type="application/ld+json">'
            + json.dumps(obj, ensure_ascii=False) + "</script>\n")


def add_author_to_article(h):
    """Put an author reference inside Article/BlogPosting schema if absent."""
    changed = False
    out, pos = [], 0
    for m in re.finditer(r'(<script[^>]*ld\+json[^>]*>)(.*?)(</script>)', h, re.S):
        body = m.group(2)
        try:
            data = json.loads(body)
        except Exception:
            continue

        def walk(o):
            nonlocal changed
            if isinstance(o, list):
                return [walk(x) for x in o]
            if isinstance(o, dict):
                t = o.get("@type", "")
                ts = t if isinstance(t, list) else [t]
                if any(str(x) in ("Article", "BlogPosting", "NewsArticle") for x in ts):
                    a = o.get("author")
                    ok = isinstance(a, dict) and a.get("@type") == "Person" and a.get("name")
                    if not ok:
                        o["author"] = {"@type": "Person", "name": AUTHOR,
                                       "url": "https://captionstudio.in/about"}
                        changed = True
                return {k: walk(v) for k, v in o.items()}
            return o

        new = walk(data)
        if changed:
            out.append(h[pos:m.start(2)])
            out.append(json.dumps(new, ensure_ascii=False))
            pos = m.end(2)
    out.append(h[pos:])
    return "".join(out), changed


def fix_alt(h):
    n = 0
    out, pos = [], 0
    for m in re.finditer(r"<img\b[^>]*>", h, re.I):
        tag = m.group(0)
        if re.search(r'alt=["\'][^"\']+["\']', tag):
            continue
        src = re.search(r'src=["\']([^"\']+)["\']', tag)
        if not src:
            continue
        name = os.path.basename(src.group(1))
        name = re.sub(r"\.(webp|jpg|jpeg|png|gif|svg)$", "", name, flags=re.I)
        alt = re.sub(r"[-_]+", " ", name).strip()
        alt = re.sub(r"\b(\d{3,4}x\d{3,4}|hero|img|image)\b", "", alt, flags=re.I).strip()
        alt = (alt[:1].upper() + alt[1:]) if alt else "CaptionStudio illustration"
        if re.search(r'alt=["\']["\']', tag):
            new = re.sub(r'alt=["\']["\']', f'alt="{H.escape(alt)}"', tag, count=1)
        else:
            new = tag[:-1].rstrip() + f' alt="{H.escape(alt)}">'
        out.append(h[pos:m.start()]); out.append(new); pos = m.end(); n += 1
    out.append(h[pos:])
    return "".join(out), n


def inject_before(h, needle, block):
    i = h.find(needle)
    if i != -1:
        return h[:i] + block + "\n  " + h[i:]
    for pat in (r"</main>", r"<footer\b", r"</body>"):
        m = re.search(pat, h, re.I)
        if m:
            return h[:m.start()] + block + "\n  " + h[m.start():]
    return h + block


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()

    n_box = n_person = n_article = n_alt = 0
    for f in sorted(os.listdir(BLOG)):
        if not f.endswith(".html") or f == "index.html":
            continue
        slug = f[:-5]
        p = os.path.join(BLOG, f)
        h = open(p, encoding="utf-8").read()
        orig = h

        if AUTHOR_MARK not in h:
            h = inject_before(h, "<!-- related-guides:auto -->", BIO_HTML)
            if ".author-box{" not in h:
                h = h.replace("</head>", BIO_CSS + "</head>", 1)
            n_box += 1

        if PERSON_MARK not in h and '"@type": "Person"' not in h and '"@type":"Person"' not in h:
            h = h.replace("</head>", person_schema(slug) + "</head>", 1)
            n_person += 1

        h, ch = add_author_to_article(h)
        n_article += int(ch)

        h, na = fix_alt(h)
        n_alt += na

        if h != orig and not a.dry_run:
            open(p, "w", encoding="utf-8").write(h)

    tag = "[dry-run] would add" if a.dry_run else "added"
    print(f"{tag}: author boxes={n_box}, Person schema={n_person}, "
          f"article.author={n_article}, alt text={n_alt}")


if __name__ == "__main__":
    main()
