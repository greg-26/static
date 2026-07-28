# Sprint index

Focused active sprint plans live in dated sprint-set folders under this directory. Completed or superseded sprint history lives under [`archive/`](archive/) so implementation agents do not mistake old plans for the next executable work.

## Status

- Current planning status: brand-new issue-driven cycle is active in [`2026-07-28-open-issues-37-39/`](2026-07-28-open-issues-37-39/); all current open working-fork issues are mapped.
- Current implementation phase: Sprint 036 complete; website issue #39 remains blocked by API issue #38.
- Next executable sprint: None — #39 remains blocked by API issue #38.
- Latest planning update: 2026-07-28 21:15 Europe/Madrid.

## Roadmap

| Sprint | Outcome | Status | Depends on |
| --- | --- | --- | --- |
| [Sprint 036](2026-07-28-open-issues-37-39/sprint-036-remove-poster-expand-button.md) | Remove the visible `Expand` affordance from the movie-detail poster while keeping poster-click expansion intact and accessible. | `complete` | None |
| Future content-rating sprint | Surface TMDB/current-country content ratings in movie details. | `blocked` | API issue #38 must ship the frontend data contract first |

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
| [#38 API - content ratings](https://github.com/greg-26/static/issues/38) | Not a website sprint | API/data-model prerequisite for #39; do not solve inside website planning docs. |
| [#39 Website - tmdb content ratings on movie detail page](https://github.com/greg-26/static/issues/39) | Future blocked sprint | Wait for #38 to define and ship the frontend contract, including current-country and fallback behavior. |

No remaining open website issue is intentionally unplanned: #37 is executable now; #39 is mapped as blocked by #38.

## Decisions and assumptions

- Working-fork issues (`origin`, currently `greg-26/static`) remain the active issue tracker for agent-driven website work.
- Keep this cycle to one executable sprint because only #37 is ready without backend/API changes.
- Do not mock or infer TMDB content-ratings data for #39 before the API contract from #38 exists.
- Sprint numbers continue from the existing completed sequence; do not renumber completed sprints.
- Keep the completed #33–#36 tranche archived and intact.

## Open questions

- For the future #39 sprint after #38 lands: what normalized field and fallback metadata should the website use for current country, same rating system, then US?

## Completion criteria

The current planned tranche is complete when:

- Sprint 036 removes the visible poster `Expand` affordance while preserving click/tap and keyboard access to the larger poster viewer. ✅ Sprint 036 complete.
- `npm run qa:sprint36`, `npm run build`, and `git diff --check` pass after implementation. ✅
- Issue #37 has an implementation comment linking final changes and verification.
- Issue #39 is not implemented until #38 ships the API/data-model contract, or a new sprint is planned once that contract is available.

## Maintenance rules

- One sprint = one file inside the active dated folder.
- Keep `VISION_EXECUTION.md` as a router; do not duplicate sprint status there.
- Link reports from `docs/vision-execution/review-index.md` instead of copying report contents into sprint files.
- Human feedback and new issues interrupt routine automation.
