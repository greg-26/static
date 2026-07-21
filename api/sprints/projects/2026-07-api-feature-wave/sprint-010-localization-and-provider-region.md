# Sprint 010 — Localization and Provider Region

## Status

complete

## GitHub issues

- [#3 — api - localization](https://github.com/greg-26/static/issues/3)

## Outcome

`GET /titles/{imdbId}` accepts optional `lang` and `country` query parameters, fetches localized TMDB metadata/provider data where applicable, keeps response shape stable, and documents the public query contract in `api/README.md`.

## Why now

Localization changes request validation, TMDB client parameters, provider selection, and cache keys. It should land before collection/season expansions so those features can reuse the same request context and cache-key rules.

## Source requirements

- Issue #3 asks for inputs like `/titles/tt0088247?lang=es&country=ES`.
- Issue #3 requires README specs for available parameters, verification, commit, and push.
- `api/docs/design.md` requires application-owned responses, configurable cache, and hidden TMDB details.
- `api/AGENTS.md` requires cache refresh/bypass behavior to remain safe.

## Starting context

- Initial API implementation is complete through archived Sprint 009.
- Current endpoint already supports `GET /titles/{imdbId}` plus `cache=refresh|bypass` controls.
- Current cache key is `title:{imdbId}:v1` and must not mix different localized responses.

## Scope

### In scope

- Parse and validate optional `lang` and `country` query params at the HTTP boundary.
- Normalize `country` to uppercase ISO 3166-1 alpha-2.
- Normalize/validate `lang` to a conservative language tag accepted by TMDB, starting with common `xx` and `xx-YY` forms.
- Pass language to TMDB metadata requests that support it.
- Pass country/region to watch-provider lookups and return only the requested country when provided.
- Keep `streamingProviders` response shape consistent when `country` is absent or present.
- Update cache key construction so `lang`, `country`, and cache mode interactions cannot return the wrong localized body.
- Add tests for validation, TMDB parameter forwarding, provider-region selection, and cache-key variance.
- Update `api/README.md` with query params, defaults, examples, and error behavior.

### Out of scope

- Collection item expansion (#4).
- Season summary expansion (#5).
- Manual cache invalidation endpoint.
- Full BCP-47 validation beyond practical TMDB-safe inputs.
- Website/CX integration.

## Technical guidance

- Keep query parsing separate from TMDB and mapper code.
- Do not expose raw TMDB language/region payloads.
- Cache key shape should remain deterministic and versioned, for example by extending the existing key with normalized request variants or bumping to a new schema component.
- Invalid `lang` or `country` should return stable JSON `400` errors.
- Default no-query behavior should preserve current behavior as much as possible.

## Expected file impact

- `api/src/http/**` query parsing/validation modules.
- `api/src/cache/**` key builder and tests.
- `api/src/tmdb/**` client request construction/tests.
- `api/src/services/**` title lookup request context.
- `api/README.md`.
- Possibly `api/docs/design.md` if the intended public contract changes materially.

## Implementation sequence

1. Inspect current route/query parsing, config, TMDB client, mapper, and cache-key code.
2. Add a typed request context for `lang` and `country` alongside existing cache mode.
3. Validate/normalize query params and add stable error codes/messages.
4. Forward normalized values to TMDB metadata/provider requests.
5. Update provider mapping to return requested-country data consistently.
6. Update cache key construction and cache tests for localized variants.
7. Update README specs and examples.
8. Run verification commands and push only if local repo instructions/request require it for issue completion.

## Acceptance criteria

- [ ] `GET /titles/tt0088247?lang=es&country=ES` is accepted in tests and forwards `es` / `ES` to the TMDB integration layer.
- [ ] Invalid language/country values return stable JSON `400` without TMDB calls.
- [ ] Requests with different normalized `lang` or `country` values cannot share the same cached response.
- [ ] Provider results use the requested country when supplied and preserve response shape when absent.
- [ ] Existing `cache=refresh|bypass` semantics still work with localized requests.
- [ ] `api/README.md` documents available query params, defaults, examples, and verification.
- [ ] API typecheck, tests, Wrangler dry-run, and `git diff --check` pass.

## Required tests

- Query parser accepts `lang=es`, `lang=es-ES`, and `country=ES`.
- Query parser rejects malformed language/country values.
- TMDB client includes language/region request parameters in mocked fetch URLs.
- Cache keys differ for default, Spanish, Spain, and Spanish+Spain variants.
- Route/service tests cover localized success and cache hit/miss behavior.

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

Completed 2026-07-21 by SDE implementation agent.

- Query params implemented: optional `lang`, `country`, and existing `cache`; `lang` accepts `xx` and `xx-YY`/`xx_YY` style two-letter tags normalized to `xx`/`xx-YY`; `country` accepts two-letter ISO country codes normalized to uppercase.
- Stable 400 errors added: `invalid_language` and `invalid_country`; invalid values return before TMDB calls.
- TMDB forwarding implemented: `language` goes to find/details/collection requests; `watch_region` goes to movie/series detail requests when `country` is present.
- Provider selection implemented through the existing `streamingProviders` shape; requested `country` selects that country, absent `country` preserves existing default `US` behavior.
- Cache key examples: default `title:tt0133093:v1`; Spanish `title:tt0133093:v1:lang=es`; Spain `title:tt0133093:v1:country=ES`; Spanish+Spain `title:tt0133093:v1:lang=es:country=ES`.
- README and design docs updated for query params, defaults, cache variance, and new errors.
- Verification: `npm run typecheck` passed; `npm test` passed (57 tests). Final required dry-run/diff-check evidence is in the run handoff.
- Commit/push: pending final run verification and clean handling of pre-existing sprint-planning changes.

## Dependencies unlocked

- Sprint 011 can localize collection names/items consistently.
- Sprint 012 can localize season names/overviews consistently.
