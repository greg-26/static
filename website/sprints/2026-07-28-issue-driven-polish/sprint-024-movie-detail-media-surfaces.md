# Sprint 024 — Movie-detail media surfaces

## Status
ready

## Outcome

Movie-detail media feels native to the current site: the backdrop blends into the dark modal without rounded-card treatment, collection/season posters are tighter and open internal details where possible, and cast appears as one horizontal row with circular profile photos.

## Why now

Issue [#18](https://github.com/greg-26/static/issues/18) is a focused follow-up to the completed detail-media sprints. It should be handled after Sprint 023 so the top detail layout is not changed twice.

## Source requirements

- Issue #18: backdrop image should not have rounded corners; it should blend smoothly with the dark background.
- Issue #18: collection/season posters should be closer together and link to movie details inside the current site, not send users away to IMDb.
- Issue #18: cast members should appear in one horizontal scroll row with circular profile photos.
- Sprint 017–021 history: preserve hero/poster hierarchy, API detail loading feedback, overview/parent-guide/where-to-watch order, and cast/collection enrichment.

## Starting context

- `MovieModal.vue` renders API backdrop/hero, collection items, seasons, and cast preview.
- `src/lib/ohanaApi.js` normalizes detail data, collection items, seasons, and cast profile URLs.
- Router has `/lists/:listId` but movie details currently use modal/query behavior rather than dedicated title routes.

## Scope

### In scope

- Remove rounded-card treatment from the backdrop/hero image and add a dark blend/gradient/blur edge treatment.
- Tighten collection/season poster spacing and sizing for mobile scanning.
- Make collection/season items open the corresponding Ohana title detail inside the current site when the item has a resolvable local/static/API id.
- Keep any unavoidable external fallback explicit and secondary.
- Ensure cast is a single horizontal scroll row with circular profile photos and stable fallbacks.

### Out of scope

- New API fields or backend resolver work.
- Dedicated movie route creation unless the existing modal/query mechanism cannot open internal details.
- Reordering parent-guide/where-to-watch sections.
- Top action/watchlist changes; Sprint 023 owns those.

## Technical guidance

Prefer wiring collection/season clicks through existing modal-opening paths instead of adding a new route surface. If an API item cannot be mapped to an internal movie id, do not fake it; keep it non-link or use a clearly external fallback. Horizontal cast should be scrollable, not wrapped into multiple rows.

## Expected file impact

- `src/components/MovieModal.vue`
- `src/lib/ohanaApi.js` only if id/url normalization already exists in API payload but is not exposed to the component
- Optional targeted modal QA script updates

## Implementation sequence

1. Inspect current collection/season/cast data fields in `MovieModal.vue` and `ohanaApi.js`.
2. Update backdrop styling to sharp corners with dark blend and no nested-card feel.
3. Tighten collection/season poster layout and add internal open behavior where ids are available.
4. Update cast row to one horizontal circular-avatar strip.
5. Add fallback behavior for missing cast photos/internal ids.
6. Run build and targeted modal smoke/source QA.

## Acceptance criteria

- [ ] Backdrop/hero image has sharp edges and blends naturally into the dark modal background.
- [ ] Collection and season posters are not over-spaced on mobile.
- [ ] Collection/season items with resolvable title ids open Ohana details inside the current site.
- [ ] Items without resolvable internal ids do not silently navigate users to IMDb as the primary action.
- [ ] Cast members render in one horizontal row with circular profile photos or stable circular fallbacks.
- [ ] Sprint 019–021 detail order, parent-guide density, where-to-watch display, and API loading feedback do not regress.

## Required tests

- Manual/source smoke for at least one title with collection items, one with seasons, and one with cast profiles.
- Mobile-width check for horizontal cast and collection spacing.

## Verification commands

```bash
cd website
npm run build
git diff --check
```

## Handoff

Implementation agent: comment on issue #18 with evidence after implementation. Leave the issue open if internal collection/season navigation is blocked by missing ids and record the exact blocker.

## Dependencies unlocked

- Completes current movie-detail media follow-up tranche.
