# Sprint 023 — Movie-detail actions and poster inspection

## Status
complete

## Outcome

Movie-detail list actions are reachable in the first decision area, and the portrait poster has an obvious mobile-safe way to inspect it larger without making the default modal bulky.

## Why now

Issues [#19](https://github.com/greg-26/static/issues/19) and [#20](https://github.com/greg-26/static/issues/20) both target high-intent movie-detail actions. Users should not scroll to save/remove a title, and the compact poster needs a clear enlargement affordance.

## Source requirements

- Issue #19: move the watchlist/list widget higher in movie details because add/remove is a key action.
- Issue #20: clicking/tapping the poster should show the poster full-screen or otherwise make details easy to inspect.
- `DESIGN_GUIDELINES.md`: movie details should answer what the title is, whether it is appropriate, where it can be watched, and whether it is saved/watched.
- `CODING_STANDARDS.md`: avoid extra boxes; keep controls reusable and mobile-friendly.

## Starting context

- `MovieModal.vue` owns the detail layout, poster image, list actions, and modal guard behavior.
- `modalGuards.js` already centralizes nested-interaction guard selectors and may need poster overlay coverage.
- `user.js` profile/list persistence uses merge behavior; do not rewrite it.

## Scope

### In scope

- Reposition the existing list/watchlist control into the top movie-detail decision area near the title/poster/action links.
- Preserve current add/remove/list semantics and KV/profile merge behavior.
- Add a poster tap/click affordance that opens a larger poster view/lightbox/sheet with accessible close behavior.
- Ensure the poster enlargement works with keyboard, escape/backdrop close, and mobile touch.
- Keep visual distinction between watchlist controls and maturity/profile chips clear enough for now, per issue #19.

### Out of scope

- Redesigning all detail actions or suitability chips.
- Changing list ownership/delete semantics.
- Changing collection/season media; Sprint 024 owns that.
- Pinch/zoom gestures unless needed to make the simple poster overlay usable.

## Technical guidance

Start by moving existing behavior, not rebuilding it. The poster overlay should reuse the current poster source/fallback and close with the same level of safety as the main modal. Avoid introducing nested cards around actions; use spacing and a compact action row.

## Expected file impact

- `src/components/MovieModal.vue`
- `src/composables/modalGuards.js` only if the new poster overlay needs guard coverage
- Optional targeted QA script if an existing modal QA script cannot cover the new action order/overlay selectors

## Implementation sequence

1. Inspect the current list widget and poster DOM in `MovieModal.vue`.
2. Move the list widget to the top decision area while preserving emitted/stateful behavior.
3. Add the poster enlargement affordance and accessible close path.
4. Verify overlay layering against the existing modal close/backdrop behavior.
5. Add or update targeted QA for action placement and poster overlay selectors.
6. Run verification and record mobile/manual checks still needed.

## Acceptance criteria

- [x] Movie details expose add/remove/list actions without scrolling on mobile-width detail view.
- [x] Existing list add/remove behavior and persistence still work; no KV/profile merge rewrite.
- [x] Tapping/clicking the poster opens a larger poster view using the best available poster image.
- [x] The larger poster view is dismissible by visible close control, backdrop/escape where applicable, and keyboard focus does not get stranded.
- [x] The default detail layout remains compact; the poster is not permanently enlarged.
- [x] Watchlist controls and maturity/profile chips are visually distinguishable enough not to feel like the same control group.

## Required tests

- Source/DOM check for moved list control and poster overlay selectors.
- Manual mobile-width smoke for opening/closing poster overlay and adding/removing a title from a list.

## Verification commands

```bash
cd website
npm run build
git diff --check
```

## Handoff

Implementation agent: take this sprint first. Comment on issues #19 and #20 only after implementation evidence exists; do not close from planning.

## Implementation evidence

- Completed 2026-07-28 by Greg in commit 1e28682.
- `MovieModal.vue` now renders watched/list chips directly under the movie title before maturity/profile sections, preserving existing `userStore.toggleWatched`, `userStore.toggleMovieInList`, and `userStore.isInList` behavior.
- Poster image is now a keyboard-focusable button that opens a temporary full-screen poster dialog using `posterImageSrc` (`apiDetail.posterImage.url` with static poster fallback), with visible close, backdrop close, Escape close, tab trap, and focus return to the poster button.
- Added `scripts/qa-sprint23-detail-actions-poster.mjs` and `npm run qa:sprint23` for source/DOM checks covering action order, existing list wiring, compact default poster, and poster overlay selectors.

## Verification

- `npm run qa:sprint23` — passed.
- `npm run build` — passed.
- `git diff --check` — passed.
- Mobile-width interaction still needs Alex/phone review on the running Vite server; source/DOM and build gates passed.

## Dependencies unlocked

- Sprint 024 can polish detail media surfaces after the top action/poster interaction settles.
