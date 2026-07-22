# Sprint 018 — Discover visible-row deduplication

## Status
complete — implemented and verified 2026-07-22

## Outcome

Discover no longer shows the same title in the first visible slots of multiple rows, and the deduplication model is documented where future agents can find it.

## Why now

Working-fork issue [#7](https://github.com/greg-26/static/issues/7) is the last long-standing website issue from the previous tranche and is now the cleanest independent next slice.

## Source requirements

- Issue #7: assemble each row, then remove visible duplicates rather than blindly deleting every duplicate across long rows.
- Issue #7: track/document the concept of fully visible posters so later viewport-aware behavior is understandable.
- `VISION.md` / `CODING_STANDARDS.md`: a title must not appear in the first two visible positions of more than one Discover row.

## Starting context

- Discover rows are generated in `src/stores/movies.js` and rendered through `src/components/MovieRow.vue` / `MovieCard.vue`.
- Existing acceptance criteria already require first-screen row diversity.

## Scope

### In scope

- Inspect current Discover row generation and visible-row slicing behavior.
- Add a small, readable dedupe pass that prevents duplicate stable title IDs/titles in the first visible row positions.
- Preserve row usefulness by pushing duplicates deeper when practical instead of emptying rows.
- Add a code comment near the algorithm explaining visible-slot dedupe and the future fully-visible poster tracking model.
- Add a README pointer to the implementation location and high-level behavior.
- Add targeted source/data QA for duplicate first-visible positions.

### Out of scope

- Full IntersectionObserver runtime removal across already-scrolled rows unless it is tiny and low-risk.
- Redesigning row titles, poster cards, filters, or ranking formulas.
- Backend/scraper data changes.

## Technical guidance

Use stable IDs first (`movie.id`), then a normalized title/year fallback. Keep the algorithm deterministic and cheap: row generation runs on filtered catalog data, so do not add DOM-dependent work to the store. If viewport-aware behavior is deferred, leave clear hooks/docs rather than pretending it exists.

## Expected file impact

- `src/stores/movies.js`
- `src/components/MovieRow.vue` only if runtime visibility tracking is added
- `README.md`
- Optional `scripts/qa-sprint18-discover-dedupe.mjs`
- `package.json` script entry if a QA script is added

## Implementation sequence

1. Inspect row generation and identify where rows are assembled before slicing/rendering.
2. Add visible-slot duplicate detection with a small constant/default matching the first two poster positions.
3. Reorder/push duplicates deeper when the row has alternatives; otherwise remove only the visible duplicate.
4. Document the model in code and README.
5. Add targeted QA that fails if the same stable title appears in the first visible slots of more than one generated Discover row.
6. Run build and mobile-width route smoke if practical.

## Acceptance criteria

- [x] The same stable movie/show does not appear in the first two positions of more than one Discover row.
- [x] Duplicate handling keeps later row content useful by preferring replacement/reordering over blanket removal.
- [x] The algorithm is documented near the code and referenced from `README.md`.
- [x] Existing filter/search/profile behavior is not changed except for row ordering/deduplication.
- [x] Mobile Discover remains horizontally scrollable and row rendering performance does not obviously regress.

## Required tests

- Targeted Discover row dedupe QA/source check.
- Mobile-width Discover smoke with real `public/movies.json` if available.

## Verification commands

```bash
cd website
npm run qa:sprint18
npm run build
git diff --check
```

## Handoff

Implemented 2026-07-22. Added `src/lib/discoverRows.js` and wired `src/stores/movies.js` to source-dedupe the first two Discover poster slots across rows by stable ID or normalized title/year. Duplicates are pushed behind fresh alternatives when possible; rows with no fresh alternatives drop the duplicate visible start instead of claiming runtime viewport tracking. README now points to the implementation and documents the deferred fully-visible poster model.

Verification passed: `npm run qa:sprint18`, `npm run qa:dev-routes` against `http://100.85.92.106:5173`, `npm run build`, and `git diff --check`.

## Dependencies unlocked

- Removes a major Discover first-screen trust regression before additional movie-detail polish continues.
