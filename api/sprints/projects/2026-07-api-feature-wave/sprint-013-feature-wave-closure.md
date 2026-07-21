# Sprint 013 — Feature Wave Closure

## Status

complete

## GitHub issues

- [#3 — api - localization](https://github.com/greg-26/static/issues/3)
- [#4 — api - collections details](https://github.com/greg-26/static/issues/4)
- [#5 — api - season details](https://github.com/greg-26/static/issues/5)

## Outcome

The feature wave is verified as a coherent API release: docs match implementation, tests cover the new public contract, deployed behavior is checked after push/deploy, and GitHub issues have closure-ready evidence.

## Why now

Localization, collection items, and seasons interact through response shape, TMDB request context, and cache keys. A short closure sprint catches cross-feature drift without mixing implementation details into each feature sprint.

## Source requirements

- Issue #3 explicitly asks to verify, commit, and push.
- Repo working style requires issue comments/evidence before closure when automation closes issues.
- `api/AGENTS.md` requires sprint plans and docs to stay accurate.

## Starting context

- Sprints 010-012 are complete or ready for closure review.
- GitHub Actions deploys API changes on `origin/main` when `api/**` changes are pushed.

## Scope

### In scope

- Audit `api/README.md` and `api/docs/design.md` against implemented query params and response additions.
- Ensure feature-wave sprint files and indexes reflect actual status/evidence.
- Run full local API verification.
- If changes have been pushed and deployment ran, verify representative deployed requests for default, localized/country, collection, and series-season cases.
- Prepare or add GitHub issue comments with concise evidence before closure if Alex/SDE workflow requires closing.

### Out of scope

- New product features.
- Website/CX integration.
- Custom API domains.
- Broad refactors not needed for closure.

## Acceptance criteria

- [x] README documents `lang`, `country`, collection items, and season summaries accurately.
- [x] Tests cover combined cache/localization behavior for the new response additions.
- [x] Local verification passes.
- [x] Deployed verification is recorded when available, or a clear blocker explains why not.
- [x] GitHub issues #3, #4, and #5 have closure-ready evidence.

## Verification commands

```sh
cd api
npm run typecheck
npm test
npm run wrangler:dry-run
cd ..
git diff --check
```

After deployment, representative checks should include:

```sh
curl -i "$OHANA_API_BASE_URL/titles/tt0088247?lang=es&country=ES"
curl -i "$OHANA_API_BASE_URL/titles/<movie-with-collection-imdb-id>"
curl -i "$OHANA_API_BASE_URL/titles/<series-imdb-id>?lang=es"
```

## Handoff

Completed 2026-07-21 by SDE closure agent.

Docs audited/changed:

- `api/README.md` already documented `lang`, `country`, cache variance, collection item summaries, and series season summaries accurately.
- `api/docs/design.md` already documented the public contract; updated the future-enhancements list so localized metadata is no longer described as only future work.
- Project indexes updated to mark the feature wave complete.

Tests added/updated:

- Added title lookup service coverage proving localized collection item payloads use localized cache variants and do not reuse default cached bodies.
- Added title lookup service coverage proving localized series season summaries are fetched and cached under `lang`/`country` variant keys.

Local verification output:

- `npm run typecheck` — passed.
- `npm test` — passed, 62 tests.
- `npm run wrangler:dry-run` — passed, Worker dry-run upload 22.98 KiB / gzip 6.28 KiB.
- `git diff --check` — passed.

Post-push deployment and deployed verification output:

- GitHub Actions Deploy API Worker run `29866145244` completed successfully for commit `1114fdb`.
- `GET /titles/tt0133093` against `https://ohanamovies-api.ohanamovies-api.workers.dev` — 200; default movie response, provider region `US`, 4 collection items, first item IMDb ID `tt0133093`.
- `GET /titles/tt0088247?lang=es&country=ES` — 200; localized movie title `Terminator`, provider region `ES`, 6 collection items, first item IMDb ID `tt0088247`.
- `GET /titles/tt0133093?lang=es` — 200; localized movie title `Matrix`, 4 collection items, first item IMDb ID `tt0133093`.
- `GET /titles/tt0944947?lang=es` — 200; localized series title `Juego de tronos`, `seasonCount: 8`, 9 season summaries, specials preserved as `seasonNumber: 0`.

GitHub issue evidence/closure status:

- #3 closure-ready evidence: README documents `lang`/`country`; localized/country production request returned 200 with `providerRegion: ES`; local typecheck/test/dry-run/diff-check passed.
- #4 closure-ready evidence: production movie responses include `collection.items[]` with IMDb IDs where available; tests cover collection item mapping, partial upstream data, and localized cache isolation.
- #5 closure-ready evidence: production series response includes `seasonCount` and normalized `seasons[]`; tests cover normal/partial season mapping and localized cache writes.
- No GitHub comments were posted and issues were not closed by this isolated runner; external issue mutation should be done explicitly by Alex or a follow-up agent with permission.

Remaining risks/follow-up:

- None.
