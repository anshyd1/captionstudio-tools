#!/usr/bin/env python3
"""
CaptionStudio.in — IndexNow submitter.

Pings Bing, Yandex, Seznam, Naver (and any other IndexNow participant) the moment
a page changes, instead of waiting for a crawl. DuckDuckGo and Yahoo are powered
by Bing's index, so a single IndexNow ping reaches all three.

Why this matters here: GA4 shows 23% of August sessions came from
Bing / DuckDuckGo / Yahoo, and those visitors engage ~60% vs Google's 37%.
/blog/best-instagram-bio-copy-paste-2026 gets ~800 sessions/month almost
entirely from Bing+DDG+Yahoo while earning near-zero Google clicks.

Setup (one time):
  1. Key file must be live at:
       https://captionstudio.in/c82fcfee1383da60f0834e180dafadd5.txt
     (it is committed at the repo root — Vercel serves it as-is)
  2. Verify it returns the key as plain text:
       curl https://captionstudio.in/c82fcfee1383da60f0834e180dafadd5.txt

Usage:
    python3 indexnow.py --check              # verify key file is reachable
    python3 indexnow.py --changed            # submit files changed in last commit
    python3 indexnow.py --all                # submit every live URL (use sparingly)
    python3 indexnow.py --urls /blog/a /blog/b
    python3 indexnow.py --all --dry-run

Notes:
  * IndexNow accepts up to 10,000 URLs per request. We batch at 100 to stay polite.
  * A 200 or 202 response means accepted. 422 usually means key/host mismatch.
  * Do not spam --all. Use --changed in normal operation.
"""

import argparse
import json
import os
import subprocess
import sys
import urllib.request
import urllib.error

HOST = "captionstudio.in"
KEY = "c82fcfee1383da60f0834e180dafadd5"
KEY_LOCATION = f"https://{HOST}/{KEY}.txt"
ENDPOINT = "https://api.indexnow.org/IndexNow"
BATCH = 100

# Pages that exist for policy/legal reasons and never need re-indexing pings.
SKIP = {"/404", "/privacy", "/terms", "/disclaimer", "/support"}


def repo_root() -> str:
    return os.path.dirname(os.path.abspath(__file__))


def path_to_url(rel: str) -> str | None:
    """Map a repo-relative .html path to its live clean URL."""
    if not rel.endswith(".html"):
        return None
    stem = rel[:-5]
    if stem == "index":
        return f"https://{HOST}/"
    if stem == "blog/index":
        return f"https://{HOST}/blog"
    if stem == "tools/index":
        return f"https://{HOST}/tools"
    route = "/" + stem
    if route in SKIP:
        return None
    return f"https://{HOST}{route}"


def all_urls() -> list[str]:
    root = repo_root()
    out = []
    for sub in (".", "blog", "tools"):
        d = os.path.join(root, sub)
        if not os.path.isdir(d):
            continue
        for f in sorted(os.listdir(d)):
            rel = f if sub == "." else f"{sub}/{f}"
            u = path_to_url(rel)
            if u:
                out.append(u)
    return sorted(set(out))


def changed_urls(ref: str = "HEAD~1") -> list[str]:
    try:
        raw = subprocess.check_output(
            ["git", "diff", "--name-only", ref, "HEAD"],
            cwd=repo_root(), text=True, stderr=subprocess.DEVNULL,
        )
    except subprocess.CalledProcessError:
        print("git diff failed — is this a git repo with at least 2 commits?")
        return []
    out = []
    for line in raw.splitlines():
        u = path_to_url(line.strip())
        if u:
            out.append(u)
    return sorted(set(out))


def check_key() -> bool:
    print(f"Checking {KEY_LOCATION} ...")
    # Cloudflare fronts this domain and 403s the default urllib user-agent,
    # so send a normal browser UA. IndexNow's own fetcher is unaffected.
    req = urllib.request.Request(
        KEY_LOCATION,
        headers={"User-Agent": "Mozilla/5.0 (compatible; CaptionStudio-IndexNow/1.0)"},
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            body = r.read().decode().strip()
            ok = (r.status == 200 and body == KEY)
            print(f"  HTTP {r.status} | body={body!r}")
            print("  OK — IndexNow can verify ownership" if ok
                  else "  MISMATCH — file must contain exactly the key, nothing else")
            return ok
    except urllib.error.HTTPError as e:
        print(f"  HTTP {e.code} — key file not reachable. Deploy it first.")
    except Exception as e:
        print(f"  {type(e).__name__}: {e}")
    return False


def submit(urls: list[str], dry: bool = False) -> None:
    if not urls:
        print("nothing to submit")
        return
    print(f"{len(urls)} URL(s) to submit")
    for i in range(0, len(urls), BATCH):
        chunk = urls[i:i + BATCH]
        payload = {
            "host": HOST,
            "key": KEY,
            "keyLocation": KEY_LOCATION,
            "urlList": chunk,
        }
        print(f"\nbatch {i // BATCH + 1}: {len(chunk)} URLs")
        for u in chunk[:5]:
            print(f"    {u}")
        if len(chunk) > 5:
            print(f"    ... and {len(chunk) - 5} more")
        if dry:
            print("  [dry-run] not sent")
            continue
        data = json.dumps(payload).encode()
        req = urllib.request.Request(
            ENDPOINT, data=data,
            headers={"Content-Type": "application/json; charset=utf-8"},
        )
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                print(f"  HTTP {r.status} — {'accepted' if r.status in (200, 202) else 'see response'}")
        except urllib.error.HTTPError as e:
            body = e.read().decode()[:200]
            hint = ""
            if e.code == 422:
                hint = "  (422 = key or host mismatch; run --check)"
            elif e.code == 429:
                hint = "  (429 = too many requests; slow down)"
            print(f"  HTTP {e.code}{hint}\n  {body}")
        except Exception as e:
            print(f"  {type(e).__name__}: {e}")


def main() -> None:
    ap = argparse.ArgumentParser(description="Submit URLs to IndexNow (Bing/Yandex/etc)")
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--check", action="store_true", help="verify the key file is live")
    g.add_argument("--all", action="store_true", help="submit every live URL")
    g.add_argument("--changed", action="store_true", help="submit URLs changed in last commit")
    g.add_argument("--urls", nargs="+", metavar="PATH", help="submit specific routes")
    ap.add_argument("--ref", default="HEAD~1", help="git ref to diff against (with --changed)")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()

    if a.check:
        sys.exit(0 if check_key() else 1)

    if a.all:
        urls = all_urls()
    elif a.changed:
        urls = changed_urls(a.ref)
    else:
        urls = [u if u.startswith("http") else f"https://{HOST}{u if u.startswith('/') else '/' + u}"
                for u in a.urls]

    submit(urls, dry=a.dry_run)


if __name__ == "__main__":
    main()
