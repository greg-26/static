# Sprint 011 — API detail foundation for movie details

## Status
complete — implemented and verified 2026-07-22; issue #6 remains open for Sprint 012 TV seasons/hardening.

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
- Implementation note: production API responses did not include browser CORS headers during this sprint, so the same commit adds minimal read-only API CORS support (`GET, OPTIONS`) to unblock the static website client.

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

## Data-loading model

- `public/movies.json` remains the source for Discover rows, Search results, poster cards, provider bitmasks, and initial modal/card data.
- The Ohana API is detail-only enrichment: fetch `GET /titles/{imdbId}` lazily when a movie detail view/page opens, cache the response for the browser session, and never prefetch whole rows/search results.
- API metadata must be optional. If the API is slow, unavailable, or partial, the existing static detail view stays usable and no browse/search behavior changes.

## QA/CX notes

- Do not let enrichment create duplicate decision blocks: API overview should enhance/replace weak static synopsis copy where appropriate, not render as a second competing “about” section.
- Keep first-screen modal hierarchy focused on the title, suitability, and where-to-watch decision; cast and collection are supporting context and can sit lower or use compact previews.
- Limit cast to a short scan list on mobile. Prefer names plus the most useful role/character; avoid headshot grids or long “full credits” surfaces in this slice.
- Collection context should answer “is this part of a series and where does it fit?” Use compact ordered summaries; do not build a separate collection browsing product.
- Do not use API `streamingProviders` to replace existing provider availability in this sprint unless country/region semantics are explicitly aligned with Sprint 010. Where-to-watch provider truth remains the `movies.json` bitmask path.

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

- [x] Opening a movie detail fetches API metadata lazily by IMDb id when available.
- [x] The modal remains usable if the API request is slow, fails, or returns partial/null fields.
- [x] Overview appears for titles with API overview data.
- [x] Cast preview appears for titles with API cast data and stays compact on mobile.
- [x] Movie collection context appears when `collection.items[]` exists.
- [x] Existing static Discover/Search behavior does not depend on the API.
- [x] Existing suitability, list, provider, and external-link surfaces still work.
- [x] Issue #6 remains open with a comment only because Sprint 012 is still required.

## Implementation evidence

- Added `src/lib/ohanaApi.js`, defaulting to `https://ohanamovies-api.ohanamovies-api.workers.dev` with `VITE_OHANA_API_BASE_URL`, language/country, timeout, AbortController cancellation, and in-memory session cache keyed by endpoint/config/title.
- `MovieModal.vue` now lazily fetches title metadata on modal open, uses API overview through the existing synopsis slot, renders compact cast previews, and renders ordered collection items with poster thumbnails and IMDb links when available.
- Fallback behavior: invalid/missing IDs skip fetch; slow/failed API requests show a small “Ohana detail unavailable; showing static info.” message while preserving all static maturity/provider/list/external-link surfaces.
- Browser API availability blocker found and fixed in `api/src/index.ts`: read-only CORS headers and `OPTIONS` preflight are now emitted; `api/README.md` documents `CORS_ALLOWED_ORIGINS` behavior.
- Sample API contract checked with `tt0133093` (Matrix): Spanish overview, cast, collection items, artwork, and ES provider payload exist. Sprint 011 intentionally does not render seasons or replace provider truth.

## Required tests

- `npm run build`
- Targeted modal/API QA covering success, empty fields, and API failure.
- Manual smoke: movie with collection, movie without collection, mobile modal open/close.

## Verification commands

```bash
cd website
npm run qa:sprint11
npm run build
git diff --check
cd ../api
npm run typecheck
npm test
npm run wrangler:dry-run
```

## Handoff

Report API endpoint/config used, graceful-fallback behavior, sample titles checked, verification commands, and remaining Sprint 012 work for issue #6.

## Dependencies unlocked

- Sprint 012 can add TV seasons and harden remaining API detail states after the client/cache foundation exists.
