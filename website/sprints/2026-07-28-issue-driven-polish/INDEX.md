# 2026-07-28 issue-driven polish sprint set

## Status

- Current planning status: ready issue-driven tranche for working-fork website issues #18–#24.
- Current implementation phase: Sprint 023 complete; Sprint 024 is the next ready implementation slice.
- Next executable sprint: Sprint 024 — movie-detail media surfaces.
- Latest planning revision date: 2026-07-28.

## Roadmap

| Sprint | Outcome | Status | Depends on |
| --- | --- | --- | --- |
| 023 | Movie-detail list actions are reachable immediately, and the poster can be inspected larger on mobile. | `complete` | Existing modal/list persistence |
| 024 | Movie-detail media surfaces feel native to Ohana: blended backdrop, internal collection/season links, compact one-row cast. | `ready` | Sprint 023 complete |
| 025 | Discover avoids load drift and chip menus behave as a single coordinated menu system. | `ready` | Existing Discover list/menu components |
| 026 | Lists menu shows compact poster previews for each list. | `ready` | Sprint 025 menu coordination complete |
| 027 | Search recents lose the ugly rounded container and blend with the poster/results surface. | `ready` | Current recent-activity storage |

## Issue mapping

| Issue | Sprint coverage |
| --- | --- |
| [#18](https://github.com/greg-26/static/issues/18) | Sprint 024 |
| [#19](https://github.com/greg-26/static/issues/19) | Sprint 023 |
| [#20](https://github.com/greg-26/static/issues/20) | Sprint 023 |
| [#21](https://github.com/greg-26/static/issues/21) | Sprint 025 |
| [#22](https://github.com/greg-26/static/issues/22) | Sprint 025 |
| [#23](https://github.com/greg-26/static/issues/23) | Sprint 026 |
| [#24](https://github.com/greg-26/static/issues/24) | Sprint 027 |

## Decisions and assumptions

- Keep these as UI/CX slices; do not change API schemas, KV merge behavior, or static hosting fallback unless a sprint explicitly discovers a blocker.
- Use existing reusable primitives (`FilterMenu`, chips, rows, modal guards) before inventing variants.
- Mobile verification matters for every sprint in this set.

## Open questions

- Poster overlay zoom depth: default to full-screen fit with close/backdrop/escape controls; defer pinch/zoom unless Alex asks after review.
- Discover load behavior: default to reserving/skeletoning unstable list content instead of blocking all recommendation rows.

## Completion criteria

This sprint set is complete when all seven mapped issues have implementation evidence comments and are either closed by the implementation workflow or explicitly left open with a recorded blocker.
