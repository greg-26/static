# Sprint 016 — Provider availability breakdown and icons

## Status
proposed

## Outcome

Movie details show provider availability in the same useful buckets TMDB exposes — stream, rent, buy, and related groups — with provider icons where supported, while custom providers remain clearly separate.

## Why now

Alex added working-fork issue [#12](https://github.com/greg-26/static/issues/12) after Sprint 013 was planned. The request explicitly depends on the Ohana API/provider metadata path, so it should follow the API detail foundation/hardening work and the provider-ownership cleanup from Sprint 015.

## Source requirements

- Issue #12: after API enrichment, update Where-to-watch so providers are broken down as TMDB does (`stream`, `rent`, `buy`, etc.) using provider icons returned by TMDB.
- Issue #12: have the UX agent provide input on icon border radius and size.
- Issue #12: for custom providers, no icon or favicon from the custom URL is optional if easy.
- Sprint 010: country/source attribution must remain accurate.
- Sprint 015: normal providers and custom providers should already be separated.

## Starting context

- Existing website provider availability uses static `movies.json` bitmasks and provider names.
- Sprint 011/012 are expected to add the lazy Ohana API detail client/cache and title metadata rendering.
- The API may expose TMDB-style provider groups and provider logo paths; implementation must verify the actual contract before rendering.

## Scope

### In scope

- Inspect the current Ohana API title/provider contract and sample responses for provider group fields and icon/logo paths.
- Render movie-detail provider availability grouped by TMDB-style categories such as stream/flatrate, rent, buy, and any other supported buckets.
- Use provider icons returned by TMDB/API where available, with UX-reviewed sizing and border radius.
- Preserve country/source attribution and fallback to existing static provider display if API provider data is unavailable, partial, or semantically incompatible.
- Keep custom providers separate from TMDB/API provider groups; omit icons by default unless favicon fetching is trivial and safe.
- Add targeted QA for grouped providers, icons/fallbacks, no provider data, and custom-provider separation.

### Out of scope

- Backend/API schema changes unless a contract gap blocks the UI and is explicitly planned.
- Real multi-country switching.
- Provider configuration UI; that belongs to Sprint 015.
- Prefetching provider metadata for Discover/Search rows.
- Closing issue #12; closure belongs to the implementation completion workflow after verification.

## Technical guidance

- Do not fake bucket semantics from the old bitmask list. If the API does not supply category-specific provider groups, leave the issue open with a contract blocker.
- Normalize TMDB bucket names into clear user labels, e.g. **Stream**, **Rent**, **Buy**; avoid exposing raw API terms like `flatrate` unless copy review chooses it.
- Keep the first detail screen calm: provider groups should be compact rows/chips, not a large grid.
- Ask or spawn the UX designer for concrete icon size/radius guidance before implementation commits visual constants.
- Use API icons defensively: missing/broken icons should fall back to provider names, not broken image boxes.

## Expected file impact

- `src/components/MovieModal.vue` or extracted provider/detail components
- `src/lib/ohanaApi.js` or equivalent API normalization from Sprint 011/012
- `src/assets/global.css` only if shared icon/radius tokens are introduced
- Targeted QA/source inspection script(s)
- Sprint docs after implementation

## Implementation sequence

1. Confirm Sprint 011/012 API client and detail metadata state are available.
2. Inspect API provider fields and sample responses for category groups and logo paths.
3. Get UX guidance for provider icon size and border radius.
4. Normalize provider groups and labels defensively.
5. Render grouped provider rows in movie details with icon/name fallback behavior.
6. Preserve static provider fallback and separate custom-provider display.
7. Add targeted QA for grouped providers/icons/fallback/custom providers and run build.
8. Update Sprint 016 evidence and comment/close issue #12 only if fully satisfied.

## Acceptance criteria

- [ ] Movie details group API provider availability into clear TMDB-style buckets such as Stream, Rent, and Buy when the API supplies those groups.
- [ ] Provider icons render for TMDB/API providers when logo data is available.
- [ ] Icon size and border radius follow UX guidance recorded in the sprint evidence.
- [ ] Missing provider groups or icons fall back gracefully without broken UI.
- [ ] Custom providers remain separate and do not require icons; favicon support is included only if easy and safe.
- [ ] Existing Spain/source attribution remains accurate.
- [ ] No Discover/Search/card provider display changes are introduced.
- [ ] Issue #12 has implementation evidence comments only after the sprint is complete.

## Required tests

- `npm run build`
- Targeted movie-detail provider QA for stream/rent/buy grouping, icon fallback, static fallback, and custom-provider separation.
- Manual smoke: movie with stream providers, movie with rent/buy providers, movie with no API provider groups, mobile detail view.

## Verification commands

```bash
cd website
npm run build
```

## Handoff

Report API provider fields used, bucket labels, UX icon sizing/radius, fallback behavior, files changed, verification commands, and whether issue #12 was closed or left open with blockers.

## Dependencies unlocked

- Completes the planned provider-detail tranche introduced by Sprints 010 and 015 if the API contract supports grouped provider availability.
