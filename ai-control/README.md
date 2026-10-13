# CaptionStudio Control Centre

Public, model-agnostic, **on-open** agent handoff + owner dashboard. **Not** an autonomous scheduler or a live GA4/GSC connector.

## Routes

| URL | Source | Purpose |
|---|---|---|
| `/ai-control` | `../ai-control.html` | Overview and engagement watch |
| `/ai-control/pages` | `pages.html` | Tracked pages and comparable trend history |
| `/ai-control/search` | `search.html` | Queries/traffic channels |
| `/ai-control/plan` | `plan.html` | Bounded, evidence-backed tasks |
| `/ai-control/worklog` | `worklog.html` | Verified attendance and handoff history |
| `/ai-control/checker` | `checker.html` | Same-origin page/topic checks |
| `/ai-control/agent` | `agent.html` | Link to give an AI agent |

The agent can fetch `/ai-control/AGENT_GUIDE.txt` without JS, then read `snapshot.json`, `state.json`, and `page-history.json` (all public). The HTML contains an `agent-guide` meta tag and static fallback links. `app.js` renders the dashboards client-side. `vercel.json` maps the clean URLs.

## Data / update contract

- `snapshot.json`: GA4/GSC results with `generated_at` and separate `data.ga_daily` and `data.gsc_daily` coverage. It is a dated snapshot. Do not append invented data or backfill GSC missing days as zero.
- `page-history.json`: `samples[]` with collection time, separate GA/GSC ranges, and `pages[path]` metrics. The initial record is **one baseline only**. A per-page rise/fall is displayed only after at least two samples with equal GA date-window lengths.
- `state.json`: bounded policy, persistent queue, verified session log, and data-source metadata. The Work Log counts unique IST dates with `status=verified` only. Older unsourced notes in `snapshot.json` appear separately and never count as attendance.
- Any agent with GitHub write permission updates these files by commit **after** gathering evidence and tests; public browser visitors cannot write them. Guarded direct pushes are limited to small reversible fixes; risky work requires owner approval. Read the plain-text guide for the full protocol.

## Future private API connection

The owner can supply GA4 property access and verified GSC property access **privately** to an authorised agent or protected backend. Add a refresh script/server job that fetches data and writes the three JSON files atomically, validating schema/coverage and preserving historical samples. Without that integration, the dashboard is snapshot-based and an agent must refresh data as part of its on-open session. No background timer has been configured because the owner chose on-open operation.

Do **not** store GitHub PATs, Google OAuth tokens, service-account JSON or access keys in this public repository, files, work logs, screenshots or browser JavaScript. Never expose a public write endpoint without authentication. Public availability of metrics/work logs is the owner's current choice.

## Test

`python tests/test_ai_control.py` (requires `playwright` and Chromium installed locally). Tests cover seven routes at desktop/mobile, navigation, metrics, no mobile overflow, baseline honesty, worklog, agent guide and page checker.
