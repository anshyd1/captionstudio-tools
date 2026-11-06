# Student article — detailed audit, 6 November 2026

**Page:** https://captionstudio.in/blog/instagram-bio-for-students
**Scope:** this article, its directly linked pages and relevant Search Console status. Not a full-domain audit. The latest fix was pushed as commit 3087941. Production HTTP verification found the restored logo markup and enlarged-image CSS; visual and interaction tests were run locally. No AdSense account or Pinterest account access was available.

## Executive summary
Two visual failures were caused by the previous redesign: the site's real logo was replaced with a star mark; Pinterest artwork was compressed to tiny 64–70 px thumbnails. Both are corrected in this change. The page is online and discoverable in a submitted sitemap, but Search Console currently reports **Discovered – currently not indexed**. There are 500 copyable entries and eight contextual image cards. More text or a bigger count cannot guarantee rankings or approval.

## Findings chart

| Priority | Area | Evidence | Status / action |
|---|---|---|---|
| P0 | Brand header | Student page used a synthetic star instead of the logo. Other site articles use `/favicon.png` as the logo. | **Fixed locally:** original site image restored, explicit dimensions and visible brand text. |
| P0 | Images | All eight Pinterest graphics were reduced to tiny thumbnails, making them hard to read. | **Fixed locally:** show full 2:3 art in a responsive card, without cropping; 390 px test rendered image 352 × 528 px. Desktop test: 225 × 338 px. This intentionally adds page height; check user experience and performance. |
| P0 | Indexing | Read-only URL Inspection API on 6 Nov: **Discovered – currently not indexed**; sitemap-blogs.xml and sitemap.xml were reported. | **Pending Google:** earlier sitemap submission was accepted. No claim that page is indexed or has a manual penalty. Check after Google has time to crawl. Search Console URL Inspection UI can request indexing. |
| P1 | Content substance | 500 entries, 80 visible quick picks and 420 in 21 expandable collections. Many lines share themes. | Exact normalised duplicate check passed; token-overlap heuristic found one possible pair. These checks do not prove semantic originality or quality. Human review should remove repetitive/weak examples rather than expand the count artificially. |
| P1 | Discovery of remaining examples | Visitors can miss that most examples are in expandable collections below the initial 80. | **Fixed locally:** category instructions now explicitly say where the other 420 are. Each collection contains 20. Consider on-page search or filters after usage data, not as a ranking trick. |
| P1 | Interaction & accessibility | 500 button controls; first shared-handler copy interaction tested in local Chromium. Native details/summary used for collapsed sections; alt text exists on all images. | Basic check passed, not a complete keyboard/screen-reader test. Test focus order, clipboard failure fallback, and each category on real mobile browsers. |
| P1 | Ads and AdSense | Student article HTML has no `adsbygoogle.js` script or publisher ID. Other articles and the homepage do have the site's AdSense script; `/ads.txt` responds 200 with one publisher entry. | Ads may not be configured on this page. Script absence is not proof of the account's approval or a rejection. Check AdSense **Sites** status and intended auto-ad configuration before adding code; do not promise approval. |
| P1 | Consent | Page uses Google Consent Mode and the site cookie-consent script; existing defaults grant storage for IN/PK/BD/NP/LK before a visitor acts, while a banner offers accept/decline. | **Needs policy/legal review**, including consistency between defaults, notice, actual GA4/ad behavior and applicable requirements. No blanket assertion of illegality. Do not treat local accept/decline testing alone as certification. |
| P1 | Tracking | Existing `caption_copy` includes page, type and category. Community click helper uses `data-tg-slot`. Pinterest links open a draft with distinct UTMs. | Production GA4 DebugView, event-scoped custom dimension registration and Pinterest publication/attribution have not been verified. A Pinterest draft click is not a published Pin, and Telegram click is not a join. |
| P2 | Metadata | One H1, descriptive title and meta, self-canonical, Open Graph, Article JSON-LD, visible author/about links. | Basic syntax checks passed. Google-selected canonical, rich-result eligibility and actual SERP snippet not verified. FAQPage, BreadcrumbList or Twitter cards are optional, not required to rank; do not add unsupported schemas for their own sake. |
| P2 | Navigation | Homepage, about, contact, privacy, terms, editorial policy and article respond HTTP 200 in a small live sample. | Check full destinations, user experience and all internal links in a separate crawl; status 200 alone does not establish quality. |
| P2 | Performance | The source HTML is around 140 KB; eight images use lazy loading and have dimensions, but full-size artwork increases scrolling and downloaded data. | PageSpeed API returned HTTP 429 (quota); no score, LCP, CLS or Core Web Vitals measurement available. Do not infer performance from file size or a local browser test. |
| P2 | GEO and E-E-A-T | Visible author and editorial policy are present. Some advice was added to reach a requested word count. | Reduce generic/repeated paragraphs; add genuinely useful first-hand examples or corrections, without fabricating experience. No special tag guarantees AI citations or search results. |

## Local verification of latest visual fix
- Chromium at widths 360, 390, 768, 1440: HTTP 200, one H1, no horizontal overflow, no observed JavaScript error, logo loaded, 500 copy buttons and 8 image cards present.
- First collection opens and one copy interaction succeeds at 390 px.
- Pinterest artwork uses `object-fit: contain` with its natural 2:3 ratio. This verifies layout in local Chromium, not a live production device.
- Search Console status is an indexed-data snapshot, not a live crawl. A newer result may differ.

## Next actions
1. Deploy, then verify the live logo and artwork on a real phone and desktop. Review whether the larger images interrupt reading.
2. Recheck Search Console after a reasonable crawl interval and use the normal UI for a request if appropriate. The Indexing API is not for general caption articles.
3. In GA4 DebugView test a copy, category parameter, Telegram click and Pinterest outbound link. Separately record actual Telegram joins and Pinterest outbound clicks.
4. Request the owner's AdSense Sites status or rejection reason, then audit publisher policy, advertising configuration, consent and privacy disclosure against that evidence.
5. Perform an editorial review of all 500 lines, removing meaning overlap and unhelpful guidance. Use finalised Google/Bing queries and traffic before deciding whether to expand or consolidate.
6. Measure PageSpeed/field data when quota is available and run keyboard, screen-reader and full-site internal-link checks.

## Official references
- Google helpful, reliable, people-first content and word count: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google guidance for AI features: https://developers.google.com/search/docs/fundamentals/ai-optimization-guide
- Google Publisher Policies: https://support.google.com/adsense/answer/10502938?hl=en
- Google explanation of common site content and navigation problems: https://support.google.com/adsense/answer/81904?hl=en
