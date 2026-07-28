# Sprint index

Focused active sprint plans live in dated sprint-set folders under this directory. Completed or superseded sprint history lives under [`archive/`](archive/) so implementation agents do not mistake old plans for the next executable work.

## Status

- Current planning status: issue-driven cycle is active in [`2026-07-28-open-issues-37-39/`](2026-07-28-open-issues-37-39/); all current working-fork issues in this tranche are mapped.
- Current implementation phase: Sprint 036 complete; Sprint 037 complete now that API issue #38 shipped the content-ratings contract in `bc3e53c`.
- Next executable sprint: None in the current sprint set.
- Latest planning update: 2026-07-28 22:34 Europe/Madrid.

## Roadmap

| Sprint | Outcome | Status | Depends on |
| --- | --- | --- | --- |
| [Sprint 036](2026-07-28-open-issues-37-39/sprint-036-remove-poster-expand-button.md) | Remove the visible `Expand` affordance from the movie-detail poster while keeping poster-click expansion intact and accessible. | `complete` | None |
| [Sprint 037](2026-07-28-open-issues-37-39/sprint-037-tmdb-content-ratings-detail.md) | Surface API-selected TMDB content ratings in the movie-detail content details box. | `complete` | API issue #38 / commit `bc3e53c` |

## Active sprint set

- Sprint-set index: [`2026-07-28-open-issues-37-39/INDEX.md`](2026-07-28-open-issues-37-39/INDEX.md)
- Archived completed sprint set: [`archive/2026-07-28-open-issues-33-36/`](archive/2026-07-28-open-issues-33-36/)
- Earlier archived sprint set: [`archive/2026-07-28-open-issues-25-32/`](archive/2026-07-28-open-issues-25-32/)
- Superseded no-open-issues intake marker: [`archive/2026-07-28-no-open-website-issues/`](archive/2026-07-28-no-open-website-issues/)
- Earlier archived sprint set: [`archive/2026-07-28-issue-driven-polish/`](archive/2026-07-28-issue-driven-polish/)

## Issue mapping

Open issue query for `origin` / `greg-26/static` found three open issues during this planning run. Open issue query for `upstream` / `ohanamovies/static` found none.

| Issue | Sprint coverage | Planning note |
| --- | --- | --- |
| [#37 Remove the expand button on poster](https://github.com/greg-26/static/issues/37) | [Sprint 036](2026-07-28-open-issues-37-39/sprint-036-remove-poster-expand-button.md) | Remove the visible `Expand` affordance from the movie-detail poster; keep poster click/tap expansion behavior. |
| [#38 API - content ratings](https://github.com/greg-26/static/issues/38) | Not a website sprint | API/data-model prerequisite completed in `bc3e53c`; website Sprint 037 consumes the normalized field. |
| [#39 Website - tmdb content ratings on movie detail page](https://github.com/greg-26/static/issues/39) | [Sprint 037](2026-07-28-open-issues-37-39/sprint-037-tmdb-content-ratings-detail.md) | Display the API-selected current-country/fallback content rating in the movie-detail content details box. |

No remaining open website issue is intentionally unplanned: #37 and #39 are covered by completed website sprints; #38 was the completed API prerequisite.

## Decisions and assumptions

- Working-fork issues (`origin`, currently `greg-26/static`) remain the active issue tracker for agent-driven website work.
- The website trusts the API `contentRating` contract and does not duplicate TMDB fallback selection logic.
- Missing TMDB content-ratings data is represented as a compact unavailable state after API detail enrichment returns.
- Sprint numbers continue from the existing completed sequence; do not renumber completed sprints.
- Keep the completed #33–#36 tranche archived and intact.

## Open questions

None for the current active sprint set.

## Completion criteria

The current planned tranche is complete when:

- Sprint 036 removes the visible poster `Expand` affordance while preserving click/tap and keyboard access to the larger poster viewer. ✅ Sprint 036 complete.
- Sprint 037 surfaces API-selected TMDB content ratings in the movie-detail content details box. ✅ Sprint 037 complete.
- `npm run qa:sprint36`, `npm run qa:sprint37`, `npm run build`, and `git diff --check` pass after implementation. ✅
- Issue #37 has an implementation comment linking final changes and verification.
- Issue #39 has an implementation comment linking final changes and verification, then is closed after push.

## Maintenance rules

- One sprint = one file inside the active dated folder.
- Keep `VISION_EXECUTION.md` as a router; do not duplicate sprint status there.
- Link reports from `docs/vision-execution/review-index.md` instead of copying report contents into sprint files.
- Human feedback and new issues interrupt routine automation.
