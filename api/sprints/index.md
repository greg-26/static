# API Sprint Projects Index

## Status

- Current planning status: new API CORS access project created for open GitHub issue [#17](https://github.com/greg-26/static/issues/17), titled `API - cors?`.
- Current implementation phase: initial API implementation is complete and archived; the 2026-07 feature wave for localization, collection details, and season details is complete; CORS access work is ready.
- Current project: [2026-07 API CORS Access](projects/2026-07-api-cors-access/INDEX.md).
- Previous completed project: [2026-07 API Feature Wave](projects/2026-07-api-feature-wave/INDEX.md).
- Archived/previous project: [2026-07 Initial API Implementation](archive/2026-07-initial-api-implementation/index.md).
- Next executable sprint: [014 — CORS Origin Policy and Dev Access](projects/2026-07-api-cors-access/sprint-014-cors-origin-policy-and-dev-access.md).
- Latest planning revision date: 2026-07-22.

## Projects

| Project | Scope | Status | Location |
|---|---|---|---|
| 2026-07 Initial API Implementation | Worker foundation through deployment automation, Sprints 001-009. | archived / complete | [`archive/2026-07-initial-api-implementation/`](archive/2026-07-initial-api-implementation/) |
| 2026-07 API Feature Wave | GitHub issues #3 localization, #4 collection details, and #5 season details, Sprints 010-013. | complete | [`projects/2026-07-api-feature-wave/`](projects/2026-07-api-feature-wave/) |
| 2026-07 API CORS Access | GitHub issue #17 CORS access from Ohana and Alex's local browser origins, Sprint 014. | active / ready | [`projects/2026-07-api-cors-access/`](projects/2026-07-api-cors-access/) |

## Current roadmap

| Sprint | Outcome | Status | Depends on |
|---|---|---|---|
| [010](projects/2026-07-api-feature-wave/sprint-010-localization-and-provider-region.md) | `GET /titles/{imdbId}` accepts `lang` and `country`, returns localized title metadata/provider country data, and documents the query contract. | complete | initial API implementation |
| [011](projects/2026-07-api-feature-wave/sprint-011-collection-items.md) | Movie collection responses include enough normalized collection item details to render the collection list, especially item IMDb IDs. | complete | 010 |
| [012](projects/2026-07-api-feature-wave/sprint-012-series-season-summaries.md) | Series responses include season count and normalized season summaries with stable IDs/key details for CX season lists. | complete | 010 |
| [013](projects/2026-07-api-feature-wave/sprint-013-feature-wave-closure.md) | README/specs, tests, deployed behavior, and issue handoff evidence are checked across the feature wave. | complete | 010, 011, 012 |
| [014](projects/2026-07-api-cors-access/sprint-014-cors-origin-policy-and-dev-access.md) | Ohana deployed domains and Alex's LAN/Vite dev origin receive correct matching CORS headers, with allowlist behavior tested and documented. | ready | 013 |

## Open API issue mapping

| Issue | Coverage | Status |
|---|---|---|
| [#17 API - cors?](https://github.com/greg-26/static/issues/17) | Covered by Sprint 014. | planned / ready |

## Non-API issue notes

- [#14 Website - movie details](https://github.com/greg-26/static/issues/14) asks for cast profile photos and says to create an API dependency if unavailable. Current API schema already exposes `cast[].profile`, so no API sprint is planned unless frontend implementation finds missing image data.
- Open issues #7, #13, #15, and #16 are website/CX scoped and are not planned in the API sprint set.

## Decisions and assumptions

- Decision: Archive the completed initial implementation under `api/sprints/archive/2026-07-initial-api-implementation/` and keep later issue-driven planning under `api/sprints/projects/`.
  - Rationale: Alex asked for old sprint plans to be separated from active work, and completed sprint history should remain intact.
  - Affected sprints: all API planning docs.
  - Status: accepted.
- Decision: Continue sprint numbering from 014 for the CORS access project rather than restarting at 001 inside the new project.
  - Rationale: The API codebase has completed Sprints 001-013; continuing numbers preserves chronology while project folders separate issue waves.
  - Affected sprints: 014.
  - Status: accepted.
- Decision: Treat issue #17 as CORS/config hardening only.
  - Rationale: Current code already has a public read-only API and CORS helpers; the issue is browser access from specific origins, not an API contract expansion.
  - Affected sprints: 014.
  - Status: accepted.
- Assumption: `100.85.92.106:5173` means `http://100.85.92.106:5173` for CORS allowlist purposes.
  - Rationale: CORS origins require a scheme, and Vite dev servers normally run over HTTP.
  - Affected sprints: 014.
  - Status: provisional.

## Open questions

- Should the LAN/Tailscale dev origin be allowed in production Worker config or development-only config?
  - Recommended default: include `http://100.85.92.106:5173` in the deployed environment Alex is using for browser testing; if uncertain, include it in both development and production because this read-only API's CORS policy is not authentication.
  - Blocks: no; Sprint 014 can implement the recommended default.

## Completion criteria for the current project

The API CORS access project is complete when:

- Issue [#17](https://github.com/greg-26/static/issues/17) is satisfied for browser calls from `https://ohana-tv.pages.dev`, `https://ohana.tv`, `https://www.ohana.tv`, and `http://100.85.92.106:5173`.
- Allowed origins receive an `Access-Control-Allow-Origin` value matching the request `Origin` on `GET`, API error, and `OPTIONS` preflight responses.
- Disallowed origins do not receive a misleading configured origin in `Access-Control-Allow-Origin`.
- API README and Wrangler config document the exact-origin allowlist behavior.
- New behavior is covered by tests without live TMDB or production Cloudflare resources.
- `npm run typecheck`, `npm test`, `npm run wrangler:dry-run`, and `git diff --check` pass before issue closure/deployment evidence.
