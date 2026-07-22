# Sprint 014 — CORS Origin Policy and Dev Access

## Status

complete

## Outcome

The Worker returns correct CORS headers for Ohana's deployed domains and Alex's LAN/Vite dev origin, with the allowlist behavior tested and documented.

## Why now

GitHub issue [#17](https://github.com/greg-26/static/issues/17) reports that the deployed API works from `https://ohana-tv.pages.dev` but browser calls fail from `100.85.92.106:5173`, and should also work from `ohana.tv`. The API already has CORS helpers and configurable allowed origins, so the next safest step is a focused hardening/config sprint.

## Source requirements

- `api/docs/design.md`: public `GET /titles/{imdbId}` API, stable errors, Cloudflare Worker deployment, simple serverless config.
- `api/README.md`: `CORS_ALLOWED_ORIGINS` is an optional comma-separated browser origin list; matching origins are echoed in CORS responses.
- GitHub issue #17: allow browser access from `https://ohana-tv.pages.dev`, `http://100.85.92.106:5173`, and `https://ohana.tv`.

## Starting context

The SDE agent may assume:

- Sprints 001-013 are complete.
- `api/src/index.ts` already wraps responses in CORS headers.
- `api/wrangler.toml` already configures `CORS_ALLOWED_ORIGINS` for local, development, and production.
- `api/test/worker-shell.test.ts` already includes one CORS preflight test.

## Scope

### In scope

- Normalize and document the exact browser origins required by issue #17, including scheme and port.
- Update `CORS_ALLOWED_ORIGINS` config so the relevant deployed Worker environment allows:
  - `https://ohana-tv.pages.dev`
  - `https://ohana.tv`
  - `https://www.ohana.tv`
  - `http://100.85.92.106:5173`
- Harden CORS header behavior if needed so allowed origins are echoed only when they match the incoming `Origin`.
- Ensure disallowed origins do not receive a misleading allow-origin value from a configured allowlist.
- Ensure `OPTIONS` preflight and normal `GET`/error responses apply the same policy.
- Add/update unit tests for allowed origin, disallowed origin, no configured origins/public wildcard, and preflight behavior.
- Update API README/config notes with the allowlist maintenance rule.
- Comment on issue #17 with the sprint mapping and later implementation evidence; do not close it until implementation and deployment evidence exist.

### Out of scope

- Changing API routes, title lookup behavior, cache behavior, TMDB client behavior, or response schema.
- Adding authentication.
- Adding dynamic origin reflection without an explicit allowlist.
- Deploying manually unless Alex explicitly asks or the existing push workflow handles deployment.
- Closing issue #17 before verified implementation evidence exists.

## Technical guidance

- CORS origins are exact strings: scheme + host + optional port. `100.85.92.106:5173` in the issue should be treated as `http://100.85.92.106:5173` unless proven otherwise.
- Because this is a read-only public API, CORS is primarily browser compatibility. Do not present it as a security boundary.
- When `CORS_ALLOWED_ORIGINS` is empty, preserving `Access-Control-Allow-Origin: *` is acceptable for the public read-only API.
- When `CORS_ALLOWED_ORIGINS` is non-empty and an incoming `Origin` is not listed, prefer omitting `Access-Control-Allow-Origin` over returning the first configured origin.
- Keep `Vary: Origin` on responses affected by origin-specific CORS.
- Keep `Access-Control-Allow-Methods` limited to `GET, OPTIONS`.
- Keep allowed request headers minimal: `accept, content-type` unless tests reveal the frontend sends another necessary non-sensitive header.

## Expected file impact

Likely files:

- `api/src/index.ts`
- `api/test/worker-shell.test.ts`
- `api/wrangler.toml`
- `api/README.md`
- Possibly this sprint file for implementation notes/status only.

## Implementation sequence

1. Reproduce/inspect current CORS behavior with tests before changing logic.
2. Add failing tests for issue #17 origins and disallowed-origin behavior.
3. Adjust `allowedCorsOrigin`/`withCors` behavior with the smallest change that satisfies the tests.
4. Update `wrangler.toml` allowlists for the selected deployed environment(s).
5. Update README CORS documentation with exact-origin examples.
6. Run verification commands.
7. Add concise issue #17 evidence comment after changes are pushed/deployed or note that deployment evidence remains pending.

## Acceptance criteria

- [ ] `Origin: https://ohana-tv.pages.dev` receives `Access-Control-Allow-Origin: https://ohana-tv.pages.dev` when configured.
- [ ] `Origin: https://ohana.tv` receives `Access-Control-Allow-Origin: https://ohana.tv` when configured.
- [ ] `Origin: https://www.ohana.tv` receives `Access-Control-Allow-Origin: https://www.ohana.tv` when configured.
- [ ] `Origin: http://100.85.92.106:5173` receives `Access-Control-Allow-Origin: http://100.85.92.106:5173` in the environment intended for Alex's local browser testing.
- [ ] A disallowed `Origin` does not receive a bogus first configured origin as `Access-Control-Allow-Origin`.
- [ ] `OPTIONS` preflight and `GET` responses use the same allowlist outcome.
- [ ] README documents exact-origin allowlist maintenance.
- [ ] Required behavior is covered by tests without live TMDB or production Cloudflare resources.

## Required tests

- Allowed configured origin on successful `GET`.
- Allowed configured origin on `OPTIONS` preflight.
- Allowed configured origin on API error response.
- Disallowed origin when an allowlist is configured.
- Public wildcard behavior when no allowlist is configured.
- Config parsing with comma-separated origins and whitespace.

## Verification commands

Run from `api/`:

```sh
npm run typecheck
npm test
npm run wrangler:dry-run
```

Run from repo root:

```sh
git diff --check
```

## Handoff

### 2026-07-22 implementation handoff

- Result: complete; deployment/browser evidence remains pending before issue #17 closure.
- CORS logic now echoes an allowed request `Origin`, returns `*` only when no allowlist is configured, and omits `Access-Control-Allow-Origin` for disallowed origins when an allowlist exists.
- `wrangler.toml` allowlists `https://ohana-tv.pages.dev`, `https://ohana.tv`, `https://www.ohana.tv`, and `http://100.85.92.106:5173` for development and production; local also keeps `http://localhost:5173`.
- README documents exact-origin allowlist maintenance and the LAN/Vite origin scheme normalization.
- Tests cover allowed GET, preflight, API error, disallowed origin, public wildcard, and comma/whitespace origin parsing.
- Verification passed: `npm run typecheck`, `npm test`, `npm run wrangler:dry-run`, and `git diff --check`.

The SDE agent must report:

- summary of CORS logic/config/docs changes
- exact origins verified
- verification performed
- acceptance criteria status
- deployment or pending-deployment evidence
- deviations from the sprint
- newly discovered risks or follow-up work

## Dependencies unlocked

- Issue #17 can be closed after implementation, deployment, and browser/API evidence confirm the listed origins work.
