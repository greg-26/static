# Sprint 037 — TMDB content ratings on movie detail

## Status

complete

## Outcome

Movie detail now surfaces the Ohana API `contentRating` in the existing compatibility/content details box, using the API-selected country/region and fallback metadata without reimplementing TMDB fallback logic in the website. When the API has no usable rating, the detail box shows a compact unavailable state after detail enrichment loads.

## Why now

Issue #39 was previously blocked by API issue #38. API commit `bc3e53c` shipped the normalized `contentRating` contract, so the frontend can safely consume the field.

## Source requirements

- [Issue #39 — Website - tmdb content ratings on movie detail page](https://github.com/greg-26/static/issues/39)
- API commit `bc3e53c` — `TitleResponse.contentRating: { rating, region, source, fallback } | null`
- API README content-ratings contract: the API selects requested/current country first, then US/first usable fallback and exposes `fallback`.
- `DESIGN_GUIDELINES.md`: keep modal content calm, compact, and non-cluttered.

## Starting context

- `src/lib/ohanaApi.js` normalizes Ohana API title detail responses for the modal.
- `src/components/MovieModal.vue` renders the compatibility/content details box and its top-right action/badge cluster.
- The API contract returns `contentRating` as `null` when no usable TMDB rating exists.

## Scope

### In scope

- Normalize API `contentRating` into website title detail state.
- Render a compact TMDB content-rating badge near the top-right metadata/actions of the compatibility/content details box.
- Include the selected rating region in the visible badge and fallback/current-country detail in tooltip/ARIA text.
- Show a clean unavailable state after API detail loads with no content rating.
- Preserve narrow/mobile layout and avoid extra fallback selection logic in the website.
- Add a narrow static QA script for the contract and UI wiring.

### Out of scope

- Changing API fallback behavior or TMDB mappers.
- Adding new content-rating filters/search facets.
- Replacing existing static `movie.mpa` maturity badges.
- Redesigning the compatibility score layout.

## Technical guidance

- Trust `apiDetail.contentRating`; do not inspect TMDB `release_dates` or `content_ratings` in the UI.
- Render the badge only from normalized detail data or the explicit unavailable state once detail enrichment returns.
- Keep the badge short: `{REGION} {RATING}` for available ratings.
- Use title/ARIA copy for fallback nuance instead of visible explanatory text.

## Expected file impact

- `src/lib/ohanaApi.js`
- `src/components/MovieModal.vue`
- `scripts/qa-sprint37-content-ratings.mjs`
- `package.json`
- Sprint docs/index files

## Implementation sequence

1. Confirm main is aligned with `origin/main` and inspect API commit `bc3e53c` for the exact contract.
2. Add `normalizeContentRating` to API title-detail normalization.
3. Add modal computed labels/title/ARIA for content ratings.
4. Add a compact badge to the existing compatibility actions area.
5. Add static QA coverage and package script.
6. Run verification commands.

## Acceptance criteria

- [x] Movie detail consumes `contentRating.rating`, `contentRating.region`, and `contentRating.fallback` from the Ohana API detail response.
- [x] The visible badge appears in the existing content details/compatibility box near the top-right metadata cluster.
- [x] The UI uses the API-selected region and does not reimplement backend fallback candidate selection.
- [x] Missing `contentRating` renders a compact unavailable state after API detail load.
- [x] Narrow/mobile behavior remains compact with wrapping actions and no modal layout redesign.
- [x] Narrow QA and build verification pass.

## Verification commands

```bash
npm run qa:modal
npm run qa:sprint37
npm run build
git diff --check
```

## Implementation notes

- `normalizeTitleDetail` now includes normalized `contentRating` when the API returns a non-empty `rating` and `region`.
- The modal renders `ES 12`, `US R`, etc. as a compact pill and exposes whether the API selected a fallback through tooltip/ARIA copy.
- The unavailable state is intentionally muted and appears only after API detail enrichment returns without a rating.
- The website does not parse TMDB release-date/content-rating arrays and does not choose among fallback candidates.

## Verification

- `npm run qa:modal` ✅
- `npm run qa:sprint37` ✅
- `npm run build` ✅
- `git diff --check` ✅

## Handoff

Issue #39 should be commented and closed with changed files, verification evidence, and the implementation commit hash after the commit is pushed.
