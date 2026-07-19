# Sprint index

Focused sprint files live here so agents read only the slice they are working on. This file is the single source of truth for active/next sprint status.

## How to use this folder

1. Use this index to identify the active sprint.
2. Open only that sprint file.
3. Developers may add brief notes to the **next sprint** file when they discover useful follow-up context.
4. Keep implementation evidence in reports or PR/commit notes; link it from the sprint instead of pasting long logs.

## Sprints

| Sprint | Goal | Status | File |
| --- | --- | --- | --- |
| 9 | PM/QA trust, retrieval, accessibility, and phone-touch validation follow-ups. | Active — automated readiness green; real-phone checklist found chip/dropdown fit feedback to fix before closure. | [`sprint-09-trust-retrieval-accessibility.md`](sprint-09-trust-retrieval-accessibility.md) |
| 10 | Next incremental slice chosen from PMT feedback, UX review, QA findings, or human feedback after Sprint 9 validation. | Draft / parking lot. | [`sprint-10-next.md`](sprint-10-next.md) |

## Maintenance rules

- One sprint = one file.
- Keep each sprint under roughly one screen of required context plus links.
- Prefer links to reports, screenshots, code refs, or archived plans over copying detail.
- When PMT drops feedback and PE plans it, update the PMT note with links to the sprint(s) that address each item.
- Human feedback has priority over routine automation.
