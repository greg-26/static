# Sprint 006 — KV Cache

## Status

complete

## Outcome

Successful normalized title responses are read from and written to Cloudflare KV with versioned keys, configurable freshness, safe failure behavior, and restricted operator cache modes.

## Why now

The uncached lookup path must work first. Once it does, KV can be added as an implementation detail around the service without changing the public response schema.

## Source requirements

- Request flow: build cache key, read KV, return cache hit, otherwise query TMDB, normalize, store in KV, return response.
- Cache key: `title:{imdbId}:v1`.
- Guidelines: cache only successful normalized responses, never cache upstream errors, version cache keys when schema changes, TTL configurable.
- API agent cache requirements: `cache=refresh` skips cache reads and replaces cached values; `cache=bypass` skips cache reads and writes; cache overrides are restricted in production.
- Goals: minimize TMDB API usage and run comfortably within Cloudflare's free tier.

## Starting context

- Sprint 005 has a working uncached title lookup route and service.
- Wrangler environments may not be finalized until Sprint 007, so tests should mock KV bindings.

## Scope

### In scope

- Add a cache module that owns key construction, serialization, deserialization, and freshness behavior.
- Add environment/config support for cache TTL/freshness.
- Read KV before TMDB for normal validated requests.
- Write only successful normalized responses after TMDB lookup.
- Treat cache write failure as non-fatal for an otherwise successful response.
- Ensure upstream failures are not cached.
- Add tests for hit, miss, write, write failure, corrupt cache entry, and TTL/freshness behavior.
- Add `cache=refresh` and `cache=bypass` query handling with production restrictions.

### Out of scope

- Manual cache invalidation endpoint.
- Background refresh jobs.
- Production KV namespace creation or deployment secrets; Sprint 007 owns environment wiring.

## Technical guidance

- Keep KV details out of HTTP handlers and mappers.
- Use `title:{imdbId}:v1` exactly for initial successful response cache keys.
- Consider storing a small cache envelope if needed to make TTL/freshness testable and configurable without relying only on platform expiration semantics.
- On corrupt/unparseable cache values, ignore the entry and proceed to TMDB rather than failing the request.
- For `cache=refresh`, skip the cache read, require a successful upstream normalized response, then replace the KV value.
- For `cache=bypass`, skip both cache reads and writes.
- Reject refresh/bypass in production unless an explicit environment flag says overrides are allowed.
- Do not cache `404` or `500` responses unless the design is later changed to require it.

## Expected file impact

- `api/src/cache/**`
- `api/src/services/titleLookup.ts` or equivalent service orchestration updates
- `api/src/config/**` environment types/defaults
- Cache and service tests

## Implementation sequence

1. Define cache binding/config shape and key builder.
2. Implement cache read/parse/freshness behavior.
3. Parse and validate optional cache mode query parameters in the HTTP boundary.
4. Wrap the title lookup service with normal hit/miss/write, refresh, and bypass flows.
5. Ensure cache write failures are logged but do not fail successful normal/refresh lookups.
6. Add cache behavior tests with mocked KV.
7. Run existing API verification scripts.

## Acceptance criteria

- [x] Cache key for `tt0133093` is exactly `title:tt0133093:v1`.
- [x] Fresh cache hit returns cached normalized response without TMDB/client call.
- [x] Cache miss calls TMDB path, returns normalized response, and writes it to KV.
- [x] Upstream errors and not-found results are not cached.
- [x] Cache write failure does not fail an otherwise successful response.
- [x] Cache TTL/freshness is configurable and tested.
- [x] `cache=refresh` skips cache reads and replaces successful cached values.
- [x] `cache=bypass` skips cache reads and writes.
- [x] Cache override modes are rejected in production by default.

## Required tests

- Cache key construction.
- Cache hit bypasses TMDB client.
- Cache miss writes successful response.
- Upstream failure does not write cache.
- Cache write failure still returns `200` for successful upstream lookup.
- Corrupt/stale cache entry falls back to upstream according to the implemented freshness policy.
- Refresh mode read-skip/write-replace behavior.
- Bypass mode read-skip/write-skip behavior.
- Production restriction for refresh/bypass modes.

## Verification commands

Run from `api/`:

```sh
npm run typecheck
npm test
```

## Handoff

Completed in implementation run on 2026-07-21.

- Added `src/cache/titleCache.ts` for versioned cache keys, JSON envelopes, configurable freshness, corrupt/stale entry handling, and KV write helpers.
- Wired `TITLE_CACHE`, `TITLE_CACHE_TTL_SECONDS`, `ENVIRONMENT`, and `ALLOW_CACHE_OVERRIDES` into the title lookup flow.
- Added `cache=refresh` and `cache=bypass` handling, with production rejection by default.
- Added cache/service/worker tests for key construction, hit, miss/write, write failure, corrupt/stale fallback, refresh, bypass, and production restriction.
- Verification: `npm run typecheck` passed; `npm test` passed with 44 tests.
- Deviations: none.

## Dependencies unlocked

- Sprint 007 can bind real KV namespaces and document environment setup.
- Sprint 008 can verify full initial design coverage.
