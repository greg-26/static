# Sprint 007 — Wrangler Environments

## Status

proposed

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
- Define local/development/production environment placeholders or documented variables for TMDB secret, KV namespace binding, cache TTL, and any CORS allowlist chosen for deployment.
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
3. Wire KV binding and config variable names expected by code.
4. Document secret setup and local/development/production expectations.
5. Add or run available non-deploying Worker validation command.
6. Run existing API verification scripts.

## Acceptance criteria

- [ ] Wrangler config points at the API Worker entrypoint.
- [ ] KV binding name matches the cache implementation.
- [ ] TMDB API key is documented as a secret and is not committed.
- [ ] Local/development/production environment inputs are documented.
- [ ] Verification does not require production Cloudflare resources or live TMDB.

## Required tests

- Existing unit/integration tests continue passing.
- Any available Wrangler config/build validation passes without deploying.
- Documentation is inspected for secret-safety and environment completeness.

## Verification commands

Use the real API package scripts introduced by Sprint 001 and any Wrangler validation script that exists after this sprint adds Wrangler config. At planning time those commands do not exist yet, so the SDE must inspect `api/package.json`, run the relevant scripts from `api/`, and report the exact commands.

## Handoff

The SDE agent must report:

- summary of changes
- verification performed
- acceptance criteria status
- deviations from the sprint
- newly discovered risks or follow-up work

## Dependencies unlocked

- Sprint 008 can perform final design closure against a deployable Worker package.
