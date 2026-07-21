# Sprint 011 — Collection Items

## Status

ready

## GitHub issues

- [#4 — api - collections details](https://github.com/greg-26/static/issues/4)

## Outcome

Movie responses that belong to a TMDB collection include normalized collection item summaries sufficient for the CX to render the collection list, including item IMDb IDs when TMDB can resolve them.

## Why now

The initial API only exposes the collection parent/artwork. CX now needs the movies inside the collection. This is movie-specific and should follow Sprint 010 so localized request context/cache behavior is already defined.

## Source requirements

- Issue #4 asks for list of movies in a collection, at least IMDb IDs, optionally posters/title.
- `api/docs/design.md` says collections apply to movies and seasons are not collections.
- Public contracts must remain application-owned and must not expose raw TMDB payloads.

## Starting context

- Sprint 010 has established localized request context and cache-key rules.
- Current mapper already has a `collection` field for movies and `null` for series.

## Scope

### In scope

- Extend the public movie collection model with an `items` array.
- Include each item’s stable TMDB ID internally only as needed; public output should prefer application-owned fields.
- Resolve and include item IMDb IDs where TMDB external IDs are available.
- Include practical key details such as title, release year/date, poster image, and item order when available.
- Preserve current collection parent fields/artwork.
- Ensure TV series still return `collection: null`.
- Add mapper/client/service tests with mocked TMDB collection and external-ID responses.
- Document collection item response shape in `api/README.md` if examples/spec sections exist there.

### Out of scope

- Season lists (#5).
- Returning every TMDB collection field.
- Creating a separate collection endpoint.
- Background prefetching all collection items.
- Website/CX rendering work.

## Technical guidance

- Prefer a bounded, normalized shape such as `collection.items[]` with `imdbId`, `title`, `release`, `poster`, and `order`/`position` if useful.
- If IMDb ID resolution fails for one item, do not fail the whole title lookup unless the failure means the collection itself cannot be fetched. Return `imdbId: null` or omit according to existing public-model conventions and test it.
- Avoid N+1 surprises where possible, but correctness beats clever batching. Keep implementation simple and bounded by the collection size returned by TMDB.
- Collection item payload must be cache-safe under Sprint 010’s language/country key strategy.

## Expected file impact

- `api/src/models/**` public title/collection types.
- `api/src/tmdb/client.ts` and related raw types for collection parts/external IDs.
- `api/src/tmdb/**` mapper modules/tests.
- `api/test/fixtures/**` collection fixtures.
- `api/README.md` and maybe `api/docs/design.md`.

## Implementation sequence

1. Inspect current collection model, mapper tests, and TMDB collection fetching.
2. Define the minimal public `collection.items` schema.
3. Extend TMDB client collection fetching to retrieve item details/external IDs needed for IMDb IDs.
4. Map collection parts into normalized item summaries.
5. Add tests for full item mapping, missing IMDb IDs, missing posters, and series non-collection behavior.
6. Update docs/examples.
7. Run verification commands.

## Acceptance criteria

- [ ] Movie responses with collections include `collection.items` as an array.
- [ ] Collection items include IMDb IDs when available from TMDB/external-ID data.
- [ ] Collection items include enough display data for CX list rendering without raw TMDB field names.
- [ ] Missing item IMDb IDs or posters are handled without crashing.
- [ ] Series responses do not treat seasons as collections.
- [ ] Tests cover collection item mapping and partial upstream data.
- [ ] API typecheck, tests, Wrangler dry-run, and `git diff --check` pass.

## Required tests

- Movie fixture with collection maps collection parent plus multiple items.
- Collection item external IDs map to public `imdbId` values.
- Collection item missing external ID remains stable and documented.
- Series fixture keeps `collection: null`.
- Localized request context does not break collection item fetching/mapping.

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

- final public `collection.items` schema
- issue #4 acceptance criteria status
- partial-data behavior for missing IMDb IDs
- tests added/updated
- verification output

## Dependencies unlocked

- Sprint 013 can verify collection behavior end-to-end against deployed API after push/deploy.
