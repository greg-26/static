# Sprint 011 — API detail foundation for movie details

## Status
proposed

## Outcome

Movie details use the Ohana API to enrich existing catalog entries with overview, cast, and movie collection context while preserving fast static browsing and graceful fallback.

## Why now

Working-fork issue [#6](https://github.com/greg-26/static/issues/6) asks the website to consume the API metadata already provided by `static/api`. The API now exposes title detail fields such as `overview`, `cast`, and `collection.items[]`; the first website slice should build the safe client/cache path and add high-value movie-detail fields before tackling TV seasons.

## Source requirements

- Issue #6: enrich movie detail page with overview, cast, collection details, seasons details for TV series, and other useful API metadata.
- `api/README.md`: `GET /titles/{imdbId}` returns normalized title metadata including overview, cast, collection, and series season fields.
- `VISION.md`: movie details are the decision surface; extra data should improve confidence, not add noisy boxes.
- `DESIGN_GUIDELINES.md`: one hero per screen, progressive disclosure, reduce noise.

## Starting context

- Static catalog entries are loaded from `public/movies.json` and are enough for Discover/Search browsing.
- Movie details currently render from static catalog/maturity/provider fields only.
- Production API URLs recorded in project memory: `https://ohanamovies-api.ohanamovies-api.workers.dev` and development `https://ohanamovies-api-development.ohanamovies-api.workers.dev`.
- The website has no API client/cache layer today.

## Scope

### In scope

- Add a tiny API client for title metadata by IMDb id with timeout/error handling and environment/base-URL override.
- Fetch API metadata lazily when opening a movie detail, not during row/catalog browsing.
- Cache fetched title metadata in-memory for the session to avoid repeated detail calls.
- Render overview when available, with a compact empty/loading/error state that does not block the modal.
- Render a short cast preview with roles/characters where useful.
- Render movie collection context when `collection.items[]` exists, using compact summaries and existing poster/list patterns where practical.
- Add tests/QA for API success, loading/fallback, and no-regression behavior when the API is unavailable.

### Out of scope

- TV season rendering; that is Sprint 012.
- Persisting API metadata into profile/list storage.
- Prefetching metadata for whole rows or search result lists.
- Replacing static `movies.json` as the browse/search source.
- Backend/API changes unless a blocking contract bug is found.
- Closing issue #6 before Sprint 012 completes all requested surfaces.

## Technical guidance

- Keep API state local to movie-detail/domain code; browsing must remain usable offline/when API fails.
- Use AbortController or equivalent timeout handling so a slow API never freezes the modal.
- Treat API fields as optional; render only useful sections with data.
- If API/base URL is not configured, default to production Workers.dev but keep local override possible for development.
- Do not duplicate maturity/provider surfaces while adding overview/cast/collection.

## Expected file impact

- `src/lib/ohanaApi.js` or equivalent client module
- `src/components/MovieModal.vue`
- Optional small metadata display component(s) if the modal gets too large
- Targeted QA script(s) or fixtures for API/fallback behavior
- Sprint docs after implementation

## Implementation sequence

1. Read `api/README.md` title response contract and inspect current modal data flow.
2. Add the API client with typed/validated lightweight normalization and timeout/error fallback.
3. Wire lazy fetch on modal open/reset, keyed by IMDb id, with session cache.
4. Render overview and cast preview without disturbing existing suitability/provider/list actions.
5. Render collection context for movies with `collection.items[]`.
6. Add targeted QA for success/failure/fallback states and run build.
7. Update Sprint 011 evidence and leave issue #6 open, mapped to Sprint 012 for seasons completion.

## Acceptance criteria

- [ ] Opening a movie detail fetches API metadata lazily by IMDb id when available.
- [ ] The modal remains usable if the API request is slow, fails, or returns partial/null fields.
- [ ] Overview appears for titles with API overview data.
- [ ] Cast preview appears for titles with API cast data and stays compact on mobile.
- [ ] Movie collection context appears when `collection.items[]` exists.
- [ ] Existing static Discover/Search behavior does not depend on the API.
- [ ] Existing suitability, list, provider, and external-link surfaces still work.
- [ ] Issue #6 remains open with a comment only if Sprint 012 is still required.

## Required tests

- `npm run build`
- Targeted modal/API QA covering success, empty fields, and API failure.
- Manual smoke: movie with collection, movie without collection, mobile modal open/close.

## Verification commands

```bash
cd website
npm run build
```

## Handoff

Report API endpoint/config used, graceful-fallback behavior, sample titles checked, verification commands, and remaining Sprint 012 work for issue #6.

## Dependencies unlocked

- Sprint 012 can add TV seasons and harden remaining API detail states after the client/cache foundation exists.
