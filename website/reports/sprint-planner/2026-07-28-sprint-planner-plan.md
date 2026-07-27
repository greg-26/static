# Sprint planner plan — 2026-07-28 issue-driven website tranche

Date: 2026-07-28
Scope: Ohana static website planning for current open working-fork issues on `origin` / `greg-26/static`.

## Inputs inspected

- `README.md`, `AGENTS.md`, `agents/sprint-planner.md`
- `VISION.md`, `DESIGN_GUIDELINES.md`, `CODING_STANDARDS.md`, `VISION_EXECUTION.md`
- `docs/working-style.md`, `sprints/INDEX.md`, and latest planner/PMT reports linked from `docs/vision-execution/review-index.md`
- Current website code around `MovieModal.vue`, `FromYourLists.vue`, `HeroSection.vue`, `FilterMenu.vue`, `SearchView.vue`, `ListView.vue`, router, list/recent helpers, and API normalization
- Open GitHub issues #18–#24 on `greg-26/static`
- `git status --short`, branch/remotes, and fast-forward pull from `origin/main`

## Archive action

Completed active-root Sprint 018–022 files were moved into `website/sprints/archive/` without rewriting their historical contents. The new active work is isolated in a fresh dated sprint-set folder:

- `website/sprints/2026-07-28-issue-driven-polish/`

## Issue map

| Issue | Sprint coverage | Planning decision |
| --- | --- | --- |
| [#18 — Website - movie details](https://github.com/greg-26/static/issues/18) | Sprint 024 | Plan as detail media-surface polish after the top action/poster sprint settles. |
| [#19 — Website - movie details](https://github.com/greg-26/static/issues/19) | Sprint 023 | Pair with poster inspection because both affect the top movie-detail decision area. |
| [#20 — Movie poster tweak](https://github.com/greg-26/static/issues/20) | Sprint 023 | Add a contained larger-poster affordance instead of permanently enlarging the default poster. |
| [#21 — Watchlist skeleton](https://github.com/greg-26/static/issues/21) | Sprint 025 | Combine with chip-menu coordination as a Discover first-screen stability sprint. |
| [#22 — Website - discover - chips Menu](https://github.com/greg-26/static/issues/22) | Sprint 025 | Coordinate menu open/close state across Discover list/provider/maturity/genre menus. |
| [#23 — Website - my lists page](https://github.com/greg-26/static/issues/23) | Sprint 026 | Interpret the body as lists-menu previews; no new primary Lists tab. |
| [#24 — Website - search - recents](https://github.com/greg-26/static/issues/24) | Sprint 027 | Keep as a small Search visual polish sprint. |

All currently open website-scoped issues in the working fork are covered by planned sprints. No open website issue remains intentionally unplanned.

## Roadmap changes

- Created the new active sprint folder `sprints/2026-07-28-issue-driven-polish/`.
- Added folder-level sprint index and Sprint 023–027 files.
- Replaced the root `sprints/INDEX.md` no-active-work state with the new issue-driven roadmap and issue map.
- Archived completed Sprint 018–022 files from the active root.
- Updated `docs/vision-execution/review-index.md` with this report link.

## Next executable sprint

Sprint 023 — Movie-detail actions and poster inspection.

Why first: it addresses the highest-intent detail actions (#19/#20) and should stabilize the detail header/action area before Sprint 024 changes adjacent media surfaces.

## Planner notes

- Do not let Sprint 024 become a hidden API sprint. If collection/season items lack internal ids, record the blocker instead of inventing brittle matching.
- Do not block all Discover recommendations for issue #21 unless source evidence proves the whole page must wait. Reserve/skeleton the unstable list row first.
- Do not create a primary Lists tab for #23. Lists remain supportive of discovery under the current IA.
