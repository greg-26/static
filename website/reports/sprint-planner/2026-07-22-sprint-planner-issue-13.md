# Sprint planner update — issue #13 movie-detail imagery

Date: 2026-07-22
Scope: Ohana website planning for the newly opened working-fork issue on `origin` / `greg-26/static` after the previous post-Sprint-013 planning update.

## Inputs inspected

- `agents/sprint-planner.md`
- `AGENTS.md`, `VISION_EXECUTION.md`, `docs/working-style.md`
- `docs/vision-execution/review-index.md`
- `sprints/INDEX.md`, Sprints 011, 012, 015, and 016
- `src/components/MovieModal.vue` image/poster usage
- Open GitHub issues #6, #7, #11, #12, and #13 on `greg-26/static`
- `git status --short`, current branch/remotes

## Issue handled

| Issue | Sprint coverage | Planning decision |
| --- | --- | --- |
| [#13 — Website - discover - movie details](https://github.com/greg-26/static/issues/13) | Sprint 017 | Added a dedicated movie-detail imagery hierarchy sprint. Do not fold into Sprint 016 provider grouping or bloat Sprint 011 API metadata copy. |

## Why a new sprint

Issue #13 is about movie-detail image hierarchy: the current poster is being used as a wide mobile rectangle and gets cropped. The fix needs a separate horizontal TMDB/API image/backdrop path plus a proper portrait poster treatment. That is related to the API detail work but distinct from overview/cast/collection/seasons (#6), provider Settings cleanup (#11), and provider grouping/icons (#12).

## Roadmap changes

- Added `sprints/sprint-017-movie-detail-imagery-hierarchy.md`.
- Updated `sprints/INDEX.md` with issue #13, Sprint 017, the image-contract open question, and completion criteria.
- Updated `docs/vision-execution/review-index.md` so future agents can find this planning report.

## Next executable sprint

Sprint 011 remains the next executable sprint because it builds the API detail foundation needed by both #6 and the later image/provider detail follow-ups.

Sprint 017 should wait until the implementation agent can verify whether the API exposes TMDB backdrop/still/image candidates. If it does not, the implementation should safely split the layout so posters remain portrait and report the backdrop/randomization portion as an API image-contract blocker rather than fabricating image URLs.

## Planner notes

- Do not implement the carousel/swipeable image gallery in Sprint 017; Alex described it as a second step if many images exist.
- Do not let the new hero/poster treatment bury suitability, where-to-watch, list actions, or API metadata on mobile.
- Random image selection should happen once per modal open or per title/session, not continuously while the modal is open.
