# Student Article Audit & Action Plan — 6 November 2026

Scope: `/blog/instagram-bio-for-students`, its direct navigation and metadata, selected related links, 8 existing Pinterest images. This is not a full-domain technical or AdSense audit.

## What changed
- Expanded the article from roughly 914 to approximately 5,476 visible words (count includes headings, image captions, bios and article copy; excludes scripts, styles, navigation and footer). It contains 80 copyable examples and 40 short practical guidance sections, including privacy, copy troubleshooting, language, accessibility and profile formatting. A long word count does not guarantee rankings.
- Moved 8 Pinterest images out of a single gallery and placed them beside relevant content: short, college, Hinglish, funny, motivational, exams, aesthetic and creative-student sections. Images keep their native portrait ratio; they are lazy-loaded with width and height specified. Pinterest buttons open draft pins; they do not automatically publish.
- Retained topic-specific links to the main bio guide, college captions, Hindi captions, tools, policy and contact. No global sitewide bio-link injection.
- Updated listing's estimated reading time and kept existing title, meta description, canonical, open graph, Article schema, author and sitemap entries. Copy and Pinterest events remain subject to GA4 and consent configuration.

## Checks
| Item | Status | Detail |
|---|---|---|
| Content and count | Pass | 80 copy examples, 8 image figures, about 5,476 visible words using a local HTML text parser. |
| H1 and headings | Pass, basic | One H1; topic and guide headings are present. Not a full semantic/accessibility audit. |
| Canonical and Article schema | Pass, basic | Canonical present and JSON-LD parses. Google rich-result eligibility not tested. |
| In-page links | Pass, static | All fragment targets exist in the HTML. |
| Internal destinations | Pass, local | Linked root-relative pages have local files or directories; production status may differ. |
| Sitemap | Pass, syntax | Blog and image sitemap parse; previously submitted sitemap contained this URL. No new Google crawl is implied. |
| Mobile and desktop | Pass, local Chromium | 360, 390, 768 and 1440 px: no page-level horizontal overflow, one H1, eight image cards, no observed JS errors. Sampled images loaded. This is not a real-device test. |
| Copy | Pass, local | Tested first example using clipboard at 390 px. Other buttons share the same handler. |
| Google indexing | Pending | At earlier URL Inspection the URL was unknown to Google; sitemap submission returned 204. This is not proof of indexing. Recheck later after Google has crawled. |
| GA4 and Pinterest | Pending | Verify real production copy event, category parameter, Pinterest outbound clicks and visits with UTMs. Pinterest pins were not published. |
| Performance / Core Web Vitals | Pending | Lab PageSpeed and field CrUX not measured. Eight portrait images add page weight despite lazy loading; monitor mobile performance. |
| AdSense | Pending | No account review, ad inventory, policy review or approval status was checked in this update. Approval is not guaranteed. |

## Next round
1. Verify deployed production page, images and mobile copy experience; do not assume a GitHub push means deployment succeeded.
2. Recheck Search Console URL Inspection after Google has had time; use the Search Console UI to request indexing if appropriate. Do not use the Google Indexing API for ordinary caption/bio articles.
3. Collect 7–14 days of finalised Google, Bing and GA4 data; check search queries, landing sessions and copy events before claiming improvement.
4. In GA4 DebugView verify `caption_copy`, `copy_type` and `bio_category` under relevant consent; register event-scoped custom dimensions only if reporting requires them. Test Pinterest links and UTM attribution after publishing real Pins.
5. Review all article text for genuinely helpful differentiation, unnecessary repetition and factual accuracy; shorten or restructure sections that don't help users. Five thousand words is a user-requested format, not a Google ranking requirement.
6. Next, run a separate full-domain SEO, navigation and AdSense-readiness audit and prioritise verified issues. Avoid creating unrelated or overlapping bio pages.
