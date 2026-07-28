# Sprint set — 2026-07-28 open issues 37–39

## Status

- Planning status: issue-driven sprint set for the working-fork website issues discovered at 2026-07-28 21:15 Europe/Madrid.
- Implementation phase: Sprint 036 is complete; Sprint 037 is complete after API issue #38 shipped the content-ratings contract in `bc3e53c`.
- Next executable sprint: None in this sprint set.
- Latest planning update: 2026-07-28 22:34 Europe/Madrid.

## Roadmap

| Sprint | Outcome | Status | Depends on |
| --- | --- | --- | --- |
| [Sprint 036](sprint-036-remove-poster-expand-button.md) | Remove the visible `Expand` affordance from the movie-detail poster while keeping poster-click expansion intact and accessible. | `complete` | None |
| [Sprint 037](sprint-037-tmdb-content-ratings-detail.md) | Surface API-selected TMDB content ratings in the movie-detail content details box. | `complete` | API issue #38 / commit `bc3e53c` |

## Issue mapping

Open issue query for `origin` / `greg-26/static` found three open issues; `upstream` / `ohanamovies/static` had no open issues during this planning run.

| Issue | Sprint coverage | Planning note |
| --- | --- | --- |
| [#37 Remove the expand button on poster](https://github.com/greg-26/static/issues/37) | [Sprint 036](sprint-036-remove-poster-expand-button.md) | Small website-only UI cleanup: remove the cluttering visible `Expand` text/button treatment because the poster itself already expands on click/tap. |
| [#38 API - content ratings](https://github.com/greg-26/static/issues/38) | Not a website sprint | API/data-model prerequisite completed in `bc3e53c`; the website consumes its normalized `contentRating` contract. |
| [#39 Website - tmdb content ratings on movie detail page](https://github.com/greg-26/static/issues/39) | [Sprint 037](sprint-037-tmdb-content-ratings-detail.md) | Website now displays the API-selected current-country/fallback content rating in the detail compatibility box without duplicating backend fallback logic. |

No remaining open website issue is intentionally unplanned: #37 and #39 are covered by completed website sprints, while #38 was the completed API prerequisite.

## Decisions and assumptions

- Working-fork issues (`origin`, currently `greg-26/static`) remain the active issue tracker for agent-driven website work.
- The website trusts the API `contentRating` field (`rating`, `region`, `source`, `fallback`) and does not parse TMDB fallback candidates.
- Missing API content ratings are shown as a muted unavailable state only after detail enrichment returns.
- Sprint numbering continues after completed Sprint 036; completed sprint sets remain archived and unchanged.
- The previous completed issue tranche was moved to [`../archive/2026-07-28-open-issues-33-36/`](../archive/2026-07-28-open-issues-33-36/) so implementation agents have only one active sprint set to inspect.

## Open questions

None for this sprint set.

## Completion criteria

This sprint set is complete when:

- Sprint 036 removes the visible poster `Expand` affordance without removing poster-click/tap expansion. ✅ Sprint 036 complete.
- Sprint 037 surfaces API-selected TMDB content ratings in the movie-detail content details box. ✅ Sprint 037 complete.
- `npm run qa:sprint36`, `npm run qa:sprint37`, `npm run build`, and `git diff --check` pass after implementation. ✅
- Issue #37 receives/received an implementation comment with changed files and verification.
- Issue #39 receives an implementation comment with changed files and verification, then closes after the implementation commit is pushed.

## Maintenance rules

- Implement one sprint at a time unless Alex explicitly asks for batching.
- Keep implementation notes in the relevant sprint file; keep this index as the execution overview.
- Do not close GitHub issues until implementation evidence exists and the implementation agent has commented with verification.
- Do not implement API changes or deploy externally from this website sprint.
