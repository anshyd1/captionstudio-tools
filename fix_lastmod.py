#!/usr/bin/env python3
"""
fix_lastmod.py — CaptionStudio Sitemap lastmod fixer
Problem: c5b5f97 ne 44 sitemap URLs ka lastmod 2026-08-31 ek saath kar diya (fake freshness)
Fix: Har <loc> ke liye us HTML file ka REAL git history date nikalo

Usage:
  python3 fix_lastmod.py --dry-run   # kya badlega dikhao
  python3 fix_lastmod.py --apply     # sitemap files me likh do
  python3 fix_lastmod.py --verify    # GSC jaisa check

Aaj ka commit (06 Sep 2026) — Day 1 Surgery
"""
import re, subprocess, pathlib, sys
from datetime import datetime

ROOT = pathlib.Path(__file__).parent
SITEMAPS = ["sitemap-blogs.xml", "sitemap-main.xml", "sitemap-tools.xml", "sitemap-images.xml"]

def git_lastmod_for_url(loc: str) -> str:
    """loc -> file + REAL date (creation for bulk, last for recent)"""
    url = loc.replace("https://captionstudio.in", "").strip("/")
    if not url:
        f = ROOT / "index.html"
    else:
        cand = ROOT / f"{url}.html"
        if cand.exists():
            f = cand
        else:
            cand2 = ROOT / f"{url}/index.html"
            if cand2.exists():
                f = cand2
            else:
                f = ROOT / f"{url}.html"
                if not f.exists():
                    return None
    try:
        # last commit date
        last = subprocess.check_output(
            ["git", "log", "-1", "--format=%ad", "--date=short", "--", str(f)],
            cwd=ROOT, text=True
        ).strip()
        # creation date
        try:
            cre_out = subprocess.check_output(
                ["git", "log", "--diff-filter=A", "--follow", "--format=%ad", "--date=short", "--", str(f)],
                cwd=ROOT, text=True
            ).strip().splitlines()
            creation = cre_out[-1].strip() if cre_out else last
        except:
            creation = last
        # If last is bulk date 2026-08-31 and file was created earlier, use creation to de-bulk
        # Keep 2026-09-01 for files genuinely updated on 01 Sep (recent 16)
        if last == "2026-08-31" and creation != last and creation < last:
            # check if file had a meaningful update on 31 Aug (check diff stat)
            # if file was in SEO round but only metadata, prefer creation
            # Use creation to restore diversity (pre-bulk dates)
            return creation
        return last or creation
    except:
        return None

def parse_sitemap(path: pathlib.Path):
    text = path.read_text(encoding="utf-8")
    # find all <url> blocks
    pattern = re.compile(r"<url>\s*<loc>(.*?)</loc>\s*<lastmod>(.*?)</lastmod>", re.S)
    return text, pattern

def dry_run():
    print("=== DRY RUN: Kya badlega (aaj ka commit) ===\n")
    changed_total = 0
    for sm in SITEMAPS:
        p = ROOT / sm
        if not p.exists():
            continue
        text, pat = parse_sitemap(p)
        print(f"\n-- {sm} --")
        for loc, oldmod in pat.findall(text):
            real = git_lastmod_for_url(loc)
            if not real:
                print(f"  SKIP {loc} -> no file")
                continue
            # normalize: if real > today, clamp to today (future date spam)
            status = "OK" if real == oldmod else "FIX"
            if status == "FIX":
                changed_total += 1
            print(f"  {status:3} {loc.split('/')[-1][:45]:45} {oldmod} -> {real}")
    print(f"\nTotal changes needed: {changed_total}")
    if changed_total == 0:
        print("Sab sahi hai!")
    else:
        print(f"\nRun: python3 fix_lastmod.py --apply  # {changed_total} lastmod sahi honge")
    return changed_total

def apply():
    total = 0
    for sm in SITEMAPS:
        p = ROOT / sm
        if not p.exists():
            continue
        text = p.read_text(encoding="utf-8")
        def repl(m):
            loc = m.group(1)
            oldmod = m.group(2)
            real = git_lastmod_for_url(loc)
            if not real:
                return m.group(0)
            nonlocal_total = real != oldmod
            if nonlocal_total:
                nonlocal total
                total += 1
            return f"<url>\n    <loc>{loc}</loc>\n    <lastmod>{real}</lastmod>"
        # need mutable total
        import re as re2
        new_text = re2.sub(r"<url>\s*<loc>(.*?)</loc>\s*<lastmod>(.*?)</lastmod>", lambda m: f"<url>\n    <loc>{m.group(1)}</loc>\n    <lastmod>{git_lastmod_for_url(m.group(1)) or m.group(2)}</lastmod>", text, flags=re.S)
        # count changes
        if new_text != text:
            p.write_text(new_text, encoding="utf-8")
            print(f"Updated {sm}")
        else:
            print(f"No change {sm}")
    print(f"\nDone. Total lastmod fixed: check git diff")
    # verify
    dry_run()

if __name__ == "__main__":
    if "--apply" in sys.argv:
        apply()
    elif "--verify" in sys.argv:
        dry_run()
        # extra: check uniq
        for sm in SITEMAPS:
            p = ROOT / sm
            if p.exists():
                mods = re.findall(r"<lastmod>(.*?)</lastmod>", p.read_text())
                uniq = sorted(set(mods))
                print(f"{sm}: {len(mods)} urls, {len(uniq)} unique dates -> {uniq[:5]}")
    else:
        dry_run()
