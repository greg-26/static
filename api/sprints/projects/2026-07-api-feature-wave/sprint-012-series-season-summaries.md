# Sprint 012 — Series Season Summaries

## Status

ready

## GitHub issues

- [#5 — api - season details](https://github.com/greg-26/static/issues/5)

## Outcome

Series responses include season count and normalized season summaries with stable IDs/key details sufficient for CX season-list rendering.

## Why now

The initial API intentionally used series-level data and did not expose seasons. CX now needs season-list data. This is independent from movie collections but should reuse Sprint 010 localization/cache behavior.

## Source requirements

- Issue #5 asks for number of seasons and IDs/key details of each season.
- `api/AGENTS.md` says series cast must represent the overall series, not latest season/latest episode/one season.
- `api/docs/design.md` says seasons are not collections and public contracts remain application-owned.

## Starting context

- Sprint 010 has established localized request context and cache-key rules.
- Current series mapper already handles series-level metadata/cast/crew and must keep that behavior.

## Scope

### In scope

- Extend the public series model with season count and `seasons` summaries.
- Include stable season identifiers and display details such as season number, name, overview, episode count, air date/year, and poster where available.
- Exclude specials only if product/fixture behavior clearly supports that; otherwise include TMDB seasons as normalized summaries and document the choice.
- Preserve series-level cast/crew aggregation; do not replace it with season-level credits.
- Add mapper/client/service tests for normal seasons, missing optional season fields, and non-series/movie behavior.
- Document the season response shape in `api/README.md` if examples/spec sections exist there.

### Out of scope

- Episode lists/details.
- Per-season endpoint.
- Season-level cast/credits.
- Treating seasons as movie collections.
- Website/CX rendering work.

## Technical guidance

- Prefer a bounded public shape such as `seasonCount` and `seasons[]` with `id`, `seasonNumber`, `name`, `episodeCount`, `airDate`, `year`, `overview`, and `poster`.
- Use app-owned names; do not leak TMDB `season_number`, `episode_count`, or raw poster path fields.
- Keep movie responses stable; if the public TypeScript union requires a field on movies, use `seasons: null` or avoid the field according to existing conventions.
- Ensure cache variance from Sprint 010 applies because season names/overviews can be localized.

## Expected file impact

- `api/src/models/**` public title/series types.
- `api/src/tmdb/**` raw series detail types and mapper.
- Series fixtures and mapper/service tests.
- `api/README.md` and maybe `api/docs/design.md`.

## Implementation sequence

1. Inspect current public series model and TMDB series fixture shape.
2. Define the minimal public season summary schema.
3. Extend raw series detail typing and fixtures for season summaries.
4. Map season summaries without disturbing series-level cast/crew.
5. Add tests for series seasons, missing optional fields, and movie non-season behavior.
6. Update docs/examples.
7. Run verification commands.

## Acceptance criteria

- [ ] Series responses include season count.
- [ ] Series responses include normalized season summaries with stable IDs/key details.
- [ ] Missing season optional fields are handled safely.
- [ ] Series cast/crew remains series-level, not season-derived.
- [ ] Movie responses do not expose seasons as collections.
- [ ] Tests cover season mapping and partial data.
- [ ] API typecheck, tests, Wrangler dry-run, and `git diff --check` pass.

## Required tests

- Series fixture maps multiple season summaries.
- Season summary missing poster/overview/air date remains stable.
- Series-level cast/crew fixture expectations remain unchanged.
- Movie fixture has no season summaries or uses documented null/absence behavior.
- Localized request context does not break season data mapping.

## Verification commands

```sh
cd api
npm run typecheck
npm test
npm run wrangler:dry-run
cd ..
git diff --check
```

## Handoff

The SDE agent must report:

- final public season summary schema
- issue #5 acceptance criteria status
- handling of specials/missing fields if encountered
- tests added/updated
- verification output

## Dependencies unlocked

- Sprint 013 can verify all feature-wave response additions together.
