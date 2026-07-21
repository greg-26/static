# API Sprint Projects Index

## Status

- Current planning status: new API feature-wave project created for GitHub issues whose titles start with `api -`.
- Current implementation phase: initial API implementation is complete and archived; next work is feature expansion for localization, collection details, and season details.
- Current project: [2026-07 API Feature Wave](projects/2026-07-api-feature-wave/INDEX.md).
- Archived/previous project: [2026-07 Initial API Implementation](archive/2026-07-initial-api-implementation/index.md).
- Latest planning revision date: 2026-07-21.

## Projects

| Project | Scope | Status | Location |
|---|---|---|---|
| 2026-07 Initial API Implementation | Worker foundation through deployment automation, Sprints 001-009. | archived / complete | [`archive/2026-07-initial-api-implementation/`](archive/2026-07-initial-api-implementation/) |
| 2026-07 API Feature Wave | GitHub issues #3 localization, #4 collection details, and #5 season details. | current / ready | [`projects/2026-07-api-feature-wave/`](projects/2026-07-api-feature-wave/) |

## Current roadmap

| Sprint | Outcome | Status | Depends on |
|---|---|---|---|
| [010](projects/2026-07-api-feature-wave/sprint-010-localization-and-provider-region.md) | `GET /titles/{imdbId}` accepts `lang` and `country`, returns localized title metadata/provider country data, and documents the query contract. | complete | initial API implementation |
| [011](projects/2026-07-api-feature-wave/sprint-011-collection-items.md) | Movie collection responses include enough normalized collection item details to render the collection list, especially item IMDb IDs. | complete | 010 |
| [012](projects/2026-07-api-feature-wave/sprint-012-series-season-summaries.md) | Series responses include season count and normalized season summaries with stable IDs/key details for CX season lists. | ready | 010 |
| [013](projects/2026-07-api-feature-wave/sprint-013-feature-wave-closure.md) | README/specs, tests, deployed behavior, and issue handoff evidence are checked across the feature wave. | proposed | 010, 011, 012 |

## Decisions and assumptions

- Decision: Archive the completed initial implementation under `api/sprints/archive/2026-07-initial-api-implementation/` and keep new feature-wave planning under `api/sprints/projects/2026-07-api-feature-wave/`.
  - Rationale: Alex explicitly asked for a new sprint folder and the old sprint set moved into its own folder, not mixed with the new plan.
  - Affected sprints: all API planning docs.
  - Status: accepted.
- Decision: Continue sprint numbering from 010 rather than restarting at 001 inside the new project.
  - Rationale: The API codebase has completed Sprints 001-009; continuing numbers preserves chronology while the folder boundary separates projects.
  - Affected sprints: 010-013.
  - Status: accepted.
- Decision: Treat `lang` and `country` as cache-varying request inputs.
  - Rationale: Localized metadata and provider availability can change the successful response body; cache keys must not mix languages or regions.
  - Affected sprints: 010-013.
  - Status: accepted.
- Assumption: Default requests without `lang` or `country` keep the current response shape and behavior as much as possible.
  - Rationale: The deployed API already has clients/tests around `GET /titles/{imdbId}`; feature work should be additive unless the issue explicitly requires a break.
  - Affected sprints: 010-013.
  - Status: provisional.

## Open questions

- Should absent `country` return all TMDB provider countries or a default country only?
  - Recommended default: return the current/default provider shape when absent; when `country` is provided, return that country only while keeping the `streamingProviders` shape consistent.
  - Blocks: no; Sprint 010 can implement the recommended default unless product says otherwise.
- Should localized cache keys use ISO-normalized lowercase/uppercase values?
  - Recommended default: normalize language to lowercase BCP-47-ish strings accepted by TMDB and country to uppercase ISO 3166-1 alpha-2 before validation/cache key construction.
  - Blocks: no.

## Completion criteria for the current project

The API feature wave is complete when:

- Issue [#3](https://github.com/greg-26/static/issues/3) is satisfied: README documents `lang` and `country`, localized requests are verified, and changes are pushed by the SDE implementation agent.
- Issue [#4](https://github.com/greg-26/static/issues/4) is satisfied: movie collection payloads include normalized collection items with at least IMDb IDs where TMDB can resolve them.
- Issue [#5](https://github.com/greg-26/static/issues/5) is satisfied: series payloads include season count and normalized season summaries with stable IDs/key details.
- New behavior is covered by unit/integration tests without live TMDB or production Cloudflare resources.
- API README and relevant design/planning docs describe the shipped query params and response additions.
- `npm run typecheck`, `npm test`, `npm run wrangler:dry-run`, and `git diff --check` pass before push/deployment.
