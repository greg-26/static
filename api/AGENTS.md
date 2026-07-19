# API Agent Instructions

## Purpose

This folder contains the Cloudflare Worker backend for the application.

Your primary objective is to implement and maintain the architecture described in:

> `docs/design.md`

That document is the source of truth for the API design. If implementation details conflict with the design, follow the design unless the user explicitly requests otherwise.

## General principles

Prioritize, in order:

1. Correctness
2. Simplicity
3. Readability
4. Maintainability
5. Performance

Avoid clever solutions unless they clearly simplify the implementation.

Leave the codebase better than you found it.

## Architecture

Maintain clear separation of responsibilities:

```text
Router
  ↓
Handler
  ↓
Service
  ↓
Cache / TMDB Client
  ↓
Mapper
```

### Router

- Handle HTTP routing only.

### Handler

- Parse requests.
- Validate inputs.
- Call services.
- Convert results into HTTP responses.

### Service

- Own business logic.
- Orchestrate cache and upstream providers.
- Avoid HTTP-specific code.

### Cache

- Encapsulate Workers KV access.
- Own cache keys, envelopes, TTLs, and freshness behavior.
- Do not leak KV details into handlers or mappers.

### TMDB client

- Handle raw TMDB communication only.
- Add authentication and timeouts.
- Parse upstream responses.
- Do not contain business logic or public response mapping.

### Mapper

- Convert upstream models into application-owned models.
- Never expose raw TMDB responses outside the mapping layer.

## Source of truth

The frontend must never depend directly on TMDB models.

The backend owns the public API contract.

Always normalize external data into the shared application contracts.

Treat TMDB as an implementation detail.

## Design philosophy

Prefer:

- Explicit code
- Small functions
- Descriptive names
- Composition over inheritance
- Immutable data where practical
- Stable, typed contracts
- Clear error handling

Avoid:

- Giant functions
- Hidden side effects
- Unnecessary abstractions
- Premature optimization
- Provider-specific fields leaking into public contracts

## Cloudflare

Prefer Cloudflare-native services:

- Workers
- Workers KV
- Wrangler
- Environment bindings
- Worker secrets

Do not introduce additional infrastructure unless the design requires it.

Use local Wrangler resources during development. Never modify production KV from local tests or normal local development.

## Caching

The cache is an implementation detail.

Requirements:

- Cache keys must be deterministic and versioned.
- Cache behavior must match `docs/design.md`.
- `cache=refresh` skips the cache read and replaces the cached value.
- `cache=bypass` skips cache reads and writes.
- Cache overrides must be restricted in production.
- A cache write failure must not fail an otherwise successful request.
- Normal requests may return stale data when the upstream provider is unavailable.
- Explicit refresh and bypass requests must not silently return stale data.

## External APIs

Treat TMDB as unreliable.

Assume:

- Requests can time out.
- Fields can be `null`.
- Arrays can be empty.
- Optional data can be missing.
- Responses can change.
- Individual optional resources can fail.

Validate and normalize every upstream response.

Never expose raw upstream errors or payloads to clients.

## Movies and series

Movies and television series share one public lookup API.

Internally, they may use separate services and mappers.

Critical requirements:

- Series cast must represent the overall series.
- Do not use the latest season, latest episode, or a single season as the main series cast source.
- Use series-level aggregate credits where available.
- Preserve multiple roles and episode counts for series actors when available.
- Collections apply to movies.
- Seasons are not collections.
- Return collection artwork when available.
- Do not return title logos.

## Images

The API returns image metadata and direct image CDN URLs.

The Worker must not proxy or store normal image files.

Return:

- Primary poster
- Primary backdrop
- Limited alternative posters
- Limited alternative backdrops
- Collection poster and backdrop
- Cast, creator, and director profile images
- Provider logos where needed to identify streaming services

Expose application-defined semantic image sizes rather than requiring the frontend to understand raw TMDB size codes.

## Errors

Return stable application error codes.

Never expose:

- Stack traces
- Secrets
- Authorization headers
- Raw TMDB responses
- Internal implementation details

Prefer typed application errors over generic exceptions.

## Security

Never expose secrets.

Never trust request input.

Validate:

- IMDb IDs
- Language
- Region
- Cache mode
- HTTP method
- Allowed origin

Do not create endpoints that mutate arbitrary cache data or proxy arbitrary URLs unless explicitly requested.

CORS is not authentication.

## Testing

Every meaningful behavior change should include tests where practical.

Prioritize tests for business logic before HTTP plumbing.

Mock external services.

Tests must not require:

- Internet access
- Live TMDB access
- Production Cloudflare resources
- Production secrets

Include regression coverage for:

- Movie versus series resolution
- Overall-series aggregate cast
- Movie collections and collection artwork
- Image ranking and limits
- Cache hit, stale, refresh, and bypass behavior
- Upstream timeout and partial-data behavior
- Cache write failures

## Dependencies

Before adding a dependency, ask:

- Can the platform already do this?
- Can this be implemented clearly in a few lines?
- Does the dependency materially improve the project?
- Is it compatible with the Cloudflare Workers runtime?

Prefer fewer dependencies.

## Performance

Optimize for:

- Few upstream requests
- High cache hit rate
- Predictable latency
- Small, useful response payloads

Do not optimize prematurely.

Prefer readability over micro-optimizations.

## Logging

Use structured logs.

Include useful context such as:

- Request ID
- IMDb ID
- Resolved media type
- Cache mode and status
- HTTP status
- Upstream latency
- Request duration

Never log secrets, authorization headers, or full upstream payloads.

## Documentation

When behavior or architecture changes:

- Update `docs/design.md`.
- Keep comments concise.
- Document why, not what.
- Record intentional deviations from the design rather than silently diverging.

The design document must remain an accurate description of the implemented system.

## Before completing work

Run the relevant available checks:

- Formatting
- Linting
- Type checking
- Unit tests
- Integration tests
- Worker build or Wrangler dry run

Do not claim checks passed unless they were actually run.

Summarize:

- What changed
- Any design decisions made
- Tests or checks run
- Remaining limitations or follow-up work

## When in doubt

Choose the solution that:

- Keeps the public API stable
- Minimizes complexity
- Follows `docs/design.md`
- Is easy for future engineers and agents to understand
