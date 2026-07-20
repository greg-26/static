# API Sprint Plan

## Status

- Current planning status: reviewed against `api/docs/design.md`, `api/AGENTS.md`, and the current implementation.
- Current implementation phase: Sprint 007 complete; final design closure remains. Wrangler configuration and API README are in place with placeholder Cloudflare resource IDs.
- Next executable sprint: Sprint 008 — Design Closure Hardening.
- Latest planning revision date: 2026-07-21.

## Roadmap

| Sprint | Outcome | Status | Depends on |
|---|---|---|---|
| [001](sprint-001-worker-foundation.md) | Cloudflare Worker API project exists with TypeScript, test tooling, and a minimal JSON HTTP shell. | complete | none |
| [002](sprint-002-route-validation-errors.md) | `GET /titles/{imdbId}` route validates input and returns stable JSON errors without calling TMDB. | complete | 001 |
| [003](sprint-003-public-model-and-mappers.md) | Application-owned title schema and pure TMDB-to-public mappers are defined and tested with movie/series fixtures. | complete | 001 |
| [004](sprint-004-tmdb-client.md) | TMDB client resolves IMDb IDs and fetches required raw movie/series metadata through mocked fetch tests. | complete | 001, 003 |
| [005](sprint-005-uncached-title-lookup.md) | The route returns normalized movie/series responses from TMDB on cache-miss path, including 404 and failure handling. | complete | 002, 003, 004 |
| [006](sprint-006-kv-cache.md) | Successful normalized title responses are read from and written to Cloudflare KV using versioned keys and configurable freshness. | complete | 005 |
| [007](sprint-007-wrangler-environments.md) | Wrangler configuration, bindings, secrets documentation, and local/dev/prod environment setup are in place. | complete | 006 |
| [008](sprint-008-design-closure-hardening.md) | Initial design is verified end-to-end, documentation matches implementation, and no initial-scope gaps remain. | ready | 007 |

## Decisions and assumptions

- Decision: Build the API as a dedicated `api/` Cloudflare Worker package rather than mixing it into `website/` or `scraper/`.
  - Rationale: The repo currently has no API package; the design calls for a single Worker and the existing website/scraper packages are separate concerns.
  - Affected sprints: 001-008.
  - Status: accepted.
- Decision: Keep TMDB raw response types and fixtures inside the integration/mapper boundary.
  - Rationale: The design requires an application-owned public schema and says clients must never depend on TMDB field names.
  - Affected sprints: 003-005.
  - Status: accepted.
- Decision: Use `title:{imdbId}:v1` as the initial cache key shape.
  - Rationale: This is explicitly specified by the design and gives a clean schema-version bump path.
  - Affected sprints: 006, 008.
  - Status: accepted.
- Decision: Implement `cache=refresh` and `cache=bypass` as restricted operator controls in Sprint 006, but keep manual invalidation endpoints out of initial scope.
  - Rationale: `api/AGENTS.md` makes refresh/bypass behavior a cache requirement; `api/docs/design.md` leaves manual invalidation open and does not require a mutation endpoint.
  - Affected sprints: 002, 006, 008.
  - Status: accepted.
- Decision: Use a 7-day default cache TTL (`604800` seconds), configurable by Worker environment variable.
  - Rationale: The design requires configurable TTL and 7 days is a simple low-cost default for stable metadata.
  - Affected sprints: 006, 007.
  - Status: accepted.
- Assumption: The first public response schema can be versioned by cache key only; no response-body schema version field is required for the initial API.
  - Rationale: The design asks to version cache keys when schema changes and lists response schema versioning as an open question.
  - Affected sprints: 003, 006, 008.
  - Status: provisional.

## Open questions

- Should response payloads include an explicit `schemaVersion` field?
  - Recommended default: no for initial implementation; use `title:{imdbId}:v1` cache versioning and typed contracts instead.
  - Blocks: only if clients require body-level schema negotiation before launch.
- Which real CORS origins should be allowed in development and production?
  - Recommended default: configure an allowlist per environment and avoid `*` in production.
  - Blocks: final production deployment values only; placeholders are documented in Sprint 007.

## Completion criteria

The initial API design is fully implemented when:

- `GET /titles/{imdbId}` accepts valid IMDb title IDs and rejects invalid IDs with stable JSON `400` errors.
- Valid but unknown IMDb IDs return stable JSON `404` errors.
- Successful movie and TV series lookups return only the application-owned normalized schema.
- Normalized responses include the designed sections where data is available: title, type, overview, release, runtime, genres, rating, cast, crew, artwork, movie collection, and streaming providers.
- TMDB details are hidden behind the client and mapper boundary.
- Successful normalized responses are cached in Cloudflare KV under `title:{imdbId}:v1` with configurable freshness.
- `cache=refresh` skips cache reads and replaces cached successful values; `cache=bypass` skips cache reads and writes; production access to these modes is restricted.
- Upstream errors are not cached and are returned as stable JSON failures without exposing raw TMDB details.
- Worker configuration documents TMDB secret, KV binding, and local/development/production environments.
- Available API verification commands pass from the `api/` package.
