# Sprint index

Focused active sprint plans live in dated sprint-set folders under this directory. Completed or superseded sprint history lives under [`archive/`](archive/) so implementation agents do not mistake old plans for the next executable work.

## Status

- Current planning status: new issue-driven website tranche for open working-fork issues #25–#32 is planned in [`2026-07-28-open-issues-25-32/`](2026-07-28-open-issues-25-32/).
- Current implementation phase: Sprints 023–030 are complete; Sprints 031–032 remain in the active tranche.
- Next executable sprint: [`Sprint 031 — Settings lists actions`](2026-07-28-open-issues-25-32/sprint-031-settings-lists-actions.md).
- Latest planning update: 2026-07-28.

## Roadmap

| Sprint | Outcome | Status | Depends on |
| --- | --- | --- | --- |
| 028 | Search recent-search suggestions and recent-viewed surfaces lose the remaining off-radius/border artifact. | `complete` | Sprint 027 complete |
| 029 | Movie-detail list chips look persistent, include a manage-lists escape hatch, and related-title navigation resets modal scroll sanely. | `complete` | Current modal list actions and router behavior |
| 030 | Movie-detail cast, collection, and season rails are sorted, correctly proportioned, uncluttered, and mobile-readable. | `complete` | Sprint 024 media surfaces complete |
| 031 | Settings → Lists keeps create/import actions handy while moving row management behind a compact overflow menu. | `ready` | Current profile/list persistence unchanged |
| 032 | Mobile first paint does not flash the desktop layout or visibly drift before responsive styles settle. | `ready` | Current app shell/static CSS behavior |

## Active sprint set

- Sprint-set index: [`2026-07-28-open-issues-25-32/INDEX.md`](2026-07-28-open-issues-25-32/INDEX.md)
- Sprint 028: [`2026-07-28-open-issues-25-32/sprint-028-search-recents-border-radius.md`](2026-07-28-open-issues-25-32/sprint-028-search-recents-border-radius.md)
- Sprint 029: [`2026-07-28-open-issues-25-32/sprint-029-movie-detail-list-actions-and-scroll.md`](2026-07-28-open-issues-25-32/sprint-029-movie-detail-list-actions-and-scroll.md)
- Sprint 030: [`2026-07-28-open-issues-25-32/sprint-030-movie-detail-media-rails.md`](2026-07-28-open-issues-25-32/sprint-030-movie-detail-media-rails.md)
- Sprint 031: [`2026-07-28-open-issues-25-32/sprint-031-settings-lists-actions.md`](2026-07-28-open-issues-25-32/sprint-031-settings-lists-actions.md)
- Sprint 032: [`2026-07-28-open-issues-25-32/sprint-032-mobile-first-paint-stability.md`](2026-07-28-open-issues-25-32/sprint-032-mobile-first-paint-stability.md)
- Archived completed sprint set: [`archive/2026-07-28-issue-driven-polish/`](archive/2026-07-28-issue-driven-polish/)

## Issue mapping

| Issue | Sprint coverage | Planning note |
| --- | --- | --- |
| [#25 — Website - movie details - cast](https://github.com/greg-26/static/issues/25) | Sprint 030 | Covers larger cast images and centered readable names in the horizontal cast rail. |
| [#26 — Website - mobile page drift](https://github.com/greg-26/static/issues/26) | Sprint 032 | Covers initial responsive layout/first-paint drift on slow mobile connections. |
| [#27 — Website - movie details - minir enhancements](https://github.com/greg-26/static/issues/27) | Sprint 029 | Covers smaller-radius persistent list chips and scroll reset after collection/related-title navigation. |
| [#28 — Website - movie details - ljnk to lists](https://github.com/greg-26/static/issues/28) | Sprint 029 | Covers a Manage lists link/action at the end of movie-detail list chips. |
| [#29 — Website - settings - lists - add/import handy](https://github.com/greg-26/static/issues/29) | Sprint 031 | Covers top-of-page create/import actions that expand only after selection. |
| [#30 — Website / settings / lists / enchancements](https://github.com/greg-26/static/issues/30) | Sprint 031 | Covers compact list rows, no “Saved list” label, row-click-to-open, and overflow menu actions. |
| [#31 — Website - search - recents - border radius fix](https://github.com/greg-26/static/issues/31) | Sprint 028 | Covers the remaining recent-search border/radius artifact after Sprint 027. |
| [#32 — Website / movie details / collections & seasons](https://github.com/greg-26/static/issues/32) | Sprint 030 | Covers season/collection sorting, removing season descriptions, and poster aspect/proportion fixes. |

All currently open website-scoped issues in the working fork are planned. No relevant open website issue is intentionally unplanned.

## Decisions and assumptions

- Working-fork issues (`origin`, currently `greg-26/static`) remain the active issue tracker for agent-driven website work.
- This is a brand-new sprint-set folder; the completed #18–#24 sprint set was moved under `sprints/archive/` without rewriting its historical evidence.
- Sprint numbers continue from the existing sequence and are not renumbered.
- Issue #31 is first because it is a small visible regression/follow-up to completed Sprint 027 and should be cleared before larger detail/settings work.
- Issue #26 is planned as a constrained responsive first-paint sprint, not a broad redesign; it should produce evidence or a clear blocker if the drift cannot be reproduced locally.
- Collection order should prefer explicit API/TMDB ordering when already available; otherwise fall back to year ascending, as Alex requested.

## Open questions

- Does the API expose collection order beyond year for all relevant collections? Recommended default: use explicit order only when available, then year ascending.
- For Settings list overflow menus, should destructive Remove require confirmation? Recommended default: preserve current behavior unless implementation already has a lightweight confirm primitive; do not add modal complexity in this sprint.
- For mobile drift, which route is worst on slow connection? Recommended default: verify app shell, Discover, Search, and Settings at mobile width with throttling; fix the first reproducible global cause.

## Completion criteria

The current planned tranche is complete when:

- Issue #31 is visually repaired without changing recent-search storage semantics, source/build verified, commented, and closed by implementation workflow. ✅ Sprint 028 complete; real-device visual review still welcome.
- Issues #27 and #28 are implemented in the movie-detail modal without changing list persistence semantics. ✅ Sprint 029 complete; real-device visual review still welcome.
- Issues #25 and #32 are implemented with sorted media rails, correct poster aspect ratios, and mobile-readable cast names. ✅ Sprint 030 complete; real-device visual review still welcome.
- Issues #29 and #30 are implemented in Settings → Lists with row click-to-open and compact overflow management.
- Issue #26 is either fixed with mobile/throttled evidence or left open with a precise blocker/repro note.
- Each implementation sprint runs its listed verification commands and keeps the app reviewable over the existing Vite/Tailscale path when UI changes are made.

## Maintenance rules

- One sprint = one file inside the active dated folder.
- Keep `VISION_EXECUTION.md` as a router; do not duplicate sprint status there.
- Link reports from `docs/vision-execution/review-index.md` instead of copying report contents into sprint files.
- Human feedback and new issues interrupt routine automation.
