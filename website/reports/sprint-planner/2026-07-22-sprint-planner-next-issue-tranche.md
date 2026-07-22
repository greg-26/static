# Sprint planner update — next open-issue website tranche

Date: 2026-07-22
Scope: Ohana website planning for current open issues on `origin` / `greg-26/static`.

## Inputs inspected

- `README.md`, `AGENTS.md`, `agents/sprint-planner.md`
- `VISION.md`, `DESIGN_GUIDELINES.md`, `CODING_STANDARDS.md`, `VISION_EXECUTION.md`
- `docs/working-style.md`, `docs/vision-execution/review-index.md`
- Current `sprints/INDEX.md`, completed Sprint 017, and latest planner reports linked from the review index
- Current website/API code around `MovieModal.vue`, `src/lib/ohanaApi.js`, Discover row generation references, and production API sample for cast profile images
- Open GitHub issues #7 and #13–#17 on `greg-26/static`
- `git status --short`, branch/remotes, and rebase from `origin/main`

## Archive action

Completed Sprints 010–017 were moved from the active `website/sprints/` root into `website/sprints/archive/`. Their contents were not rewritten; active work now starts at Sprint 018.

## Issue map

| Issue | Sprint coverage | Planning decision |
| --- | --- | --- |
| [#7 — Website - prevent movie duplication](https://github.com/greg-26/static/issues/7) | Sprint 018 | Plan first as the next executable independent Discover trust fix. |
| [#13 — Website - discover - movie details](https://github.com/greg-26/static/issues/13) | Archived Sprint 017 | Already implemented/verified by Sprint 017; needs implementation workflow evidence comment/closure, not a duplicate sprint. |
| [#14 — Website - movie details](https://github.com/greg-26/static/issues/14) | Sprint 021 | API already exposes cast profile images and website normalizes `profileUrl`; plan UI rendering without a new API dependency issue. |
| [#15 — Website - movie details - multi issues](https://github.com/greg-26/static/issues/15) | Sprints 019–021 | Split across overview/order/loading/external links, parent guide links/density, and collection/cast media polish. |
| [#16 — Website - movie details - parent guide](https://github.com/greg-26/static/issues/16) | Sprint 020 | Plan a dedicated parent-guide tags and compact row sprint. |
| [#17 — API - cors?](https://github.com/greg-26/static/issues/17) | Sprint 022 | Cross-project but website-review relevant; plan a small API CORS origin unblocker instead of mixing it into UI work. |

## Roadmap changes

- Replaced the no-active-sprint state with Sprints 018–022.
- Added active sprint files for each small executable slice.
- Updated `sprints/INDEX.md` status, roadmap, assumptions, open questions, and tranche completion criteria.
- Updated `docs/vision-execution/review-index.md` with this report link.

## Next executable sprint

Sprint 018 — Discover visible-row deduplication.

It is isolated from the movie-detail churn, already backed by product acceptance criteria, and should improve first-screen trust before the detail-modal follow-up work continues.

## Planner notes

- Do not fold all of issue #15 into one sprint. It is exactly the kind of grab-bag that causes sloppy UI changes.
- Do not create an API issue for #14 unless implementation verification shows the API no longer returns cast `profile` images.
- Treat #17 as cross-project. If the API planner claims it, supersede Sprint 022 rather than duplicating CORS work.
