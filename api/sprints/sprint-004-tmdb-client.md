# Sprint 004 — TMDB Client

## Status

complete

## Outcome

A small TMDB client resolves IMDb IDs to movie or TV series records and fetches the raw metadata needed by the mapper, with mocked tests for success, not-found, timeout, and upstream failure paths.

## Why now

After the public schema and mapper boundary exist, the API needs a controlled integration layer that gathers only the upstream data required for the initial response.

## Source requirements

- Request flow: resolve IMDb ID through TMDB, fetch metadata, normalize.
- External dependencies: TMDB source metadata.
- Error handling: hide upstream implementation details, validate before calling TMDB, log unexpected failures.
- Implementation principles: avoid full TMDB compatibility and unnecessary abstractions.

## Starting context

- Sprint 001 package/tooling exists.
- Sprint 003 defines mapper input expectations and public output boundaries.
- No KV cache is required yet.

## Scope

### In scope

- Add TMDB client configuration for API key/authorization from Worker environment.
- Implement IMDb resolution using TMDB's find-by-external-id flow or the simplest equivalent TMDB endpoint.
- Fetch movie or TV series details and the associated data required by the mapper: credits, images, collection details for movies where needed, and watch/streaming providers.
- Convert upstream HTTP/timeouts/not-found into typed internal outcomes.
- Add mocked fetch tests; no live TMDB calls or real secrets in tests.

### Out of scope

- Public route success wiring.
- KV caching.
- Retrying/background refresh.
- Generic provider plugin architecture.
- Exhaustive TMDB endpoint support.

## Technical guidance

- Keep the client responsible for raw TMDB HTTP only; no public response mapping here.
- Make timeouts explicit and configurable enough for tests.
- Treat optional TMDB subresources as unreliable; decide which failures are fatal versus safely omitted and cover that in tests.
- Never log or return secrets, authorization headers, or raw upstream payloads in errors.

## Expected file impact

- `api/src/tmdb/client.ts` or similar
- `api/src/tmdb/types.ts` for internal raw shapes
- `api/src/config/**` or environment binding types
- TMDB client tests with mocked fetch

## Implementation sequence

1. Define minimal environment binding/config shape for the TMDB API key.
2. Implement IMDb resolution with typed not-found handling.
3. Implement metadata fetches for resolved movie and TV series results.
4. Add timeout and upstream-error handling.
5. Cover all paths with mocked fetch tests.
6. Run existing API verification scripts.

## Acceptance criteria

- [x] Valid IMDb IDs can be resolved to either movie or TV series raw data through mocked TMDB responses.
- [x] Unknown titles produce an internal not-found outcome suitable for HTTP `404`.
- [x] Upstream errors/timeouts produce internal failures suitable for stable HTTP `500` handling.
- [x] Tests do not require internet access, live TMDB, or production secrets.
- [x] TMDB raw details remain inside TMDB/integration modules.

## Required tests

- IMDb ID resolves to movie and fetches movie detail data.
- IMDb ID resolves to series and fetches series detail data.
- No TMDB result maps to not-found.
- Upstream non-2xx maps to internal upstream failure.
- Timeout/aborted fetch maps to internal upstream failure.
- Missing optional subresource behavior is documented and tested.

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

- Sprint 005 can connect HTTP requests to TMDB-backed normalized responses.
- Sprint 006 can cache successful lookup results.
