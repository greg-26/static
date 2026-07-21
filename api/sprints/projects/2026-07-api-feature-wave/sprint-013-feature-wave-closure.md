# Sprint 013 — Feature Wave Closure

## Status

proposed

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

- [ ] README documents `lang`, `country`, collection items, and season summaries accurately.
- [ ] Tests cover combined cache/localization behavior for the new response additions.
- [ ] Local verification passes.
- [ ] Deployed verification is recorded when available, or a clear blocker explains why not.
- [ ] GitHub issues #3, #4, and #5 have closure-ready evidence.

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

The SDE/closure agent must report:

- docs audited/changed
- issue evidence/comment/closure status
- local verification output
- deployed verification output or blocker
- remaining risks or follow-up issues
