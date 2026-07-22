# Sprint 019 — Movie-detail overview, loading, and external links

## Status
complete — implemented and verified 2026-07-22

## Outcome

Movie details read in the requested order: imagery/title, overview with read-more, parent guide, where to watch, collection/seasons, then cast; API hero loading has visible feedback, and TMDB is restored as a proper external link next to IMDb/FilmAffinity.

## Why now

Working-fork issue [#15](https://github.com/greg-26/static/issues/15) combines several movie-detail CX problems after the API/imagery/provider sprints. This sprint handles the layout/link/loading subset without bloating parent-guide or media-card work.

## Source requirements

- Issue #15: show loading feedback such as a skeleton on the backdrop image while API detail loads.
- Issue #15: overview before parent guide, cropped with read-more for the full text.
- Issue #15: section order: overview, parent guide, where to watch, collection/seasons, cast.
- Issue #15: restore TMDB link next to IMDb, with TMDB logo.
- `DESIGN_GUIDELINES.md`: one clear hero, progressive disclosure, links should look like links when the action is navigation.

## Starting context

- `MovieModal.vue` already renders API overview/cast/collection/seasons and Sprint 017 hero/poster imagery.
- Existing external guide links for parent guide use chip-like styling and will be fully addressed in Sprint 020; this sprint may establish a shared external-link style if useful.

## Scope

### In scope

- Reorder movie-detail sections to match issue #15.
- Render API overview/synopsis before parent guide with a mobile-friendly line clamp and read-more/read-less control.
- Add backdrop/hero skeleton or loading shimmer while API detail is pending and a hero image may arrive.
- Restore TMDB external link next to IMDb and FilmAffinity with a small recognizable TMDB logo or text+icon treatment.
- Keep API failure fallback readable; do not hide static synopsis if API overview fails.

### Out of scope

- Parent-guide category tag restoration and compact score rows; Sprint 020 owns that.
- Larger collection poster cards and cast photos; Sprint 021 owns that.
- Any API schema change.

## Technical guidance

Keep the modal mobile-first: do not add another boxed summary. Prefer a single metadata/external-links row under the title/poster cluster. The read-more control should be a normal button/link affordance, keyboard accessible, and should not reset when unrelated API state changes.

## Expected file impact

- `src/components/MovieModal.vue`
- `src/lib/ohanaApi.js` only if TMDB URL/id normalization is missing
- Optional targeted QA script for modal order/link/read-more/loading states

## Implementation sequence

1. Inspect current modal DOM order and API loading state.
2. Add/normalize TMDB URL data if it is already available from API/static sources; otherwise derive safely from API TMDB id only if present.
3. Reorder sections and add overview clamp/read-more.
4. Add hero/backdrop loading skeleton tied to API/image loading state without creating flicker.
5. Add targeted source QA for section order, overview clamp, TMDB link, and loading feedback.
6. Run build and modal QA.

## Acceptance criteria

- [ ] Movie details show overview before parent guide.
- [ ] Long overview text is clamped by default and expands/collapses via an accessible read-more control.
- [ ] Parent guide, where-to-watch, collection/seasons, and cast follow the requested order.
- [ ] Hero/backdrop API loading has visible non-jarring feedback and does not distort the portrait poster.
- [ ] TMDB appears next to IMDb/FilmAffinity as a real external link with a recognizable TMDB affordance.
- [ ] API failure fallback still leaves useful title/synopsis/detail content visible.

## Required tests

- Targeted modal source/order QA.
- Manual or source smoke for a title with API overview and a title where API fetch fails/times out.

## Verification commands

```bash
cd website
npm run qa:sprint19
npm run qa:modal
npm run build
git diff --check
```

## Handoff

Completed 2026-07-22 by Greg.

- Reordered detail content so overview appears before suitability/parent-guide content, where-to-watch appears before collection/seasons, and cast follows collection/seasons.
- Added overview read-more/read-less disclosure with a mobile clamp and static synopsis fallback preserved when API detail fails.
- Added non-jarring hero/backdrop skeleton feedback while API detail or hero image loading is pending; portrait poster layout is unchanged.
- Restored TMDB alongside IMDb/FilmAffinity with the TMDB logo, using `extra.json` `tmdbUrl` when present and a TMDB title/year search fallback otherwise because the deployed API does not expose a TMDB id/url.
- Added `npm run qa:sprint19` source QA.

Verification:

```bash
npm run qa:sprint19
npm run qa:modal
npm run build
git diff --check
```

All passed on 2026-07-22.

Do not close issue #15 after this sprint; it remains open until Sprints 020 and 021 complete their parts.

## Dependencies unlocked

- Gives Sprint 020 a stable parent-guide location and Sprint 021 a stable collection/cast location.
