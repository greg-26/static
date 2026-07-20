# Sprint 003 — Public Model and Mappers

## Status

proposed

## Outcome

The API has an application-owned title response model and pure mapper functions that convert representative TMDB movie and series fixtures into that public schema without leaking TMDB field names.

## Why now

The design's main boundary is the normalized public schema. Defining and testing it before network integration keeps TMDB-specific details contained.

## Source requirements

- Normalized model sections: title, type, overview, release, runtime, genres, rating, cast, crew, artwork, collection, streaming providers.
- Implementation principles: expose only normalized models and keep TMDB behind the integration/normalization boundary.
- Future enhancements such as trailers/localization/multiple providers must not complicate the initial implementation.

## Starting context

- Sprint 001 created the API package and verification scripts.
- Sprint 002 may exist but this sprint can be developed mostly as pure model/mapper work.
- No live TMDB access should be required.

## Scope

### In scope

- Define the public title response TypeScript types.
- Define minimal raw TMDB fixture types used by mapper tests, kept private to TMDB-related modules/tests.
- Implement pure mapping for movie and TV series fixtures.
- Include artwork URL construction from TMDB image paths using application-defined semantic image sizes.
- Include movie collection mapping where present; do not treat TV seasons as collections.
- Include streaming provider mapping sufficient to identify available providers and logos.
- Add mapper tests for missing/null optional fields.

### Out of scope

- HTTP route success wiring.
- Fetching data from TMDB.
- KV caching.
- Full TMDB compatibility or exhaustive field coverage.
- Title logos, trailers, localization, or multiple metadata providers.

## Technical guidance

- The public model should use app-owned names and enums, not TMDB names.
- Keep mapper functions deterministic and side-effect free.
- Limit cast/crew/artwork arrays to sensible documented defaults rather than returning huge upstream lists.
- Represent unknown optional data with `null` or omitted fields consistently; choose the simpler public contract and test it.
- Preserve multiple roles/episode counts for series actors when fixture data contains it.

## Expected file impact

- `api/src/models/**`
- `api/src/tmdb/**` mapper modules and local raw types
- `api/test/fixtures/**` or equivalent fixture location
- Mapper unit tests

## Implementation sequence

1. Draft the public title response type from the design sections.
2. Add representative movie and series TMDB fixtures with only fields needed by the mapper.
3. Implement movie mapping and tests.
4. Implement series mapping and tests, including aggregate series cast semantics.
5. Add artwork, collection, and provider mapping tests.
6. Run existing API verification scripts.

## Acceptance criteria

- [ ] Public response types do not expose raw TMDB field names as the client contract.
- [ ] Movie fixture maps to title, overview, release/runtime, genres, rating, cast, crew, artwork, collection, and providers where present.
- [ ] Series fixture maps to series type and series-level cast/crew without using latest season/episode as the main cast source.
- [ ] Missing optional TMDB fields do not crash mapping.
- [ ] Mapper tests pass and are independent of internet/TMDB credentials.

## Required tests

- Movie mapping happy path.
- Series mapping happy path with aggregate credits.
- Null/missing optional field resilience.
- Artwork semantic URL/size mapping and limits.
- Collection mapping for movies only.
- Provider mapping with provider logos.

## Verification commands

Use the real API package scripts introduced by Sprint 001. At planning time those commands do not exist yet, so the SDE must inspect `api/package.json`, run the relevant scripts from `api/`, and report the exact commands.

## Handoff

The SDE agent must report:

- summary of changes
- verification performed
- acceptance criteria status
- deviations from the sprint
- newly discovered risks or follow-up work

## Dependencies unlocked

- Sprint 004 can fetch raw TMDB data targeting the mapper input shape.
- Sprint 005 can return normalized success responses from the HTTP endpoint.
