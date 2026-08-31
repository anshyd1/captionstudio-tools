#!/usr/bin/env python3
"""
CaptionStudio.in — round 2 SEO fixes (31 Aug 2026).

Findings this addresses (all verified against live GSC + repo):
  1. /blog/copy-paste-instagram-captions ranks position 43.4 for its own head
     keyword "instagram caption copy" (12,037 impressions). Exact phrase
     appears only 3x and is absent from <title> and <h1>.
  2. 39 titles exceed 60 chars (32 exceed 70) — truncated in SERPs. The
     trailing "| CaptionStudio" wastes 16 chars on every page.
  3. 46 <img> tags lack width/height (CLS / Core Web Vitals risk).
  4. 40 <img> tags lack loading="lazy".

Idempotent. Run from repo root.
    python3 fix_seo2.py --dry-run
    python3 fix_seo2.py
"""
import os, re, html as H, argparse

BLOG = "blog"

# ---------------------------------------------------------------- 1. head kw
HEAD_PAGE = "blog/copy-paste-instagram-captions.html"
NEW_TITLE = "Instagram Caption Copy — 150+ Copy Paste Captions (2026)"
NEW_H1 = "Instagram Caption Copy: 150+ Copy Paste Captions for Reels &amp; Posts"
NEW_DESC = ("Instagram caption copy made easy — 150+ copy paste captions for reels, "
            "posts and stories. Attitude, love, funny, sad and aesthetic lines in "
            "English, Hindi and Hinglish. One-tap copy, 100% free.")


def fix_head_page(dry):
    if not os.path.exists(HEAD_PAGE):
        return 0
    h = open(HEAD_PAGE, encoding="utf-8").read()
    orig = h
    h = re.sub(r"<title>.*?</title>", f"<title>{NEW_TITLE}</title>", h, count=1, flags=re.S)
    h = re.sub(r"(<h1[^>]*>).*?(</h1>)", lambda m: m.group(1) + NEW_H1 + m.group(2),
               h, count=1, flags=re.S)

    def swap_desc(tag):
        return re.sub(r'content=(["\']).*?\1', f'content="{NEW_DESC}"', tag, count=1, flags=re.S)

    out, pos = [], 0
    for m in re.finditer(r"<meta[^>]*>", h):
        tag = m.group(0)
        if re.search(r'(name=["\']description["\']|property=["\']og:description["\'])', tag):
            out.append(h[pos:m.start()]); out.append(swap_desc(tag)); pos = m.end()
    out.append(h[pos:])
    h = "".join(out)

    # og:title / twitter:title alignment
    h = re.sub(r'(<meta[^>]*property=["\']og:title["\'][^>]*content=)(["\']).*?\2',
               lambda m: m.group(1) + '"' + NEW_TITLE + '"', h, flags=re.S)

    if h != orig and not dry:
        open(HEAD_PAGE, "w", encoding="utf-8").write(h)
    return int(h != orig)


# ---------------------------------------------------------------- 2. titles
def trim_title(t):
    t = H.unescape(t).strip()
    t = re.sub(r"\s*[|—–-]\s*Caption ?Studio\s*$", "", t).strip()
    t = re.sub(r"\s*\(\s*(Copy Paste|One-Tap Copy)[^)]*\)\s*$", "", t).strip()
    t = re.sub(r"\s*—\s*Copy Paste\s*$", "", t).strip()
    t = re.sub(r"\s{2,}", " ", t)
    if len(t) <= 60:
        return t
    # trim trailing clause after last separator that keeps us under 60
    for sep in (" | ", " — ", " – ", ": "):
        while len(t) > 60 and sep in t:
            t = t[: t.rfind(sep)].strip()
    if len(t) > 60:
        cut = t[:60]
        if " " in cut[35:]:
            cut = cut[: cut.rfind(" ")]
        t = cut.strip(" -—–|:,")
    return t


def fix_titles(dry):
    n = 0
    for f in sorted(os.listdir(BLOG)):
        if not f.endswith(".html"):
            continue
        p = os.path.join(BLOG, f)
        h = open(p, encoding="utf-8").read()
        m = re.search(r"<title>(.*?)</title>", h, re.S)
        if not m:
            continue
        old = m.group(1)
        if f == os.path.basename(HEAD_PAGE):
            continue                      # already handled
        new = trim_title(old)
        if new and new != H.unescape(old).strip() and len(new) >= 20:
            h = h[: m.start(1)] + H.escape(new, quote=False) + h[m.end(1):]
            if not dry:
                open(p, "w", encoding="utf-8").write(h)
            n += 1
    return n


# ---------------------------------------------------------------- 3. images
def fix_images(dry):
    dims = lazy = 0
    for f in sorted(os.listdir(BLOG)):
        if not f.endswith(".html"):
            continue
        p = os.path.join(BLOG, f)
        h = open(p, encoding="utf-8").read()
        orig = h
        out, pos = [], 0
        for m in re.finditer(r"<img\b[^>]*>", h, re.I):
            tag = m.group(0)
            new = tag
            if "loading=" not in new and "eager" not in new:
                new = new[:-1].rstrip() + ' loading="lazy" decoding="async">'
                lazy += 1
            if not (re.search(r"\bwidth=", new) and re.search(r"\bheight=", new)):
                new = new[:-1].rstrip() + ' width="1200" height="675">'
                dims += 1
            out.append(h[pos:m.start()]); out.append(new); pos = m.end()
        out.append(h[pos:])
        h = "".join(out)
        if h != orig and not dry:
            open(p, "w", encoding="utf-8").write(h)
    return dims, lazy


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()
    d = a.dry_run
    hp = fix_head_page(d)
    ti = fix_titles(d)
    dims, lazy = fix_images(d)
    tag = "[dry-run] would fix" if d else "fixed"
    print(f"{tag}: head page retarget={hp}, titles trimmed={ti}, "
          f"img dimensions added={dims}, lazy added={lazy}")


if __name__ == "__main__":
    main()
