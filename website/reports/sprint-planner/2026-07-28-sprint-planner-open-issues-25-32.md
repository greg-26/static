# Sprint planner plan — 2026-07-28 open issues #25–#32

Date: 2026-07-28
Scope: Ohana static website planning for the next current open working-fork issues on `origin` / `greg-26/static`.

## Inputs inspected

- `README.md`, `AGENTS.md`, `agents/sprint-planner.md`
- `VISION.md`, `DESIGN_GUIDELINES.md`, `CODING_STANDARDS.md`, `VISION_EXECUTION.md`
- `docs/working-style.md`, `sprints/INDEX.md`, and latest reports linked from `docs/vision-execution/review-index.md`
- Current website code around `MovieModal.vue`, `SearchView.vue`, `SettingsView.vue`, `ListView.vue`, and global CSS
- Open GitHub issues #25–#32 on `greg-26/static`
- `git status --short`, branch/remotes, and fast-forward pull from `origin/main`

## Archive action

The completed active sprint set for issues #18–#24 was moved into the archive without rewriting history:

- from `website/sprints/2026-07-28-issue-driven-polish/`
- to `website/sprints/archive/2026-07-28-issue-driven-polish/`

The new active work is isolated in a brand-new dated sprint-set folder:

- `website/sprints/2026-07-28-open-issues-25-32/`

## Issue map

| Issue | Sprint coverage | Planning decision |
| --- | --- | --- |
| [#25 — Website - movie details - cast](https://github.com/greg-26/static/issues/25) | Sprint 030 | Group with issue #32 as movie-detail media rail polish: larger cast images and centered names. |
| [#26 — Website - mobile page drift](https://github.com/greg-26/static/issues/26) | Sprint 032 | Plan as constrained mobile first-paint/responsive drift sprint with evidence-first reproduction. |
| [#27 — Website - movie details - minir enhancements](https://github.com/greg-26/static/issues/27) | Sprint 029 | Pair list-chip radius with modal scroll reset because both touch detail interaction behavior. |
| [#28 — Website - movie details - ljnk to lists](https://github.com/greg-26/static/issues/28) | Sprint 029 | Add Manage lists escape hatch to the movie-detail list-chip row. |
| [#29 — Website - settings - lists - add/import handy](https://github.com/greg-26/static/issues/29) | Sprint 031 | Combine with issue #30 for one coherent Settings → Lists interaction pass. |
| [#30 — Website / settings / lists / enchancements](https://github.com/greg-26/static/issues/30) | Sprint 031 | Move row management behind overflow and keep row-click-to-open. |
| [#31 — Website - search - recents - border radius fix](https://github.com/greg-26/static/issues/31) | Sprint 028 | Make this the next executable sprint because it is the smallest visible follow-up to completed Sprint 027. |
| [#32 — Website / movie details / collections & seasons](https://github.com/greg-26/static/issues/32) | Sprint 030 | Sort seasons/collections, remove season descriptions, and fix collection poster proportions. |

All currently open website-scoped issues in the working fork are covered by planned sprints. No open website issue remains intentionally unplanned.

## Roadmap changes

- Created the new active sprint folder `sprints/2026-07-28-open-issues-25-32/`.
- Added folder-level sprint index and Sprint 028–032 files.
- Updated root `sprints/INDEX.md` with active status, roadmap, issue map, decisions, questions, and completion criteria.
- Archived the completed #18–#24 sprint folder under `sprints/archive/`.
- Updated `docs/vision-execution/review-index.md` with this report link.

## Next executable sprint

Sprint 028 — Search recents border-radius repair.

Why first: it is a tiny, visible regression/follow-up to Sprint 027 and can be verified quickly without destabilizing the larger movie-detail/settings queue.

## Planner notes

- Do not let Sprint 030 become a broad API sprint. Use explicit order only when already available; otherwise fall back to year ascending.
- Do not use Sprint 032 as an excuse for broad responsive redesign. Reproduce, identify the first-paint drift source, and make the smallest fix.
- Do not change profile/list persistence semantics in Sprints 029 or 031.
