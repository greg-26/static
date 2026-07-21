# Sprint 007 — Wrangler Environments

## Status

complete

## Outcome

The API Worker has Wrangler configuration, typed bindings, environment-specific settings, and documentation for local, development, and production deployment inputs.

## Why now

The Worker behavior and KV cache should exist before binding real Cloudflare configuration. This sprint makes deployment reproducible without changing product behavior.

## Source requirements

- Deployment: single Cloudflare Worker.
- Configuration through Wrangler.
- Secrets: TMDB API key.
- Bindings: KV namespace.
- Environments: local, development, production.
- External dependencies: Cloudflare Workers and Cloudflare KV.

## Starting context

- Sprint 006 added cache behavior and required environment/config inputs.
- The repo may not yet have real Cloudflare account resources available locally; do not require production credentials for tests.

## Scope

### In scope

- Add `wrangler` configuration for the API Worker.
- Define local/development/production environment placeholders or documented variables for TMDB secret, KV namespace binding, cache TTL, cache-override guard, and any CORS allowlist chosen for deployment.
- Ensure Worker binding types match implementation expectations.
- Document local setup and deployment prerequisites in `api/` docs or README.
- Add a non-deploying build/dry-run style verification if supported by the chosen tooling.

### Out of scope

- Creating production KV namespaces or setting real secrets unless explicitly requested separately.
- Deploying the Worker.
- Changing website deployment.
- Adding new endpoints or cache controls.

## Technical guidance

- Never commit real secrets.
- Prefer explicit environment names and binding names over clever config indirection.
- Keep local development safe: tests must not touch production KV or require live TMDB.
- If production CORS origins are still unknown, document the placeholder and keep the open question in `index.md`.

## Expected file impact

- `api/wrangler.toml` or `api/wrangler.jsonc`
- `api/README.md` or deployment docs
- `api/src` environment binding types if not already present
- Package script updates only if they are real and verified

## Implementation sequence

1. Inspect existing API package scripts/tooling from Sprint 001.
2. Add Wrangler configuration for the Worker entrypoint and environments.
3. Wire KV binding, cache TTL, cache-override guard, and config variable names expected by code.
4. Document secret setup and local/development/production expectations.
5. Add or run available non-deploying Worker validation command.
6. Run existing API verification scripts.

## Acceptance criteria

- [x] Wrangler config points at the API Worker entrypoint.
- [x] KV binding name matches the cache implementation.
- [x] TMDB API key is documented as a secret and is not committed.
- [x] Local/development/production environment inputs are documented.
- [x] Verification does not require production Cloudflare resources or live TMDB.

## Required tests

- Existing unit/integration tests continue passing.
- Any available Wrangler config/build validation passes without deploying.
- Documentation is inspected for secret-safety and environment completeness.

## Verification commands

Run from `api/`:

```sh
npm run typecheck
npm test
```

If this sprint adds a Wrangler validation/build script, run that script too and report the exact command.

## Handoff

The SDE agent must report:

- summary of changes
- verification performed
- acceptance criteria status
- deviations from the sprint
- newly discovered risks or follow-up work

Completed in implementation run on 2026-07-21.

- Added `wrangler.toml` for the API Worker entrypoint, local/development/production environment variables, and `TITLE_CACHE` KV binding placeholders.
- Added `wrangler` as a development dependency and `npm run wrangler:dry-run` for non-deploying Worker bundle/config validation.
- Documented local setup, deployment prerequisites, TMDB secret handling, KV namespace replacement, cache controls, and environment inputs in `README.md`.
- Added `CORS_ALLOWED_ORIGINS` to the typed environment shape as a documented deployment input; CORS enforcement remains a known production hardening question for Sprint 008.
- Verification: `npm run typecheck` passed; `npm test` passed with 44 tests; `npm run wrangler:dry-run` passed without deploying.
- Deviations: placeholder KV namespace IDs and placeholder CORS origins are documented because real Cloudflare resources/origins were out of scope.

## Dependencies unlocked

- Sprint 008 can perform final design closure against a deployable Worker package.
