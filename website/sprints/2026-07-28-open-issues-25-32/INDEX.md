# 2026-07-28 open issues #25–#32 sprint set

## Status

- Current planning status: ready issue-driven tranche for working-fork website issues #25–#32.
- Current implementation phase: Sprint 028 is complete; Sprints 029–032 are sequenced behind it.
- Next executable sprint: [`Sprint 029 — Movie-detail list actions and scroll`](sprint-029-movie-detail-list-actions-and-scroll.md).
- Latest planning revision date: 2026-07-28.

## Roadmap

| Sprint | Outcome | Status | Depends on |
| --- | --- | --- | --- |
| 028 | Search recents border/radius artifact fixed. | `complete` | Sprint 027 complete |
| 029 | Movie-detail list chips and related-title navigation polished. | `ready` | Current modal/list behavior |
| 030 | Movie-detail cast, collection, and season rails polished. | `ready` | Sprint 024 complete |
| 031 | Settings → Lists actions become compact and top-accessible. | `ready` | Current list persistence |
| 032 | Mobile first-paint responsive drift fixed or precisely blocked. | `ready` | Current app shell/CSS behavior |

## Issue mapping

| Issue | Sprint coverage |
| --- | --- |
| [#25](https://github.com/greg-26/static/issues/25) | Sprint 030 |
| [#26](https://github.com/greg-26/static/issues/26) | Sprint 032 |
| [#27](https://github.com/greg-26/static/issues/27) | Sprint 029 |
| [#28](https://github.com/greg-26/static/issues/28) | Sprint 029 |
| [#29](https://github.com/greg-26/static/issues/29) | Sprint 031 |
| [#30](https://github.com/greg-26/static/issues/30) | Sprint 031 |
| [#31](https://github.com/greg-26/static/issues/31) | Sprint 028 |
| [#32](https://github.com/greg-26/static/issues/32) | Sprint 030 |

## Decisions and assumptions

- Keep this tranche UI/CX-only unless implementation discovers an unavoidable data-shape blocker.
- Do not change profile/list persistence, KV merge behavior, or static-hosting fallback.
- Mobile verification matters for every sprint in this set.

## Open questions

- Collection ordering data may be incomplete; fallback to year ascending rather than inventing brittle franchise ordering.
- Mobile drift may require throttled browser evidence before a safe fix is obvious.

## Completion criteria

This sprint set is complete when all mapped issues have implementation evidence comments and are either closed by the implementation workflow or explicitly left open with a recorded blocker.

## Implementation log

- 2026-07-28: Sprint 028 completed. Search recently-viewed cards no longer inherit the broad pill-button border/radius styling; `npm run build`, `git diff --check`, and Vite `/search` reachability passed. Issue #31 pending evidence comment/closure from implementation workflow.
