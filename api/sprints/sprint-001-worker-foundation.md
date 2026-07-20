# Sprint 001 — Worker Foundation

## Status

ready

## Outcome

A dedicated `api/` Cloudflare Worker package exists with TypeScript source, test tooling, package scripts, and a minimal JSON HTTP shell that can be built and tested locally.

## Why now

The current `api/` tree contains design/planning docs only. Later sprints need a real Worker package, source layout, and verification commands before behavior can be added safely.

## Source requirements

- Deployment: single Cloudflare Worker.
- External dependencies: Cloudflare Workers and Cloudflare KV.
- Implementation principles: stateless, simple, readable, small focused files.
- Error handling: consistent JSON errors and hidden implementation details.

## Starting context

- No API implementation, tests, `package.json`, `wrangler` config, or API package scripts currently exist.
- Website and scraper packages are unrelated and must not be modified for this sprint.

## Scope

### In scope

- Create the API package scaffold under `api/`.
- Add TypeScript configuration suitable for Cloudflare Workers.
- Add minimal Worker entrypoint with JSON responses for unsupported routes/methods.
- Add a small test setup for the Worker shell.
- Add package scripts for build/typecheck/test/format or lint, using only tools introduced by this package.
- Keep implementation intentionally thin; no TMDB or KV behavior yet.

### Out of scope

- `GET /titles/{imdbId}` business behavior.
- TMDB client, mapper, cache layer, KV binding, or deployment environments.
- Website/scraper changes.

## Technical guidance

- Prefer a direct source layout such as `api/src/index.ts` plus small support modules only when needed.
- Return JSON from the Worker; do not introduce HTML pages.
- Avoid framework routing dependencies unless they clearly reduce code and remain Workers-compatible.
- The initial shell may return stable `404`/`405` JSON errors, but detailed API error taxonomy belongs in Sprint 002.

## Expected file impact

- `api/package.json`
- `api/package-lock.json` or equivalent lockfile if the repo standardizes on one package manager
- `api/tsconfig.json`
- `api/src/**`
- `api/test/**` or `api/src/**/*.test.ts`
- Optional minimal tool config files under `api/`

## Implementation sequence

1. Inspect repo package-manager conventions before adding dependencies.
2. Create the minimal Worker package and TypeScript source layout.
3. Add scripts and dev dependencies needed for local build/typecheck/test.
4. Add a minimal Worker shell and one or two shell tests.
5. Run the new API verification commands and record exact results.

## Acceptance criteria

- [ ] `api/` has a standalone package with explicit scripts for API verification.
- [ ] The Worker entrypoint exports a Cloudflare Worker-compatible `fetch` handler.
- [ ] Unsupported routes/methods return JSON rather than throwing.
- [ ] Type checking and tests pass using the commands added in this sprint.
- [ ] No website or scraper files are modified.

## Required tests

- Worker responds with JSON for an unknown route.
- Worker handles at least one unsupported method or route deterministically.

## Verification commands

No API verification commands exist before this sprint because the API package has not been created yet. The SDE must add real package scripts in this sprint, run them from `api/`, and report the exact commands and output.

## Handoff

The SDE agent must report:

- summary of changes
- verification performed
- acceptance criteria status
- deviations from the sprint
- newly discovered risks or follow-up work

## Dependencies unlocked

- Sprint 002 route validation and stable error handling.
- Sprint 003 public schema and mapper tests.
- All later API implementation sprints.
