# Sprint 017 — Movie-detail imagery hierarchy

## Status
proposed

## Outcome

Movie details stop cropping portrait posters into wide mobile slots: use TMDB/API backdrop-style imagery for the horizontal hero area when available, and show the title poster in its proper portrait aspect ratio as a separate decision cue.

## Why now

Alex added working-fork issue [#13](https://github.com/greg-26/static/issues/13) after Sprints 015–016 were planned. The current modal uses the static poster as the only image surface, and on mobile the poster is stretched into a wide rectangle (`.modal-poster { width: 100%; height: 200px; }`), causing poor CX. This should be a distinct movie-detail visual/API-image slice rather than being folded into provider grouping or API metadata copy.

## Source requirements

- Issue #13: do not crop the poster into a horizontal rectangle; use another TMDB image for that slot.
- Issue #13: add an area that shows the poster with its proper aspect ratio, similar to IMDb's floating poster treatment.
- Issue #13: if TMDB/API returns multiple suitable images, choose one randomly for variation.
- Issue #13: carousel/swipeable multiple images is a later second step, not required for the first implementation.
- `DESIGN_GUIDELINES.md`: one clear hero, mobile first-screen clarity, progressive disclosure, reduce noisy containers.

## Starting context

- `src/components/MovieModal.vue` currently renders only `movie.p` as `.modal-poster`.
- Desktop poster sizing is portrait (`140px × 210px`), but mobile overrides `.modal-poster` to full width and `200px` height with `object-fit: cover`, which crops portrait posters.
- Sprint 011/012 are expected to add lazy Ohana API detail metadata; the implementation must inspect whether the API exposes TMDB backdrop/still/image arrays or equivalent image paths before relying on them.

## Scope

### In scope

- Inspect the Ohana API/title detail response and current static catalog fields for backdrop, still, poster, and image-list availability.
- Render a horizontal hero/backdrop image in movie details when a non-poster TMDB/API image is available.
- Render the poster separately in a preserved portrait aspect ratio, including on mobile.
- Add deterministic-per-open or session-safe random selection among multiple suitable backdrop images if the API supplies them.
- Preserve graceful fallback: if no backdrop exists, do not crop the poster into a wide hero; use a neutral/blurred/color fallback and keep the portrait poster visible.
- Keep accessibility alt text and loading behavior sensible for modal imagery.
- Add targeted QA/source checks for portrait poster aspect ratio, backdrop fallback, random image selection boundaries, and mobile modal layout.

### Out of scope

- Swipeable/carousel image browsing; note it as a future follow-up if multiple images are available.
- Backend/API schema changes unless a missing image contract blocks the UI and Alex prioritizes it.
- Provider grouping/icons from Sprint 016.
- Overview/cast/collection/seasons content from Sprints 011–012 except for reusing their API client/cache.
- Discover/Search poster card redesign.
- Closing issue #13; closure belongs to the implementation completion workflow after verification.

## Technical guidance

- Prefer TMDB backdrop/still images for horizontal areas; never use a portrait poster as the primary horizontal hero unless it is rendered uncropped with clear letterboxing/neutral fill.
- Keep the poster as a real poster with `aspect-ratio: 2 / 3` or equivalent fixed portrait treatment.
- Random image choice should not cause hydration/state churn or flicker while the modal is open. Pick once per modal open or cache per title for the session.
- If the API image contract is absent, implement only the safe layout split/fallback and leave the backdrop part blocked with evidence instead of fabricating image URLs.
- Do not let imagery push suitability and where-to-watch below the first useful mobile screen more than necessary; use overlap/floating treatment sparingly.

## Expected file impact

- `src/components/MovieModal.vue` or extracted image/detail components
- `src/lib/ohanaApi.js` or equivalent API normalization from Sprint 011/012 if image fields are available there
- Optional targeted QA/source inspection script
- Sprint docs after implementation

## Implementation sequence

1. Inspect Sprint 011/012 API client state and sample title responses for backdrop/still/image fields.
2. Map image candidates into `heroImageCandidates` and a separate portrait poster source without changing browsing/card data.
3. Update modal markup/CSS so mobile has a horizontal hero/backdrop area plus a portrait poster area.
4. Add per-open or per-session random selection among suitable hero candidates when more than one exists.
5. Add fallback states that keep the poster portrait and avoid broken/cropped hero images.
6. Run build and targeted mobile modal QA.
7. Update Sprint 017 evidence and comment/close issue #13 only if fully satisfied.

## Acceptance criteria

- [ ] Mobile movie details no longer crop portrait posters into a wide rectangle.
- [ ] A horizontal TMDB/API backdrop/still image is used for the wide detail image area when available.
- [ ] The title poster remains visible in proper portrait aspect ratio on mobile and desktop.
- [ ] Multiple suitable TMDB/API images are selected randomly without flicker during an open modal session.
- [ ] Missing backdrop/image data falls back gracefully without broken image boxes or poster distortion.
- [ ] Suitability, where-to-watch, list actions, and API metadata sections remain usable and not visually buried.
- [ ] Carousel/swipe behavior is not implemented in this sprint and is left as a future follow-up only if image volume justifies it.
- [ ] Issue #13 has implementation evidence comments only after the sprint is complete.

## Required tests

- `npm run build`
- Targeted modal imagery QA/source check for mobile portrait poster aspect, backdrop available, backdrop missing, multiple image candidates, and broken image fallback.
- Manual smoke: phone-width movie detail with a poster-only title, a title with a backdrop, and a title with multiple image candidates if API data exists.

## Verification commands

```bash
cd website
npm run build
```

## Handoff

Report the API/static image fields used, randomization strategy, fallback behavior, sample titles checked, verification commands, and whether issue #13 was closed or left open with an API/image-contract blocker.

## Dependencies unlocked

- Completes the currently planned movie-detail image hierarchy follow-up if API image data supports horizontal assets.
