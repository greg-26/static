# Sprint 015 — Content ratings contract

## Goal

Satisfy GitHub issue [#38](https://github.com/greg-26/static/issues/38) by adding a clear API-owned content-ratings contract for movies and series.

## Plan

1. Extend the normalized title model with nullable `contentRating`.
2. Fetch TMDB movie `release_dates` and TV `content_ratings` alongside existing detail payloads.
3. Map ratings with deterministic region behavior:
   - prefer requested `country`; default to `US` when no country is requested;
   - fall back to `US` if a non-US requested country has no usable rating;
   - finally fall back to the first TMDB region with a non-empty rating;
   - mark fallback selections with `fallback: true`.
4. Document response fields, sources, and fallback semantics in `api/README.md`.
5. Add mapper and TMDB client tests for movie and series behavior.
6. Bump title cache schema to avoid serving cached response bodies without `contentRating`.

## Files expected

- `src/models/title.ts`
- `src/tmdb/types.ts`
- `src/tmdb/client.ts`
- `src/tmdb/title-mapper.ts`
- `src/cache/titleCache.ts`
- API tests and README

## Verification

Run:

```sh
npm run typecheck
npm test
npm run wrangler:dry-run
git diff --check
```

## Status

Complete. Implementation added `contentRating`, TMDB movie/series source fetches, mapper/client tests, README contract documentation, and a title cache schema bump to `v4`.
