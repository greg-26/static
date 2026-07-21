# Sprint 002 — Route Validation and Error Contract

## Status

complete

## Outcome

`GET /titles/{imdbId}` is routed and validates IMDb IDs before any upstream work, returning stable JSON errors for invalid input, unknown placeholders, unsupported methods, and unsupported routes.

## Why now

The public HTTP contract is the entry point to every later capability. Validation and error behavior must be stable before adding TMDB, normalization, or cache behavior.

## Source requirements

- Public API: `GET /titles/{imdbId}`.
- Responses: `200`, `400 Invalid IMDb ID`, `404 Title not found`, `500 Unexpected failure`.
- Request flow: validate IMDb ID before cache or TMDB calls.
- Error handling: consistent JSON errors, hide upstream implementation details.

## Starting context

- Sprint 001 has created the Worker package, source layout, and real verification scripts.
- No TMDB, mapper, or KV implementation is assumed.

## Scope

### In scope

- Implement route matching for `GET /titles/{imdbId}`.
- Validate IMDb title IDs with a strict, documented rule such as `tt` followed by digits.
- Return stable JSON `400` for invalid IDs.
- Return stable JSON `404` for valid IDs until lookup service exists, or through a simple injected placeholder service.
- Return stable JSON for unsupported routes and methods.
- Add tests for routing and validation behavior.

### Out of scope

- Calling TMDB.
- Defining the full normalized success model.
- KV caching.
- Cache refresh/bypass or manual invalidation controls.
- Production CORS policy finalization.

## Technical guidance

- Keep routing explicit; one endpoint does not need a generic routing framework.
- Define a small application error response shape once and use it consistently.
- Do not leak stack traces or internal exception messages into responses.
- Keep validation independent of HTTP so it can be unit-tested directly.

## Expected file impact

- `api/src/index.ts`
- `api/src/http/**` or similar route/error modules
- `api/src/validation/**`
- API tests for route and validation behavior

## Implementation sequence

1. Add or refine a tiny router for `/titles/:imdbId`.
2. Add IMDb ID validation and unit tests.
3. Define the JSON error response shape and helpers.
4. Wire route behavior to return `400`, `404`, and method/route errors deterministically.
5. Run the verification scripts created in Sprint 001.

## Acceptance criteria

- [x] `GET /titles/tt0133093` reaches the title route and returns a deterministic non-success response until lookup exists.
- [x] Invalid IDs such as `0133093`, `tt`, and path traversal-like input return `400` JSON without upstream calls.
- [x] Unsupported methods and routes return stable JSON errors.
- [x] Tests cover route matching, validation, and error response shape.
- [x] Existing API build/typecheck/test scripts pass.

## Required tests

- Valid IMDb ID accepted by validator.
- Invalid IDs rejected by validator.
- `GET /titles/{invalid}` returns `400`.
- Unsupported route returns JSON.
- Unsupported method returns JSON.

## Verification commands

Use the real API package scripts introduced by Sprint 001. At planning time those commands do not exist yet, so the SDE must inspect `api/package.json`, run the relevant scripts from `api/`, and report the exact commands.

## Handoff

Completed 2026-07-20.

- Added explicit `GET /titles/{imdbId}` routing with validation before placeholder lookup behavior.
- Added a shared JSON error helper and stable error codes for invalid IDs, missing titles, unknown routes, unsupported methods, and unexpected failures.
- Added isolated IMDb title ID validator tests and route/error response tests.
- Valid IDs currently return deterministic `404 title_not_found` until TMDB lookup exists in later sprints.
- Verification passed from `api/`: `npm test`, `npm run typecheck`, and `npm run build`.
- Deviations: none.

## Dependencies unlocked

- Sprint 005 can connect the validated route to the uncached lookup service.
- Sprint 006 can rely on validation happening before cache and TMDB access.
