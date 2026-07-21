# Sprint planner plan — open working-fork issues

Date: 2026-07-21
Scope: Ohana website planning for open issues on `origin` / `greg-26/static`.

## Inputs inspected

- `agents/sprint-planner.md`
- `docs/working-style.md`
- `README.md`, `AGENTS.md`, `VISION.md`, `DESIGN_GUIDELINES.md`, `CODING_STANDARDS.md`, `VISION_EXECUTION.md`
- `docs/vision-execution/review-index.md`
- `sprints/INDEX.md`, Sprint 9, and existing Sprint 10 plan
- Open GitHub issues #1, #2, #6 on `greg-26/static`
- API contract evidence in `api/README.md` and API source references for overview/cast/collection/seasons
- `git status --short --branch`

## Issue map

| Issue | Sprint coverage | Planning decision |
| --- | --- | --- |
| [#1 — website - where to watch attribution](https://github.com/greg-26/static/issues/1) | Sprint 010 | Same surface as country context; add JustWatch/TMDB attribution near Where-to-watch. |
| [#2 — website - Where to watch data country](https://github.com/greg-26/static/issues/2) | Sprint 010 | Make Spain/source context explicit; read-only country unless data proves multi-country support. |
| [#6 — website - integrate our api](https://github.com/greg-26/static/issues/6) | Sprints 011–012 | Split API enrichment into foundation/movie metadata, then TV seasons and hardening. |

## Roadmap changes

- Preserved Sprint 9 as `blocked`; no completed history or execution evidence was rewritten.
- Renamed/reworked the proposed country plan into API-style Sprint 010 and marked it `ready` because Alex's issue-driven planning request escalates it past the Sprint 9 validation blocker.
- Added Sprint 011 for API detail foundation: lazy title API client, overview, cast, collection, graceful fallback.
- Added Sprint 012 for TV seasons and API-state hardening, completing issue #6.
- Updated `sprints/INDEX.md` with current status, roadmap, assumptions, open questions, and completion criteria.

## Next executable sprint

Sprint 010 — Where-to-watch country and source context.

## Planner notes

- Sprint 010 is deliberately independent of Sprint 9's real-phone blocker.
- Sprint 011 should not prefetch metadata for rows/search; detail fetch must be lazy and non-blocking.
- Sprint 012 should be the point where issue #6 is eligible for closure, assuming Sprint 011 already landed overview/cast/collection.
