# Sprint 005 — Uncached Title Lookup

## Status

proposed

## Outcome

`GET /titles/{imdbId}` returns normalized movie and TV series responses by calling TMDB through the service/client/mapper path, without KV caching yet.

## Why now

This is the first vertical product slice: validated request in, TMDB-backed normalized response out. It proves the public contract before adding cache complexity.

## Source requirements

- Request flow steps: validate IMDb ID, resolve IMDb ID through TMDB, fetch metadata, normalize, return response.
- Public API: `GET /titles/{imdbId}` with `200`, `400`, `404`, and `500` responses.
- Normalized model: application-owned schema for title metadata.
- Error handling: hide upstream implementation details and log unexpected failures.

## Starting context

- Sprint 002 route validation and error contract exists.
- Sprint 003 public model and mapper exists.
- Sprint 004 TMDB client exists with typed internal outcomes.
- KV cache is not implemented yet.

## Scope

### In scope

- Add a title lookup service that orchestrates TMDB client and mapper.
- Wire `GET /titles/{imdbId}` to the service.
- Return `200` normalized responses for movie and series lookups.
- Return `404` for valid IDs not found by TMDB.
- Return stable `500` JSON for unexpected/upstream failures without raw TMDB leakage.
- Add HTTP/service tests using mocked dependencies.
- Add structured request logging if the foundation already has a logging seam; keep it minimal.

### Out of scope

- KV cache read/write.
- Deployment environment configuration beyond what tests need.
- Refresh/bypass/manual invalidation.
- Search, recommendations, accounts, writes, trailers, or localization.

## Technical guidance

- Keep HTTP-specific response formatting in handler/router code, not in the service.
- Keep business orchestration in a service that can be unit-tested without Worker request plumbing.
- Do not expose raw TMDB errors, URLs, or payloads in public errors.
- The route should still validate before service/TMDB calls.

## Expected file impact

- `api/src/services/titleLookup.ts` or similar
- `api/src/http/**` route/handler updates
- Service and route tests
- Minor model/error/logging updates as needed

## Implementation sequence

1. Add title lookup service using the TMDB client and mapper.
2. Wire the route handler to call the service after validation.
3. Map service outcomes to `200`, `404`, and `500` JSON responses.
4. Add tests for movie success, series success, not-found, invalid input, and upstream failure.
5. Run existing API verification scripts.

## Acceptance criteria

- [ ] `GET /titles/{validMovieImdbId}` can return a normalized movie response in tests.
- [ ] `GET /titles/{validSeriesImdbId}` can return a normalized series response in tests.
- [ ] Invalid IDs still return `400` before any service/TMDB call.
- [ ] Valid unknown IDs return stable `404` JSON.
- [ ] Upstream failures return stable `500` JSON without raw implementation details.
- [ ] Tests cover the route/service behavior without live TMDB access.

## Required tests

- HTTP movie success with mocked service/client data.
- HTTP series success with mocked service/client data.
- Valid not-found maps to `404`.
- Invalid input bypasses service and maps to `400`.
- Upstream/unexpected failure maps to `500`.

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

- Sprint 006 can add KV caching around a working lookup service.
- Sprint 007 can configure deployment around real endpoint behavior.
