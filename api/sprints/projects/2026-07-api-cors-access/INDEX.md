# 2026-07 API CORS Access

## Status

- Current planning status: ready.
- Scope source: GitHub issue [#17](https://github.com/greg-26/static/issues/17), titled `API - cors?`.
- Starting point: initial API implementation and the 2026-07 feature wave are complete; current Worker already has CORS response helpers and `CORS_ALLOWED_ORIGINS` config.
- Next executable sprint: [014 — CORS origin policy and dev access](sprint-014-cors-origin-policy-and-dev-access.md).
- Latest planning revision date: 2026-07-22.

## Roadmap

| Sprint | GitHub issue(s) | Outcome | Status | Depends on |
|---|---|---|---|---|
| [014](sprint-014-cors-origin-policy-and-dev-access.md) | [#17](https://github.com/greg-26/static/issues/17) | Browser calls from Ohana production domains and Alex's LAN/Vite dev origin receive matching CORS headers, with tests and docs covering the allowlist contract. | ready | completed initial API + feature wave |

## SDE handoff rules

- Implement exactly one sprint per run unless Alex explicitly asks otherwise.
- Do not rewrite archived Sprints 001-013; use them as history only.
- Keep this as CORS/config work only. Do not change title lookup, cache, TMDB mapping, or public response fields.
- Treat the API as public read-only: CORS is browser access control, not authentication.
- Before closing issue work, follow `website/docs/working-style.md`: comment with evidence, close only when satisfied, never delete issues.

## Shared verification commands

Run from `api/` unless noted:

```sh
npm run typecheck
npm test
npm run wrangler:dry-run
```

Run from repo root:

```sh
git diff --check
```

## Decisions and assumptions

- Decision: Plan issue #17 as one focused API sprint rather than folding it into the completed feature wave.
  - Rationale: The feature wave is complete and archived as a coherent issue set; CORS is independent browser-access/config work.
  - Affected sprints: 014.
  - Status: accepted.
- Decision: Production should explicitly allow `https://ohana-tv.pages.dev`, `https://ohana.tv`, and `https://www.ohana.tv`.
  - Rationale: These are the deployed/static Ohana origins referenced by config and issue #17.
  - Affected sprints: 014.
  - Status: accepted.
- Assumption: `100.85.92.106:5173` means the browser origin `http://100.85.92.106:5173` unless Alex says it is served over HTTPS.
  - Rationale: Vite dev servers normally run over HTTP and CORS origins include scheme, host, and port.
  - Affected sprints: 014.
  - Status: provisional.

## Open questions

- Should the LAN/Tailscale dev origin be allowed in production Worker config or development-only config?
  - Recommended default: include `http://100.85.92.106:5173` in the deployed environment Alex is using for the static site during local development; if uncertain, add it to both development and production because the endpoint is read-only and origin matching is not an auth boundary.
  - Blocks: no; Sprint 014 can implement the recommended default and document the tradeoff.

## Completion criteria for the current project

The API CORS access project is complete when:

- Issue [#17](https://github.com/greg-26/static/issues/17) is satisfied for browser calls from `https://ohana-tv.pages.dev`, `https://ohana.tv`, `https://www.ohana.tv`, and `http://100.85.92.106:5173`.
- Allowed browser origins receive an `Access-Control-Allow-Origin` value matching the request `Origin`.
- Disallowed origins do not receive a misleading allowed-origin echo.
- `OPTIONS` preflight and normal `GET` responses share the same CORS policy.
- README/wrangler docs describe how to maintain the allowlist.
- `npm run typecheck`, `npm test`, `npm run wrangler:dry-run`, and `git diff --check` pass before push/deployment.
