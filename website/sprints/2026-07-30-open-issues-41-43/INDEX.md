# Sprint set — 2026-07-30 open issues 41–43

## Status

- Planning status: corrected brand-new issue-driven cycle opened at 2026-07-30 00:09 Europe/Madrid after superseding the invalid no-open-issues marker.
- Implementation phase: Sprints 038–039 complete; implementation should take one sprint at a time.
- Next executable sprint: [Sprint 040 — Title country API and detail metadata](sprint-040-title-country-api-and-detail.md).
- Latest planning update: 2026-07-30 00:09 Europe/Madrid.

## Roadmap

| Sprint | Outcome | Status | Depends on |
| --- | --- | --- | --- |
| [Sprint 038](sprint-038-movie-detail-suitability-clutter.md) | Remove redundant movie-detail suitability copy and improve category spacing. | `complete` | Current `MovieModal.vue` maturity/detail layout |
| [Sprint 039](sprint-039-movie-detail-share-action.md) | Add a direct share icon button for the current movie detail link. | `complete` | Sprint 038 complete |
| [Sprint 040](sprint-040-title-country-api-and-detail.md) | Expose TMDB title country/origin data through the API and show it calmly in movie detail. | `ready` | Current Ohana API title-detail mapper; Sprint 038 preferred for reduced detail clutter |

## Issue mapping

| Issue | Sprint coverage | Planning note |
| --- | --- | --- |
| [#41 Country of movie](https://github.com/greg-26/static/issues/41) | [Sprint 040](sprint-040-title-country-api-and-detail.md) | API-first because the website detail view already consumes Ohana API title enrichment. Scraper already caches origin countries but static catalog output is not the primary path for detail metadata. |
| [#42 Share movie icon button](https://github.com/greg-26/static/issues/42) | [Sprint 039](sprint-039-movie-detail-share-action.md) | Direct top-right share button; no 3-dot menu because share is the only action requested. |
| [#43 Movie detail page clutter](https://github.com/greg-26/static/issues/43) | [Sprint 038](sprint-038-movie-detail-suitability-clutter.md) | First sprint because it reduces visual noise before adding share/country detail. |

## Decisions and assumptions

- Working-fork issues (`origin`, currently `greg-26/static`) are the active tracker for this planning cycle. Upstream `ohanamovies/static` was verified and has no open issues, but that does not hide origin issues.
- The invalid active folder [`../archive/2026-07-29-no-open-website-issues/`](../archive/2026-07-29-no-open-website-issues/) is archived as superseded history rather than rewritten.
- Sprint numbers continue after Sprint 037; do not renumber completed or archived sprint files.
- Prioritize #43 before #42/#41 so the movie detail page gets quieter before new metadata/actions are added.
- Country/origin metadata should use short labels and avoid adding another boxed detail section.

## Open questions

- For #41, TMDB has both movie `origin_country` / `production_countries` and TV `origin_country`. Recommended default: API returns a normalized `countries` array with ISO code and display name when available, preferring production countries for movies and origin countries for TV if production countries are absent.
- For #42, if `navigator.share` is unavailable, recommended default: copy the movie deep link to clipboard and show brief local feedback.

## Completion criteria

This tranche is complete when:

- Issues #41, #42, and #43 each have implemented evidence comments and are closed by the implementation completion workflow.
- Movie detail stays mobile-calm after the clutter cleanup, share action, and country metadata additions.
- API/title mapper tests and website build pass for the implemented slices.

## Maintenance rules

- One active sprint-set folder at a time.
- Keep sprint files scoped to their issue(s); no unrelated movie-detail redesign.
- Keep `VISION_EXECUTION.md` as a router; do not duplicate sprint status there.
- Link planner reports from `docs/vision-execution/review-index.md` instead of copying report contents into sprint files.
