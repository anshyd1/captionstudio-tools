#!/usr/bin/env python3
"""
fix_schema_sync.py — Sync live page dates to sitemap lastmod (honest dates)

Problem: 22/34 blogs have sitemap lastmod != schema dateModified != visible byline
Google Date Guidelines: visible + schema + sitemap must match, same timezone.

Fix: For each mismatched page, set:
  - JSON-LD dateModified = sitemap lastmod (with T10:00:00+05:30)
  - Visible "Last updated:" / "Updated ..." to same date (Month D, YYYY)
  - Keep datePublished as original (creation)

Usage: python3 fix_schema_sync.py --dry-run / --apply
"""
import pathlib, re
from datetime import datetime

ROOT = pathlib.Path(__file__).parent
import xml.etree.ElementTree as ET

# Parse sitemap
sitemap_text = pathlib.Path(ROOT / "sitemap-blogs.xml").read_text()
pairs = re.findall(r"<loc>(.*?)</loc>\s*<lastmod>(.*?)</lastmod>", sitemap_text, re.S)
sm_map = {loc.split("/")[-1]: mod for loc, mod in pairs}

# Also sitemap-main/tools
for sm in ["sitemap-main.xml","sitemap-tools.xml"]:
    if (ROOT / sm).exists():
        txt = pathlib.Path(ROOT / sm).read_text()
        for loc, mod in re.findall(r"<loc>(.*?)</loc>\s*<lastmod>(.*?)</lastmod>", txt, re.S):
            # main pages: loc like https://captionstudio.in/blog or /tools
            slug = loc.rstrip("/").split("/")[-1] or "index"
            # map to file
            if loc == "https://captionstudio.in/":
                slug = "index"
            sm_map[slug] = mod
            sm_map[loc] = mod

def format_visible(iso_date):
    # 2026-04-08 -> April 8, 2026
    dt = datetime.strptime(iso_date, "%Y-%m-%d")
    return dt.strftime("%B %d, %Y").replace(" 0"," ")

def fix_file(slug, sm_date, dry=True):
    # slug is like group-photo-captions-instagram-2026 or index
    # Find file
    candidates = [
        ROOT / f"blog/{slug}.html",
        ROOT / f"{slug}.html",
        ROOT / "index.html" if slug=="index" else None,
        ROOT / f"{slug}/index.html",
    ]
    f = None
    for c in candidates:
        if c and c.exists():
            f = c
            break
    if not f or not f.exists():
        return f"SKIP {slug} — file not found"
    html = f.read_text(encoding="utf-8")
    orig = html
    changes = 0
    # 1. Fix JSON-LD dateModified — only if different
    m = re.search(r'"dateModified"\s*:\s*"([^"]+)"', html)
    if m:
        old_full = m.group(1)
        old_date = old_full[:10]
        if old_date != sm_date:
            # preserve time part
            if "T" in old_full:
                new_val = sm_date + old_full[10:]
            else:
                new_val = sm_date
            html = html.replace(f'"dateModified":"{old_full}"', f'"dateModified":"{new_val}"')
            html = html.replace(f'"dateModified": "{old_full}"', f'"dateModified": "{new_val}"')
            changes += 1
    # 2. Fix visible "Last updated:" and "Updated ..." — only if different
    vis_date = format_visible(sm_date)
    # Last updated
    m2 = re.search(r"Last updated:\s*</strong>\s*([A-Z][a-z]+ \d{1,2}, \d{4})", html)
    if m2 and m2.group(1) != vis_date:
        html = re.sub(r"Last updated:\s*</strong>\s*[A-Z][a-z]+ \d{1,2}, \d{4}", f"Last updated:</strong> {vis_date}", html)
        changes += 1
    m3 = re.search(r"Updated ([A-Z][a-z]+ \d{1,2}, \d{4})", html)
    if m3 and m3.group(1) != vis_date:
        # Only replace where it's the hero "Updated ..." near top, not every occurrence? But ok
        # To avoid replacing Published badge, check context: Updated should be near hero-meta
        # We replace first occurrence
        html = re.sub(r"Updated [A-Z][a-z]+ \d{1,2}, \d{4}", f"Updated {vis_date}", html, count=1)
        changes += 1

    if changes > 0:
        if not dry:
            f.write_text(html, encoding="utf-8")
        return f"FIXED {slug}: SM {sm_date} | schema+visible updated ({changes} changes)"
    else:
        return f"OK {slug}: already sync SM {sm_date}"

def main(dry=True):
    print(f"=== {'DRY RUN' if dry else 'APPLY'}: Sync 22 mismatched pages ===")
    # Load mismatched list from previous analysis (22)
    # Instead, check all in sm_map that have blog file
    all_slugs = []
    for loc, sm_date in pairs:
        slug = loc.split("/")[-1]
        all_slugs.append((slug, sm_date))
    fixed = 0
    for slug, sm_date in all_slugs:
        result = fix_file(slug, sm_date, dry=dry)
        if "FIXED" in result or "MISMATCH" in result:
            print(result)
            if "FIXED" in result:
                fixed += 1
        # Also check if already sync but we still want to show
        if "OK" in result and dry:
            # only show mismatched in dry? Let's show all for verify
            pass
    print(f"\nTotal to fix: {fixed} (dry={dry})")
    if dry and fixed>0:
        print("Run: python3 fix_schema_sync.py --apply")

if __name__ == "__main__":
    import sys
    if "--apply" in sys.argv:
        main(dry=False)
        # verify after
        print("\n=== VERIFY AFTER APPLY ===")
        main(dry=True)
    else:
        main(dry=True)
