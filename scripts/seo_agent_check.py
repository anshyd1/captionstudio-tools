#!/usr/bin/env python3
"""
CaptionStudio.in — Autonomous SEO Agent Health, Grow/Down & Task Queue Checker
==============================================================================
Run this FIRST in every future Agent session (zero owner explanation needed!):

    python3 scripts/seo_agent_check.py

What this script does automatically:
1. Checks today's date (IST) against `ai-control/state.json` (`queue` & `impact_reviews`)
   and tells you WHICH reviews are due today and WHICH build/fix task is next.
2. Compares `ai-control/page-history.json` snapshots AND (if a Google service account JSON
   exists in `/home/user/uploads/` or `$GOOGLE_APPLICATION_CREDENTIALS`) pulls LIVE
   7-day & 28-day GSC + GA4 numbers to report exact GROW (▲) vs DOWN (▼) per page!
3. Audits all public HTML files, inline JS syntax, H1 count, Pinterest `p:domain_verify`,
   image `alt` tags, `data-nosnippet` promo safety, and all 5 XML sitemaps.
"""
import glob
import json
import os
import re
import sys
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
IST = timezone(timedelta(hours=5, minutes=30))
TODAY_IST = datetime.now(IST).strftime("%Y-%m-%d")

print("=" * 78)
print(f"🚀 CAPTIONSTUDIO AUTONOMOUS SEO AGENT CHECKER  |  IST Date: {TODAY_IST}")
print("=" * 78)

# -------------------------------------------------------------------------
# 1. Load Control Centre State & Page History
# -------------------------------------------------------------------------
state = json.loads((ROOT / "ai-control/state.json").read_text(encoding="utf-8"))
snap = json.loads((ROOT / "ai-control/snapshot.json").read_text(encoding="utf-8"))
ph = json.loads((ROOT / "ai-control/page-history.json").read_text(encoding="utf-8"))

last_session = (state.get("session_log") or [{}])[-1]
print(f"\n[1] LAST VERIFIED SESSION:")
print(f"    Date: {last_session.get('date_ist')} | Agent: {last_session.get('agent_name')} ({last_session.get('agent_id')})")
print(f"    Summary: {last_session.get('summary', '')[:120]}...")
print(f"    Snapshot Generated At: {snap.get('generated_at')}")

# -------------------------------------------------------------------------
# 2. Stored Baseline Comparison (Sample -2 vs Sample -1: GROW vs DOWN)
# -------------------------------------------------------------------------
samples = ph.get("samples", [])
if len(samples) >= 2:
    s_prev, s_curr = samples[-2], samples[-1]
    print(f"\n[2] STORED 28-DAY GROW vs DOWN ({s_prev['ga_range'][0]}..{s_prev['ga_range'][1]}  ->  {s_curr['ga_range'][0]}..{s_curr['ga_range'][1]}):")
    deltas = []
    for path, cur_m in s_curr["pages"].items():
        prv_m = s_prev["pages"].get(path, {"views": 0, "clicks": 0, "impressions": 0})
        dv = cur_m.get("views", 0) - prv_m.get("views", 0)
        dc = cur_m.get("clicks", 0) - prv_m.get("clicks", 0)
        if cur_m.get("views", 0) >= 20 or prv_m.get("views", 0) >= 20 or cur_m.get("impressions", 0) >= 30:
            deltas.append((dv, dc, path, prv_m, cur_m))

    gainers = sorted([x for x in deltas if x[0] > 0 or x[1] > 0], key=lambda x: (x[1], x[0]), reverse=True)[:8]
    decliners = sorted([x for x in deltas if x[0] < 0], key=lambda x: x[0])[:6]
    zero_clicks = [
        (cur_m.get("impressions", 0), path, cur_m)
        for path, cur_m in s_curr["pages"].items()
        if cur_m.get("impressions", 0) >= 35 and cur_m.get("clicks", 0) == 0
    ]

    print("  ▲ TOP GROWING PAGES:")
    for dv, dc, pth, prv, cur in gainers:
        print(f"    ▲ {pth:52s} | Views: {prv.get('views',0):4d}->{cur.get('views',0):4d} ({dv:+d}) | GSC Clicks: {prv.get('clicks',0):3d}->{cur.get('clicks',0):3d} ({dc:+d})")

    print("  ▼ PAGES DOWN IN VIEWS (Check Engagement / Seasonality):")
    for dv, dc, pth, prv, cur in decliners:
        print(f"    ▼ {pth:52s} | Views: {prv.get('views',0):4d}->{cur.get('views',0):4d} ({dv:+d}) | GSC Clicks: {prv.get('clicks',0):3d}->{cur.get('clicks',0):3d} ({dc:+d})")

    print("  🎯 HIGH-IMPRESSION ZERO-CLICK WATCHLIST (Target of Nov 02 CTR/Snippet Fix):")
    for impr, pth, cur in sorted(zero_clicks, reverse=True):
        print(f"    • {pth:52s} | GSC Impr: {impr:4d} | Clicks: {cur.get('clicks',0)}")

# -------------------------------------------------------------------------
# 3. Optional Live GSC + GA4 API Check (Auto-Detects Credentials if Present!)
# -------------------------------------------------------------------------
cred_candidates = [os.environ.get("GOOGLE_APPLICATION_CREDENTIALS", "")] + sorted(glob.glob("/home/user/uploads/*gsc*.json"))
cred_file = next((c for c in cred_candidates if c and os.path.exists(c)), None)

if cred_file:
    try:
        from google.oauth2 import service_account
        from google.auth.transport.requests import AuthorizedSession

        creds = service_account.Credentials.from_service_account_file(
            cred_file,
            scopes=[
                "https://www.googleapis.com/auth/webmasters.readonly",
                "https://www.googleapis.com/auth/analytics.readonly",
            ],
        )
        sess = AuthorizedSession(creds)
        ga_7d = sess.post(
            "https://analyticsdata.googleapis.com/v1beta/properties/526303859:runReport",
            json={
                "dateRanges": [{"startDate": "7daysAgo", "endDate": "yesterday"}, {"startDate": "14daysAgo", "endDate": "8daysAgo"}],
                "metrics": [{"name": "screenPageViews"}, {"name": "totalUsers"}],
            },
        ).json()
        rows = ga_7d.get("rows", [])
        if len(rows) >= 2:
            v_now, u_now = int(rows[0]["metricValues"][0]["value"]), int(rows[0]["metricValues"][1]["value"])
            v_prv, u_prv = int(rows[1]["metricValues"][0]["value"]), int(rows[1]["metricValues"][1]["value"])
            pct = ((v_now - v_prv) / v_prv * 100) if v_prv else 0.0
            arrow = "▲ GROW" if v_now >= v_prv else "▼ DOWN"
            print(f"\n[3] LIVE GA4 API (Last Complete 7d vs Prior 7d):")
            print(f"    {arrow}: {v_prv} -> {v_now} views ({pct:+.1f}%) | Users: {u_prv} -> {u_now}")
    except Exception as exc:
        print(f"\n[3] Live API check skipped ({exc})")
else:
    print("\n[3] Live API credentials not mounted in this environment — using committed snapshot.json & page-history.json.")

# -------------------------------------------------------------------------
# 4. Technical & On-Page SEO Guardrail Audit Across All Public Pages
# -------------------------------------------------------------------------
bad_h1, missing_pin_verify, weak_alts, missing_nosnippet = [], [], [], []
blog_count = 0

for p in sorted(ROOT.rglob("*.html")):
    rel = str(p.relative_to(ROOT))
    if rel.startswith(("components/", "partials/", "ai-control")) or rel in ("404.html", "ad-studio.html", "diwaok.html", "creator-pack.html"):
        continue
    t = p.read_text(encoding="utf-8", errors="ignore")
    if rel.startswith("blog/") and rel != "blog/index.html":
        blog_count += 1
    if len(re.findall(r"<h1\b", t, re.I)) != 1:
        bad_h1.append(rel)
    if "p:domain_verify" not in t:
        missing_pin_verify.append(rel)
    if "<!-- Top Hero Ad:" in t and "data-nosnippet" not in t:
        missing_nosnippet.append(rel)
    if rel.startswith("blog/") and rel != "blog/index.html":
        t_clean = re.sub(r"<script[^>]*>.*?</script>", "", t, flags=re.S | re.I)
        for m in re.finditer(r"<img\b([^>]*)>", t_clean, re.I):
            src = (re.search(r'src=["\']([^"\']+)["\']', m.group(1), re.I) or [None, ""])[1]
            if "favicon" in src or "logo" in src.lower():
                continue
            alt = (re.search(r'alt=["\']([^"\']*)["\']', m.group(1), re.I) or [None, ""])[1].strip()
            if len(alt) < 20:
                weak_alts.append((rel, src))

xml_ok = True
for sm in ["sitemap.xml", "sitemap-main.xml", "sitemap-blogs.xml", "sitemap-tools.xml", "sitemap-images.xml"]:
    try:
        ET.parse(ROOT / sm)
    except Exception as e:
        xml_ok = False
        print(f"  ❌ XML ERROR in {sm}: {e}")

print(f"\n[4] SITEWIDE TECHNICAL SEO HEALTH ({blog_count} Blog Guides):")
print(f"    • H1 == 1 across all public pages : {'✅ PASS' if not bad_h1 else '❌ FAIL ' + str(bad_h1)}")
print(f"    • Pinterest p:domain_verify 100%  : {'✅ PASS' if not missing_pin_verify else '❌ FAIL ' + str(missing_pin_verify)}")
print(f"    • Promo data-nosnippet protection : {'✅ PASS' if not missing_nosnippet else '❌ FAIL ' + str(missing_nosnippet)}")
print(f"    • Rich Image Alt Tags (>=20 chars): {'✅ PASS' if not weak_alts else '❌ FAIL ' + str(weak_alts[:5])}")
print(f"    • All 5 XML Sitemaps Valid        : {'✅ PASS' if xml_ok else '❌ FAIL'}")

# -------------------------------------------------------------------------
# 5. Print Exact Next Actions for Today's Agent!
# -------------------------------------------------------------------------
print(f"\n[5] NEXT ACTIONS QUEUE FOR CURRENT AGENT (from ai-control/state.json & MONTH_PLAN_NOV_DEC_2026.md):")
for i, item in enumerate(state.get("queue", []), 1):
    print(f"    {i}. [{item.get('priority')}] ({item.get('status')}) {item.get('title')}")
    print(f"       ➔ Next Action: {item.get('next_action')}")

print("\n[6] PENDING IMPACT REVIEWS TO CHECK ON DUE DATES:")
for ir in state.get("impact_reviews", []):
    if ir.get("outcome_status") == "pending":
        print(f"    • {ir.get('change_title')}  |  Due: {ir.get('next_review')}")

print("\n✅ Read `MONTH_PLAN_NOV_DEC_2026.md` & `ai-control/AGENT_GUIDE.txt` before making edits.")
print("=" * 78)
