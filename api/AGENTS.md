# API Agent Instructions

## Purpose

This folder contains the Cloudflare Worker backend for the application.

The API is developed through two long-lived agent roles:

```text
Principal Engineer
  ↓ plans
api/sprints/index.md
api/sprints/sprint-*.md
  ↓ executed by
SDE Implementation Agent
```

The product and architecture source of truth is:

```text
docs/design.md
```

The execution plan lives in:

```text
sprints/index.md
sprints/sprint-*.md
```

## Agent roles

### Principal Engineer

Agent definition:

```text
agents/api-sprint-planner-agent.md
```

The Principal Engineer owns:

- decomposing `docs/design.md` into ordered sprints
- maintaining `sprints/index.md`
- creating and revising sprint files
- resolving planning and architectural questions
- reviewing whether completed work affects future sprints
- keeping the plan aligned with the repository and design

The Principal Engineer plans work but does not implement sprints unless explicitly asked.

### SDE Implementation Agent

Agent definition:

```text
agents/api-sprint-implementation-agent.md
```

The SDE agent owns:

- selecting the next executable sprint
- implementing exactly one sprint per run
- adding and updating tests
- running the required verification
- updating the selected sprint's status
- reporting deviations, risks, and completion evidence
- asking the Principal Engineer focused questions when a planning or architectural decision is required

The SDE agent must not silently redesign the plan or pull future sprint work forward.

## Role selection

Use the Principal Engineer role when asked to:

- create or revise the sprint roadmap
- split, merge, reorder, or scope sprints
- resolve ambiguity affecting multiple sprints
- review planning after a design change
- assess whether future sprints remain valid

Use the SDE Implementation Agent role when asked to:

- implement the next sprint
- continue API implementation
- complete a specific ready sprint
- verify and close an implemented sprint

When acting as either role, follow its dedicated agent definition in addition to this file.

## Sources of truth

Use these sources in this order:

1. The user's explicit request
2. `docs/design.md` for intended product and architecture behavior
3. `sprints/index.md` and the selected sprint file for execution scope
4. The repository for current implementation state
5. Existing tests and established code conventions

The repository is authoritative for what currently exists.

The design and sprint files are authoritative for what should be built.

When they conflict:

- do not guess silently
- preserve working behavior unless change is required
- record the discrepancy
- escalate to the Principal Engineer when it affects architecture, scope, or future sprints

## Shared engineering principles

Prioritize, in order:

1. Correctness
2. Simplicity
3. Readability
4. Maintainability
5. Performance

Prefer:

- explicit code
- small functions and focused files
- descriptive names
- composition over inheritance
- immutable data where practical
- stable, typed contracts
- clear error handling
- fewer dependencies

Avoid:

- giant functions
- hidden side effects
- unnecessary abstractions
- premature optimization
- speculative infrastructure
- provider-specific fields leaking into public contracts

If something feels over-engineered, simplify it.

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

## Public contracts

The backend owns the public API contract.

The frontend must never depend directly on TMDB models.

Always normalize external data into application-owned shared contracts.

Treat TMDB as an implementation detail.

## Cloudflare

Prefer Cloudflare-native services:

- Workers
- Workers KV
- Wrangler
- environment bindings
- Worker secrets

Do not introduce additional infrastructure unless the design requires it.

Use local Wrangler resources during development.

Never modify production KV from local tests or normal local development.

## Caching

Cache behavior must match `docs/design.md`.

Requirements:

- Cache keys must be deterministic and versioned.
- `cache=refresh` skips the cache read and replaces the cached value.
- `cache=bypass` skips cache reads and writes.
- Cache overrides must be restricted in production.
- A cache write failure must not fail an otherwise successful request.
- Normal requests may return stale data when TMDB is unavailable.
- Explicit refresh and bypass requests must not silently return stale data.

## External APIs

Treat TMDB as unreliable.

Assume:

- requests can time out
- fields can be `null`
- arrays can be empty
- optional data can be missing
- upstream responses can change
- individual optional resources can fail

Validate and normalize upstream responses.

Never expose raw upstream errors or payloads to clients.

## Movies and series

Movies and television series share one public lookup API.

Internally, they may use separate services and mappers.

Critical requirements:

- Series cast must represent the overall series.
- Do not use the latest season, latest episode, or one season as the main cast source.
- Use series-level aggregate credits where available.
- Preserve multiple roles and episode counts where available.
- Collections apply to movies.
- Seasons are not collections.
- Return collection artwork when available.
- Do not return title logos.

## Images

The Worker returns image metadata and direct CDN URLs.

It must not proxy or store normal image files.

Return, where available:

- primary poster
- primary backdrop
- limited alternative posters
- limited alternative backdrops
- collection poster and backdrop
- cast, creator, and director profile images
- provider logos needed to identify streaming services

Expose application-defined semantic image sizes rather than raw TMDB size codes.

## Errors and security

Return stable application error codes.

Never expose or log:

- stack traces
- secrets
- authorization headers
- raw TMDB responses
- internal implementation details

Prefer typed application errors over generic exceptions.

Validate:

- IMDb IDs
- language
- region
- cache mode
- HTTP method
- allowed origin

Do not add endpoints that mutate arbitrary cache data or proxy arbitrary URLs unless explicitly requested.

CORS is not authentication.

## Testing

Every meaningful behavior change should include tests where practical.

Prioritize business logic over HTTP plumbing.

Mock external services.

Tests must not require:

- internet access
- live TMDB access
- production Cloudflare resources
- production secrets

Important regression areas include:

- movie versus series resolution
- overall-series aggregate cast
- movie collections and artwork
- image ranking and limits
- cache hit, stale, refresh, and bypass behavior
- upstream timeouts and partial data
- cache write failures

The selected sprint determines which tests belong in the current implementation run.

## Dependencies

Before adding a dependency, ask:

- Can the platform already do this?
- Can it be implemented clearly in a few lines?
- Does the dependency materially improve the project?
- Is it compatible with Cloudflare Workers?

Prefer fewer dependencies.

## Performance and logging

Optimize for:

- few upstream requests
- high cache hit rate
- predictable latency
- small, useful response payloads

Prefer readability over micro-optimizations.

Use structured logs with useful context such as:

- request ID
- IMDb ID
- resolved media type
- cache mode and status
- HTTP status
- upstream latency
- request duration

Never log secrets, authorization headers, or full upstream payloads.

## Documentation and planning consistency

When behavior or architecture changes:

- update `docs/design.md` when the intended architecture changes
- update affected future sprint files when execution assumptions change
- keep comments concise
- document why, not what
- record intentional deviations instead of silently diverging

Completed sprint history should be preserved.

The design must remain an accurate description of the intended system, and the sprint plan must remain an accurate description of the remaining work.

## Before completing implementation work

Run the relevant available checks:

- formatting
- linting
- type checking
- unit tests
- integration tests
- Worker build or Wrangler dry run

Do not claim checks passed unless they were actually run.

The SDE handoff must summarize:

- what changed
- acceptance criteria status
- tests and checks run
- deviations from the sprint
- remaining limitations or risks
- questions for the Principal Engineer, when needed

## When in doubt

Choose the solution that:

- keeps the public API stable
- minimizes complexity
- follows `docs/design.md`
- stays within the selected sprint
- matches established repository patterns
- is easy for future engineers and fresh-context agents to understand
