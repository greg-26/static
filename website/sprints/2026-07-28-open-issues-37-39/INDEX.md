# Sprint set — 2026-07-28 open issues 37–39

## Status

- Planning status: brand-new issue-driven sprint set created for the current working-fork website issues discovered at 2026-07-28 21:15 Europe/Madrid.
- Implementation phase: Sprint 036 is complete; issue #39 is intentionally held until API issue #38 defines and ships the content-ratings contract.
- Next executable sprint: None — #39 remains blocked by API issue #38.
- Latest planning update: 2026-07-28 21:15 Europe/Madrid.

## Roadmap

| Sprint | Outcome | Status | Depends on |
| --- | --- | --- | --- |
| [Sprint 036](sprint-036-remove-poster-expand-button.md) | Remove the visible `Expand` affordance from the movie-detail poster while keeping poster-click expansion intact and accessible. | `complete` | None |
| Future content-rating sprint | Surface TMDB/current-country content ratings in movie details. | `blocked` | API issue #38 must ship the frontend data contract first |

## Issue mapping

Open issue query for `origin` / `greg-26/static` found three open issues; `upstream` / `ohanamovies/static` had no open issues during this planning run.

| Issue | Sprint coverage | Planning note |
| --- | --- | --- |
| [#37 Remove the expand button on poster](https://github.com/greg-26/static/issues/37) | [Sprint 036](sprint-036-remove-poster-expand-button.md) | Small website-only UI cleanup: remove the cluttering visible `Expand` text/button treatment because the poster itself already expands on click/tap. |
| [#38 API - content ratings](https://github.com/greg-26/static/issues/38) | Not a website sprint | API/data-model prerequisite; do not implement frontend content-rating UI until this contract exists. |
| [#39 Website - tmdb content ratings on movie detail page](https://github.com/greg-26/static/issues/39) | Future blocked sprint | Website UI request is valid but depends on #38. Plan it after the API exposes ratings, country fallback behavior, and normalized field names. |

No remaining open website issue is intentionally unplanned: #37 is executable now; #39 is mapped as blocked by #38.

## Decisions and assumptions

- Working-fork issues (`origin`, currently `greg-26/static`) remain the active issue tracker for agent-driven website work.
- Keep this cycle as one executable sprint because only #37 is immediately actionable without backend/API work.
- Do not invent or mock TMDB ratings for #39. The frontend should wait for the API/data-model contract requested in #38.
- Sprint numbering continues after completed Sprint 035; completed sprint sets remain archived and unchanged.
- The previous completed issue tranche was moved to [`../archive/2026-07-28-open-issues-33-36/`](../archive/2026-07-28-open-issues-33-36/) so implementation agents have only one active sprint set to inspect.

## Open questions

- For #39 after #38 lands: which normalized API field should the website consume, and does the API return enough metadata to choose current country, same-rating-system fallback, then US?

## Completion criteria

This sprint set is complete when:

- Sprint 036 removes the visible poster `Expand` affordance without removing poster-click/tap expansion. ✅ Sprint 036 complete. 
- `npm run qa:sprint36`, `npm run build`, and `git diff --check` pass after implementation. ✅
- Issue #37 receives an implementation comment with changed files and verification.
- Issue #39 remains blocked until #38 ships, or a new sprint is planned after the API contract is available.

## Maintenance rules

- Implement one sprint at a time unless Alex explicitly asks for batching.
- Keep implementation notes in the relevant sprint file; keep this index as the execution overview.
- Do not close GitHub issues until implementation evidence exists and the implementation agent has commented with verification.
- Do not implement API changes or deploy externally from this website sprint.
