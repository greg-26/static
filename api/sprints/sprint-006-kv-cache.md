# Sprint 006 — KV Cache

## Status

proposed

## Outcome

Successful normalized title responses are read from and written to Cloudflare KV with versioned keys, configurable freshness, and safe failure behavior.

## Why now

The uncached lookup path must work first. Once it does, KV can be added as an implementation detail around the service without changing the public response schema.

## Source requirements

- Request flow: build cache key, read KV, return cache hit, otherwise query TMDB, normalize, store in KV, return response.
- Cache key: `title:{imdbId}:v1`.
- Guidelines: cache only successful normalized responses, never cache upstream errors, version cache keys when schema changes, TTL configurable.
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

### Out of scope

- Manual cache invalidation endpoint.
- `cache=refresh` or `cache=bypass` query controls unless the design is explicitly amended first.
- Background refresh jobs.
- Production KV namespace creation or deployment secrets; Sprint 007 owns environment wiring.

## Technical guidance

- Keep KV details out of HTTP handlers and mappers.
- Use `title:{imdbId}:v1` exactly for initial successful response cache keys.
- Consider storing a small cache envelope if needed to make TTL/freshness testable and configurable without relying only on platform expiration semantics.
- On corrupt/unparseable cache values, ignore the entry and proceed to TMDB rather than failing the request.
- Do not cache `404` or `500` responses unless the design is later changed to require it.

## Expected file impact

- `api/src/cache/**`
- `api/src/services/titleLookup.ts` or equivalent service orchestration updates
- `api/src/config/**` environment types/defaults
- Cache and service tests

## Implementation sequence

1. Define cache binding/config shape and key builder.
2. Implement cache read/parse/freshness behavior.
3. Wrap the title lookup service with cache hit/miss/write flow.
4. Ensure cache write failures are logged but do not fail successful lookups.
5. Add cache behavior tests with mocked KV.
6. Run existing API verification scripts.

## Acceptance criteria

- [ ] Cache key for `tt0133093` is exactly `title:tt0133093:v1`.
- [ ] Fresh cache hit returns cached normalized response without TMDB/client call.
- [ ] Cache miss calls TMDB path, returns normalized response, and writes it to KV.
- [ ] Upstream errors and not-found results are not cached.
- [ ] Cache write failure does not fail an otherwise successful response.
- [ ] Cache TTL/freshness is configurable and tested.

## Required tests

- Cache key construction.
- Cache hit bypasses TMDB client.
- Cache miss writes successful response.
- Upstream failure does not write cache.
- Cache write failure still returns `200` for successful upstream lookup.
- Corrupt/stale cache entry falls back to upstream according to the implemented freshness policy.

## Verification commands

Use the real API package scripts introduced by Sprint 001. At planning time those commands do not exist yet, so the SDE must inspect `api/package.json`, run the relevant scripts from `api/`, and report the exact commands.

## Handoff

The SDE agent must report:

- summary of changes
- verification performed
- acceptance criteria status
- deviations from the sprint
- newly discovered risks or follow-up work

## Dependencies unlocked

- Sprint 007 can bind real KV namespaces and document environment setup.
- Sprint 008 can verify full initial design coverage.
