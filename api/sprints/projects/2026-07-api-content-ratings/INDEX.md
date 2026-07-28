# 2026-07 API Content Ratings

## Scope

Implement GitHub issue [#38](https://github.com/greg-26/static/issues/38), `API - content ratings`.

## Sprints

| Sprint | Outcome | Status |
|---|---|---|
| [015](sprint-015-content-ratings-contract.md) | Title responses expose normalized movie/series content ratings from TMDB, with documented region/fallback semantics and tests. | complete |

## Completion criteria

- TMDB movie release-date certifications and TV content ratings are fetched with title details.
- Public `TitleResponse` includes a backward-compatible nullable `contentRating` field.
- Region selection and fallback behavior is documented for frontend use.
- Mapper/client behavior is covered by unit tests.
- Typecheck, tests, Wrangler dry-run, and `git diff --check` pass before closeout.
