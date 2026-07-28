# Sprint index

Focused active sprint plans live in dated sprint-set folders under this directory. Completed or superseded sprint history lives under [`archive/`](archive/) so implementation agents do not mistake old plans for the next executable work.

## Status

- Current planning status: new issue-driven website tranche for open working-fork issues #18–#24 is planned in [`2026-07-28-issue-driven-polish/`](2026-07-28-issue-driven-polish/).
- Current implementation phase: Sprints 018–025 are complete; Sprint 026 is the next ready implementation slice.
- Next executable sprint: Sprint 026 — List menu previews.
- Latest planning update: 2026-07-28.

## Roadmap

| Sprint | Outcome | Status | Depends on |
| --- | --- | --- | --- |
| 023 | Move list actions into the first movie-detail decision area and add a mobile-safe way to inspect the poster larger. | `complete` | Current movie-detail modal/list persistence remains stable |
| 024 | Polish movie-detail media surfaces: sharp/blended backdrop, tighter internal collection/season cards, and one-row circular cast. | `complete` | Sprint 023 complete |
| 025 | Stabilize Discover loading and menus so list rows do not cause layout drift and only one chip menu can be open at a time. | `complete` | Existing Discover list/menu components retained |
| 026 | Add compact list-preview posters to the lists menu without turning lists into a primary navigation tab. | `ready` | Sprint 025 complete |
| 027 | Remove the ugly rounded-container treatment from Search recents while preserving scannable recent searches/viewed titles. | `ready` | Current Search recent-activity storage remains unchanged |

## Active sprint set

- Sprint-set index: [`2026-07-28-issue-driven-polish/INDEX.md`](2026-07-28-issue-driven-polish/INDEX.md)
- Sprint 023: [`2026-07-28-issue-driven-polish/sprint-023-movie-detail-actions-and-poster.md`](2026-07-28-issue-driven-polish/sprint-023-movie-detail-actions-and-poster.md)
- Sprint 024: [`2026-07-28-issue-driven-polish/sprint-024-movie-detail-media-surfaces.md`](2026-07-28-issue-driven-polish/sprint-024-movie-detail-media-surfaces.md)
- Sprint 025: [`2026-07-28-issue-driven-polish/sprint-025-discover-loading-and-menu-stability.md`](2026-07-28-issue-driven-polish/sprint-025-discover-loading-and-menu-stability.md)
- Sprint 026: [`2026-07-28-issue-driven-polish/sprint-026-list-menu-previews.md`](2026-07-28-issue-driven-polish/sprint-026-list-menu-previews.md)
- Sprint 027: [`2026-07-28-issue-driven-polish/sprint-027-search-recents-container-polish.md`](2026-07-28-issue-driven-polish/sprint-027-search-recents-container-polish.md)
- Archived completed sprints: [`archive/`](archive/)

## Issue mapping

| Issue | Sprint coverage | Planning note |
| --- | --- | --- |
| [#18 — Website - movie details](https://github.com/greg-26/static/issues/18) | Sprint 024 | Implemented: backdrop blend, internal collection/season navigation/spacing, horizontal circular cast. |
| [#19 — Website - movie details](https://github.com/greg-26/static/issues/19) | Sprint 023 | Covers moving the watchlist/list widget into the top detail decision area. |
| [#20 — Movie poster tweak](https://github.com/greg-26/static/issues/20) | Sprint 023 | Covers a full-screen/larger poster inspection affordance without expanding the default modal. |
| [#21 — Watchlist skeleton](https://github.com/greg-26/static/issues/21) | Sprint 025 | Covers Discover load skeleton/hold state for list rows/results to prevent layout shift. |
| [#22 — Website - discover - chips Menu](https://github.com/greg-26/static/issues/22) | Sprint 025 | Covers shared menu coordination so opening/leaving one menu closes others. |
| [#23 — Website - my lists page](https://github.com/greg-26/static/issues/23) | Sprint 026 | Covers small poster previews in the lists menu/list chooser. |
| [#24 — Website - search - recents](https://github.com/greg-26/static/issues/24) | Sprint 027 | Covers Search recents container radius/blending polish. |

All currently open website-scoped issues in the working fork are planned. No relevant open website issue is intentionally unplanned.

## Decisions and assumptions

- Working-fork issues (`origin`, currently `greg-26/static`) remain the active issue tracker for agent-driven website work.
- The July 28 tranche uses a dated folder because the active-root files from the previous tranche were all complete; this keeps the next sprint set visually separate without renumbering history.
- Sprint numbers continue from the existing sequence. Completed Sprint 018–022 files were moved to `archive/` without rewriting their completion evidence.
- Issue #23 title says “my lists page,” but the body asks for posters “on the lists menu”; the planned default is the existing Discover lists chooser/menu, with no new primary Lists tab.
- Poster enlargement in Sprint 023 should be an overlay/lightbox or equivalent contained affordance, not a permanent bigger poster that breaks compact detail layout.
- Collection/season links in Sprint 024 should open Ohana’s own details route/modal when the item can be resolved locally; external fallbacks should be explicit and secondary.

## Open questions

- For issue #20, should the enlarged poster be pinch/zoom capable? Recommended default: simple full-screen overlay first; add pinch/zoom only if mobile review shows it is needed.
- For issue #21, should Discover hide all results until list membership finishes loading, or only reserve skeleton space for the From-your-lists row? Recommended default: reserve skeleton space and avoid blocking unrelated recommendation rows longer than necessary.
- For issue #23, how many preview posters should each list show? Recommended default: three mini posters on mobile, four only if space allows without wrapping.

## Completion criteria

The current planned tranche is complete when:

- Issue #19 is implemented, source/build verified, commented, and closed by the implementation workflow with mobile review caveat.
- Issue #20 is implemented with a keyboard/touch-accessible larger-poster affordance, source/build verified, commented, and closed by the implementation workflow with mobile review caveat.
- Issue #18 is implemented without regressing Sprint 017–021 movie-detail behavior and closed with evidence.
- Issue #21 is implemented with source/build verification and a mobile-width load-state check. ✅ Sprint 025 complete; real-device visual review still recommended.
- Issue #22 is implemented with menu interaction verification for Discover/list/provider/maturity/genre controls. ✅ Sprint 025 complete; real-device visual review still recommended.
- Issue #23 is implemented with compact list-preview posters in the lists chooser/menu and no new primary Lists tab.
- Issue #24 is implemented with Search recents visual polish and no change to recent-search storage semantics.
- Each implementation sprint runs its listed verification commands and keeps the app reviewable over the existing Vite/Tailscale path when UI changes are made.

## Maintenance rules

- One sprint = one file inside the active dated folder.
- Keep `VISION_EXECUTION.md` as a router; do not duplicate sprint status there.
- Link reports from `docs/vision-execution/review-index.md` instead of copying report contents into sprint files.
- Human feedback and new issues interrupt routine automation.
