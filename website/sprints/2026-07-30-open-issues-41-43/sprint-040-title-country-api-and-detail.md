# Sprint 040 — Title country API and detail metadata

## Status

ready

## Outcome

Ohana API exposes title country/origin metadata from TMDB and the website shows it quietly in movie detail.

## Why now

Issue [#41](https://github.com/greg-26/static/issues/41) asks to verify TMDB country data, include it in the API, and display it in the movie detail page. This touches API shape plus UI, so it is isolated from the smaller front-end-only detail cleanup and share action.

## Source requirements

- GitHub issue #41: check whether TMDB returns movie country, make sure it is part of the API, then add it to the movie detail page.
- Current API mapper: `api/src/tmdb/title-mapper.ts` maps TMDB detail responses into `TitleResponse` but does not expose country/origin data.
- Current website API client: `website/src/lib/ohanaApi.js` normalizes title detail fields and feeds `MovieModal.vue`.
- Current scraper already stores `originCountries` in cache and filters excluded countries, but website detail enrichment should primarily use the Ohana API.

## Starting context

TMDB movie detail can provide `origin_country` and `production_countries`; TMDB TV detail provides `origin_country`. The API already fetches full movie/series detail payloads for title pages, so country metadata should be mapped from existing data rather than fetched separately.

## Scope

### In scope

- Add a normalized country/origin field to the API title model and mapper.
- Map movie countries from TMDB, preferring `production_countries` when populated and falling back to `origin_country`.
- Map TV countries from `origin_country`.
- Include stable ISO codes and display names when TMDB provides names; keep empty/missing data as an empty array or `null` consistently.
- Add/update API tests for movie and TV country mapping.
- Normalize the field in `website/src/lib/ohanaApi.js`.
- Show country metadata in `MovieModal.vue` as short, non-boxed metadata near existing year/rating/links or overview metadata.

### Out of scope

- Rebuilding the whole static `movies.json` catalog.
- Changing country filtering/exclusion rules.
- Adding country filters or Settings.
- Large movie-detail redesign.

## Technical guidance

- Use a product-neutral label such as `Country` or `Countries`; keep it terse (`US`, `United States`, or comma-separated names depending on API data quality).
- Do not duplicate the same country in multiple places.
- Preserve backwards compatibility for consumers that ignore the new API field.
- If country display names are unavailable for TV origin codes, prefer ISO codes over guessing.
- Keep API CORS/deployment config unchanged.

## Expected file impact

- `api/src/models/title.ts`
- `api/src/tmdb/types.ts`
- `api/src/tmdb/title-mapper.ts`
- Relevant API tests under `api/test/`
- `website/src/lib/ohanaApi.js`
- `website/src/components/MovieModal.vue`

## Implementation sequence

1. Inspect TMDB type fixtures/tests and identify existing detail fields available for movies and TV.
2. Extend API types and mapper with normalized country metadata.
3. Add/update API tests for movie `production_countries` / `origin_country` and TV `origin_country`.
4. Normalize the field in the website API client.
5. Render country metadata in the movie detail without adding another box.
6. Run API tests and website build.

## Acceptance criteria

- [ ] API title response includes normalized country/origin metadata when TMDB provides it.
- [ ] Movie mapping uses TMDB `production_countries` when available and falls back to `origin_country`.
- [ ] TV mapping uses TMDB `origin_country`.
- [ ] Website movie detail shows country metadata when available and hides it when unavailable.
- [ ] The new metadata does not create another large detail container or push key actions below the fold unnecessarily on mobile.

## Required tests

- API mapper/unit tests covering movie and TV country metadata.
- `npm test` or the focused API test command if the full API suite is equivalent and available.
- `cd website && npm run build`.
- Manual/narrow viewport check of detail metadata placement.

## Verification commands

```bash
cd api
npm test
cd ../website
npm run build
git diff --check
```

## Handoff

Comment on #41 with API field shape, changed files, test/build evidence, and any deployment/cache caveat. Close #41 only after implementation evidence confirms the issue is fully satisfied.

## Dependencies unlocked

None directly; this completes the country metadata issue.
