# Sprint index

Focused sprint files live here so agents read only the slice they are working on. This file is the single source of truth for active/next sprint status.

## How to use this folder

1. Use this index to identify the next executable sprint.
2. Open only that sprint file.
3. Developers may add brief notes to the **next sprint** file when they discover useful follow-up context.
4. Keep implementation evidence in reports or PR/commit notes; link it from the sprint instead of pasting long logs.

## Status

- Current planning status: Sprint 9 is implemented but blocked on real-phone validation/PMT decision before closure.
- Current implementation phase: no sprint is executable until Sprint 9 closes or Alex escalates Sprint 10.
- Next executable sprint: none while Sprint 9 is blocked; Sprint 10 is the next proposed sprint.
- Latest planning revision: 2026-07-21.

## Roadmap

| Sprint | Outcome | Status | Depends on |
| --- | --- | --- | --- |
| 9 | PM/QA trust, retrieval, accessibility, and phone-touch validation follow-ups. | `blocked` — automated readiness green; local dropdown/mobile polish needs real-phone validation. No matching issue exists on the working fork, so closure is blocked on validation evidence/PMT decision rather than upstream issue closure. | Earlier redesign implementation slices |
| 10 | Make Where-to-watch country/source context explicit, starting with Spain-only/read-only provider settings and JustWatch attribution unless data proves multi-country support. | `proposed` — triggered by working-fork issues #1 and #2; mark `ready` after Sprint 9 validation unless Alex escalates. | Sprint 9 closure or explicit Alex escalation |

## Sprint files

- Sprint 9: [`sprint-09-trust-retrieval-accessibility.md`](sprint-09-trust-retrieval-accessibility.md)
- Sprint 10: [`sprint-10-next.md`](sprint-10-next.md)

## Decisions and assumptions

- Working-fork issues (`origin`, currently `greg-26/static`) are the active issue tracker for agent-driven work.
- Upstream/original issues are not touched by automation unless Alex explicitly asks.
- Sprint 10 assumes Spain-only provider availability until scraper/data inspection proves multi-country support.

## Open questions

- Sprint 9 closure: real-phone validation or PMT decision is still needed for the local dropdown/mobile polish fix.
- Sprint 10 readiness: default is to wait for Sprint 9 closure; Alex can explicitly escalate it sooner.

## Completion criteria

The current website sprint tranche is complete when:

- Sprint 9 validation evidence is accepted and the sprint is marked `complete`.
- Sprint 10 country/source context is implemented, verified, and any fully satisfied working-fork issues are commented and closed.
- The dev server remains reviewable for Alex over Tailscale after implementation slices.

## Maintenance rules

- One sprint = one file.
- Keep each sprint under roughly one screen of required context plus links.
- Prefer links to reports, screenshots, code refs, or archived plans over copying detail.
- When PMT drops feedback and the sprint planner plans it, update the PMT note with links to the sprint(s) that address each item.
- Human feedback has priority over routine automation.
