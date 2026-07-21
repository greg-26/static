# 2026-07 API Feature Wave

## Status

- Current planning status: ready for SDE implementation.
- Scope source: GitHub issues [#3](https://github.com/greg-26/static/issues/3), [#4](https://github.com/greg-26/static/issues/4), and [#5](https://github.com/greg-26/static/issues/5), all titled `api - ...`.
- Starting point: the initial API implementation and deployment automation are complete in archived Sprints 001-009.
- Next executable sprint: [Sprint 013 — Feature Wave Closure](sprint-013-feature-wave-closure.md).
- Latest planning revision date: 2026-07-21.

## Roadmap

| Sprint | GitHub issue(s) | Outcome | Status | Depends on |
|---|---|---|---|---|
| [010](sprint-010-localization-and-provider-region.md) | [#3](https://github.com/greg-26/static/issues/3) | `lang` and `country` query params are supported, documented, tested, and cache-safe. | complete | initial API implementation |
| [011](sprint-011-collection-items.md) | [#4](https://github.com/greg-26/static/issues/4) | Movie collection responses include normalized collection item summaries with IMDb IDs when available. | complete | 010 |
| [012](sprint-012-series-season-summaries.md) | [#5](https://github.com/greg-26/static/issues/5) | Series responses include season count and normalized season summaries. | complete | 010 |
| [013](sprint-013-feature-wave-closure.md) | [#3](https://github.com/greg-26/static/issues/3), [#4](https://github.com/greg-26/static/issues/4), [#5](https://github.com/greg-26/static/issues/5) | Cross-feature docs, deployed verification, and issue handoff evidence are complete. | ready | 010, 011, 012 |

## SDE handoff rules

- Implement exactly one sprint per run unless Alex explicitly asks otherwise.
- Do not rewrite archived Sprints 001-009; use them as history only.
- Keep TMDB-specific fields behind the client/mapper boundary.
- Preserve backward compatibility for `GET /titles/{imdbId}` without query params unless a sprint explicitly says otherwise.
- Include tests for cache-key variance whenever a new request input can alter the response.
- Before closing or pushing issue work, follow `website/docs/working-style.md` issue workflow if relevant: comment with evidence, close when satisfied, never delete issues.

## Shared verification commands

Run from `api/` unless noted:

```sh
npm run typecheck
npm test
npm run wrangler:dry-run
```

Run from repo root for markdown/move hygiene:

```sh
git diff --check
```

## Risks / blockers

- TMDB may not provide IMDb IDs directly for every collection part without extra external-ID calls. The implementation should return IMDb IDs where resolvable and clearly test/null-handle unresolved parts.
- Provider availability is region-specific. Cache keys must include normalized `country` when country changes the provider payload.
- Localization may affect titles, overviews, collection names, season names, and provider data differently. Sprint 010 should define the first stable contract and later sprints should reuse it.
