# Sprint planner update — post-Sprint-013 working-fork issues

Date: 2026-07-22
Scope: Ohana website planning for new open issues on `origin` / `greg-26/static` added after the Sprint 013 planning pass.

## Inputs inspected

- `agents/sprint-planner.md`
- `README.md`, `AGENTS.md`, `VISION.md`, `DESIGN_GUIDELINES.md`, `CODING_STANDARDS.md`, `VISION_EXECUTION.md`
- `docs/working-style.md`
- `docs/vision-execution/review-index.md`
- `sprints/INDEX.md`, Sprints 010–013
- Open GitHub issues #6, #7, #8, #9, #10, #11, #12 on `greg-26/static`
- `git status --short`, current branch/remotes

## Issue map

| Issue | Sprint coverage | Planning decision |
| --- | --- | --- |
| [#6 — website - integrate our api](https://github.com/greg-26/static/issues/6) | Sprints 011–012 | Existing API detail split remains valid: foundation/overview/cast/collection, then TV seasons/hardening. |
| [#7 — Website - prevent movie duplication](https://github.com/greg-26/static/issues/7) | Not yet assigned | Still intentionally separate Discover deduplication scope; leave unplanned unless Alex prioritizes it over current polish/API/provider queue. |
| [#8 — Website - search / recents](https://github.com/greg-26/static/issues/8) | Sprint 013 | Existing Search/recents radius alignment sprint remains valid. |
| [#9 — Website - search - recent searches](https://github.com/greg-26/static/issues/9) | Sprint 013 | Existing focus-gated autocomplete-style recent searches sprint remains valid. |
| [#10 — Website - discovery - chip dropdown](https://github.com/greg-26/static/issues/10) | Sprint 014 | Added a small Discover chip dropdown density sprint after Sprint 013. |
| [#11 — Website - settings - providers](https://github.com/greg-26/static/issues/11) | Sprint 015 | Added provider settings/custom-source ownership cleanup before richer provider grouping. |
| [#12 — Website - Discover - movie details](https://github.com/greg-26/static/issues/12) | Sprint 016 | Added provider availability breakdown/icons sprint, dependent on API provider contract and UX guidance. |

## Roadmap changes

- Preserved Sprint 013 as the next executable Search/recents sprint for #8/#9.
- Added Sprint 014 for #10 because Discover chip dropdown subtitles are a different surface from Search recents and should stay small.
- Added Sprint 015 for #11 to move custom-provider configuration into Settings and keep movie details focused on availability.
- Added Sprint 016 for #12 to render TMDB-style provider buckets/icons only after API detail work and provider ownership cleanup.
- Updated `sprints/INDEX.md` status, roadmap, sprint file links, decisions, open questions, and tranche completion criteria.

## Next executable sprint

Sprint 013 — Search recents autocomplete polish.

Sprint 014 should follow immediately if Sprint 013 lands cleanly, because issue #10 is a tiny Discover control polish slice and does not need to wait for API work.

## Planner notes

- Do not merge #10 into Sprint 013: it touches Discover controls, not Search.
- Do not merge #11/#12 into Sprints 011–012: API metadata enrichment and provider availability grouping are related but reviewable as cleaner separate vertical slices.
- Sprint 016 must verify the API exposes TMDB-style provider buckets/logo paths. If it does not, block the sprint instead of fabricating stream/rent/buy semantics from the legacy bitmask.
- Issue #7 remains open and worth planning, but Alex's newest issues do not require reshuffling it ahead of Search/chip/provider polish by default.
