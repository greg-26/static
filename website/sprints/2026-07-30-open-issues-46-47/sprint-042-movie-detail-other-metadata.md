# Sprint 042 — Movie Detail Other Metadata

## Status

complete

## Outcome

Country/origin moves from the top movie-detail metadata row to a quiet bottom “Other details” section after Cast, optionally joined by API-backed original title, original language, and exact release date.

## Why now

Issue [#46](https://github.com/greg-26/static/issues/46) clarifies that country is useful but not primary. The current top-row country badge overstates its importance and adds clutter near title/action controls.

## Source requirements

- GitHub issue [#46 Country of movie](https://github.com/greg-26/static/issues/46)
- `VISION.md` / `DESIGN_GUIDELINES.md`: movie details should avoid duplicate/noisy sections; provider and suitability decisions remain more important than low-priority metadata.
- Current code: `src/components/MovieModal.vue` top metadata row, cast section, and Ohana API country normalization in `src/lib/ohanaApi.js`.

## Starting context

Sprint 040 added API-backed country/origin data and currently displays it in the top metadata row as `Country/Countries ...`. Cast appears near the bottom of `MovieModal.vue`, after collection/seasons. The Ohana API client currently normalizes `countries`; it may not yet normalize original title, original language, or exact release date.

## Scope

### In scope

- Remove country/countries from the top metadata row.
- Add a quiet low-priority metadata cluster after Cast.
- Show `Countries` using existing normalized API country data.
- Add `Original title`, `Original language`, and `Release date` only if the API response already provides them or if they can be added through the existing title-detail API/normalization path.
- Hide the section entirely when no metadata values are available.
- Keep mobile spacing calm and unboxed.

### Out of scope

- Reordering suitability, provider, collection, seasons, or cast sections beyond placing other metadata after Cast.
- Adding client-side TMDB calls from the website.
- Showing guessed/static fallback metadata that is not trustworthy.
- Broad movie-detail redesign or copy expansion.

## Technical guidance

- Prefer an unboxed `<section>` using existing `api-detail-section` / `modal-section-label` style patterns rather than a new card.
- Use short row labels and single-line/mobile-friendly values where possible.
- If API fields are needed, extend the existing Ohana title-detail mapper and `normalizeTitleDetail()` with explicit nullable fields.
- Preserve current `countries` normalization and title caching behavior.
- If exact release date is unavailable, do not degrade to year-only; the top row already carries year.

## Expected file impact

- `website/src/components/MovieModal.vue`
- `website/src/lib/ohanaApi.js` if extra API fields are normalized
- API/title-detail worker/tests only if the response contract needs to expose missing fields
- Optional concise verification note in this sprint file after implementation

## Implementation sequence

1. Inspect the live API response shape for a representative movie and TV title.
2. Decide which requested metadata fields are already available and which need API normalization.
3. Remove the top-row country badge from `MovieModal.vue`.
4. Add the bottom “Other details” section after Cast, rendering only available fields.
5. Keep section styling quiet, scan-friendly, and mobile-safe.
6. Run required tests/build and document any unavailable fields.
7. Comment on #46 with implemented fields, omissions, files changed, and verification; close only if fully satisfied.

## Acceptance criteria

- [x] Country/countries no longer appears in the top metadata row.
- [x] Country/countries appears after Cast in a quiet low-priority metadata section when API data exists.
- [x] Original title, original language, and exact release date appear only when API-backed values are available.
- [x] The section is hidden when all metadata values are unavailable.
- [x] The detail page remains mobile-calm: no new boxed card, no long wrapping chip, no visual competition with suitability or Where to watch.

## Required tests

- Website build.
- API/title-detail mapper test if API response fields are changed.
- Manual detail modal check for at least one title with country data and one title with missing optional metadata if practical.

## Verification commands

```bash
cd website
npm run build
```

If API/title-detail code is touched, also run the smallest relevant API test command available in the repo and record it in the implementation note.

## Handoff

Implementation agent: keep this to metadata placement and API normalization. If original language/title/date are not available from the existing API source, document that clearly in #46 rather than inventing display data.

## Implementation note — 2026-07-30

- Removed the API country badge from the top movie-detail metadata row.
- Added a quiet unboxed `Other details` section immediately after Cast, rendered only when API-backed values exist.
- Normalized `originalTitle` and exact `release.date` through the existing Ohana title-detail mapper; `originalLanguage` remains nullable and hidden because the current representative API responses do not expose it.
- Verified representative API shape for `tt0111161` and `tt0944947`; both expose `originalTitle`, `release.date`, and `countries`, but not original language.
- Verification: `npm run build` passed; title-detail normalization smoke check passed; Vite dev server reachable at `http://100.85.92.106:5173/`.

## Dependencies unlocked

- Completion closes the current country-metadata feedback loop and leaves movie detail ready for QA/CX review.
