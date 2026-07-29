# Sprint index

Focused active sprint plans live in dated sprint-set folders under this directory. Completed or superseded sprint history lives under [`archive/`](archive/) so implementation agents do not mistake old plans for the next executable work.

## Status

- Current planning status: corrected brand-new issue-driven cycle in [`2026-07-30-open-issues-41-43/`](2026-07-30-open-issues-41-43/) is complete after superseding the incorrect no-open-issues marker.
- Current implementation phase: Sprints 038–040 complete.
- Next executable sprint: none — this corrected issue tranche is complete.
- Latest planning update: 2026-07-30 00:09 Europe/Madrid.

## Roadmap

| Sprint | Outcome | Status | Depends on |
| --- | --- | --- | --- |
| [Sprint 038](2026-07-30-open-issues-41-43/sprint-038-movie-detail-suitability-clutter.md) | Remove redundant movie-detail suitability copy and improve category spacing. | `complete` | Current `MovieModal.vue` maturity/detail layout |
| [Sprint 039](2026-07-30-open-issues-41-43/sprint-039-movie-detail-share-action.md) | Add a direct share icon button for the current movie detail link. | `complete` | Sprint 038 complete |
| [Sprint 040](2026-07-30-open-issues-41-43/sprint-040-title-country-api-and-detail.md) | Expose TMDB title country/origin data through the API and show it calmly in movie detail. | `complete` | Current Ohana API title-detail mapper; Sprint 038 preferred for reduced detail clutter |

## Active sprint set

- Sprint-set index: [`2026-07-30-open-issues-41-43/INDEX.md`](2026-07-30-open-issues-41-43/INDEX.md)
- Superseded no-open-issues marker: [`archive/2026-07-29-no-open-website-issues/`](archive/2026-07-29-no-open-website-issues/)
- Archived completed sprint set: [`archive/2026-07-28-open-issues-37-39/`](archive/2026-07-28-open-issues-37-39/)
- Earlier archived sprint set: [`archive/2026-07-28-open-issues-33-36/`](archive/2026-07-28-open-issues-33-36/)
- Earlier archived no-open-issues marker: [`archive/2026-07-28-no-open-website-issues/`](archive/2026-07-28-no-open-website-issues/)
- Earlier archived sprint set: [`archive/2026-07-28-open-issues-25-32/`](archive/2026-07-28-open-issues-25-32/)
- Earlier archived sprint set: [`archive/2026-07-28-issue-driven-polish/`](archive/2026-07-28-issue-driven-polish/)

## Issue mapping

`origin` / `greg-26/static` is the active tracker for this planning cycle. `upstream` / `ohanamovies/static` was also checked and has no open issues.

| Issue | Sprint coverage | Planning note |
| --- | --- | --- |
| [#41 Country of movie](https://github.com/greg-26/static/issues/41) | [Sprint 040](2026-07-30-open-issues-41-43/sprint-040-title-country-api-and-detail.md) | API-first country/origin metadata plus quiet movie-detail display. |
| [#42 Share movie icon button](https://github.com/greg-26/static/issues/42) | [Sprint 039](2026-07-30-open-issues-41-43/sprint-039-movie-detail-share-action.md) | Direct share icon; no 3-dot menu for a single action. |
| [#43 Movie detail page clutter](https://github.com/greg-26/static/issues/43) | [Sprint 038](2026-07-30-open-issues-41-43/sprint-038-movie-detail-suitability-clutter.md) | First executable sprint because it removes noise before adding new actions/metadata. |

## Decisions and assumptions

- Working-fork issues (`origin`, currently `greg-26/static`) are the active issue tracker for agent-driven website work.
- The previous active folder [`archive/2026-07-29-no-open-website-issues/`](archive/2026-07-29-no-open-website-issues/) is preserved as superseded history because it incorrectly planned against an empty issue set.
- Sprint numbers continue after completed Sprint 037; do not renumber completed or archived sprint files.
- #43 should land before #42/#41 so the detail page is quieter before adding a share action or country metadata.
- Country/origin metadata should use the existing Ohana API detail flow, not a new client-side TMDB call.

## Open questions

- For #41, recommended default is to expose a normalized `countries` array with ISO code and display name when available, preferring TMDB `production_countries` for movies and falling back to `origin_country`; TV uses `origin_country`.
- For #42, recommended default is `navigator.share` with clipboard fallback and brief local feedback when Web Share is unavailable.

## Completion criteria

This open-issue tranche is complete.

- #41, #42, and #43 each have implementation evidence comments and are closed by the implementation completion workflow.
- Movie detail remains mobile-calm after clutter cleanup, share action, and country metadata additions.
- Relevant API tests and website build passed for implemented slices.

## Maintenance rules

- One active sprint-set folder at a time.
- Keep sprint files scoped to their issue(s); no unrelated detail-page redesign.
- Keep `VISION_EXECUTION.md` as a router; do not duplicate sprint status there.
- Link reports from `docs/vision-execution/review-index.md` instead of copying report contents into sprint files.
- Human feedback and new issues interrupt routine automation.
