# Sprint 030 — Movie-Detail Media Rails

## Status
complete

## Outcome

Movie-detail cast, collection, and season rails are sorted, proportioned correctly, uncluttered, and readable on mobile.

## Why now

Issues #25 and #32 both target the media rails introduced/refined by Sprint 024. They should be handled as one coherent movie-detail media polish sprint.

## Source requirements

- Issue #25: <https://github.com/greg-26/static/issues/25>
- Issue #32: <https://github.com/greg-26/static/issues/32>
- `VISION.md`: movie details should support confident decisions without clutter.
- `DESIGN_GUIDELINES.md`: scan-friendly hierarchy; provider/media details belong in detail surfaces, not cards.

## Starting context

`src/components/MovieModal.vue` renders cast, collection, and season surfaces using normalized Ohana API detail data from `src/lib/ohanaApi.js`.

## Scope

### In scope

- Make cast headshots larger enough for names to fit better and center-align cast names.
- Sort seasons by season number.
- Sort collection entries by explicit known/order value when available, else by year ascending.
- Remove season descriptions from compact season cards.
- Restore/maintain standard poster aspect ratio for collection cards and make them wide/tall enough for useful titles/year.
- Preserve year display for seasons and collections.

### Out of scope

- New external API calls solely to discover franchise order.
- Full movie-detail redesign.
- Changing poster/list card components outside the modal unless already shared intentionally.

## Technical guidance

- Inspect normalized API fields before choosing sort keys; do not invent fragile title parsing unless no structured/year fallback exists.
- Use `aspect-ratio: 2 / 3` for poster-like cards unless source art requires a documented exception.
- If collection order cannot be known, document year fallback in the issue comment.

## Expected file impact

- `src/components/MovieModal.vue`
- Possibly `src/lib/ohanaApi.js` if existing normalized fields need safe exposure for order/season numbers.

## Implementation sequence

1. Inspect current API detail data shape for seasons/collections/cast.
2. Add safe sort helpers for seasons and collections.
3. Adjust rail/card markup only as needed to remove clutter and preserve year.
4. Tune CSS for cast centering and poster aspect/proportions.
5. Verify at mobile width using titles with seasons/collections/cast.
6. Comment on issues #25 and #32 with evidence; close only if fully resolved.

## Acceptance criteria

- [x] Cast rail uses larger images and centered names that do not feel misaligned on mobile.
- [x] Seasons sort by season number and keep year visible.
- [x] Season cards omit descriptions in the compact rail.
- [x] Collection cards preserve poster aspect ratio, are not thin/cropped incorrectly, and keep year visible.
- [x] Collection order uses known order when available, else year ascending.

## Required tests

- Manual movie-detail check for a title with seasons.
- Manual movie-detail check for a title in a collection.
- Manual movie-detail check with cast at mobile width.

## Verification commands

```bash
cd website
npm run build
git diff --check
```

## Handoff

Sprint 030 completed on 2026-07-28.

Changed files:

- `src/lib/ohanaApi.js`: normalized numeric sort keys for seasons and collections; seasons sort by season number; collections sort by explicit order fields when present, then year/title fallback.
- `src/components/MovieModal.vue`: cast avatars enlarged and names centered; season descriptions removed from compact cards; season/collection cards enlarged while preserving 2:3 poster aspect and year display.

Verification:

- `npm run build` passed.
- `git diff --check` passed.
- Vite reachable at `http://100.85.92.106:5173/`.
- Data-shape examples inspected from Ohana API: `tt0944947` / `tt0108778` seasons and `tt0241527` collection/cast.

Issue closure comments were added to #25 and #32 with verification evidence before closing.

## Dependencies unlocked

- Movie-detail media rail polish complete for this tranche.
