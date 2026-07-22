# Sprint 012 — API TV seasons and detail hardening

## Status
complete — implemented and verified 2026-07-22; closes issue #6 after Sprint 011 foundation.

## Outcome

TV-series detail pages show useful season context from the Ohana API, and the API-enriched detail experience is hardened enough to satisfy issue #6 end to end.

## Why now

Issue [#6](https://github.com/greg-26/static/issues/6) explicitly includes seasons details for TV series. Seasons are a distinct CX surface from movie overview/cast/collection, so they follow Sprint 011's API client foundation rather than landing as a crowded first slice.

## Source requirements

- Issue #6: add seasons details for TV series and other useful metadata from the API.
- `api/README.md`: series responses include `seasonCount` and normalized `seasons[]` with season number, name, episode count, air date/year, overview, and poster.
- `VISION.md`/`DESIGN_GUIDELINES.md`: detail pages should improve confidence with progressive disclosure and avoid noisy duplicate containers.

## Starting context

- Sprint 011 provides lazy API fetch, error fallback, session cache, overview, cast, and collection rendering.
- Static catalog browsing remains the source for Discover/Search.
- TV/static catalog entries may have sparser local data than API responses.

## Scope

### In scope

- Render TV season context when API metadata includes `seasons[]` or `seasonCount`.
- Use compact season summaries: season name/number, year or air date, episode count, poster if useful, and short overview when present.
- Handle specials (`seasonNumber: 0`) clearly without overemphasizing them.
- Add progressive disclosure if the season list is long.
- Tighten API enriched-detail loading/empty/error states based on Sprint 011 findings.
- Add QA coverage for TV series with seasons, API partial data, and long-season lists.
- After verification, comment/close issue #6 through the implementation issue-closure workflow if all requested API detail surfaces are satisfied.

### Out of scope

- Episode-level detail.
- Person/studio search.
- Replacing static catalog/search with API-backed search.
- Provider availability or country/source work already covered by Sprint 010.
- Backend/API changes unless a blocking contract bug is found.

## Technical guidance

- Reuse Sprint 011 API state and display patterns; do not create a parallel fetch path.
- Prefer compact cards/rows and collapse long lists after the first few seasons.
- Keep modal first screen focused; overview/suitability/provider context should not be buried by a long season dump.
- Treat all season fields as optional.

## Data-loading model

- Keep the Sprint 011 model: `movies.json` powers all list/card/search browsing, and Ohana API metadata is fetched only after a detail view/page opens.
- Reuse the same lazy title-detail request and session cache for TV metadata; do not prefetch season data for TV rows, provider filters, or search results.
- Seasons are additive detail context only. Static catalog behavior, suitability, list actions, and provider bitmask availability must continue to work without the API.

## QA/CX notes

- A season section should answer “how much of this show is there and what are the main seasons?” not become an episode guide. Keep episode-level data out.
- Long-running shows need progressive disclosure by default; show the count plus the first few meaningful seasons and a clear **Show all seasons** affordance if needed.
- Specials (`seasonNumber: 0`) should be labelled as **Specials** and de-emphasized after regular seasons unless they are the only season data.
- Handle mismatches gracefully: if `seasonCount` exists but `seasons[]` is sparse, show the count and avoid implying the list is complete.
- Before closing issue #6, verify overview, cast, collection, seasons, loading, API failure, and partial data together; if any surface is unverified, leave the issue open with evidence.

## Expected file impact

- `src/components/MovieModal.vue` or extracted detail metadata components from Sprint 011
- Targeted QA script(s)/fixtures for TV API detail behavior
- Sprint docs after implementation

## Implementation sequence

1. Inspect Sprint 011 implementation and API response examples for at least one TV series.
2. Add season rendering using the existing API metadata state.
3. Add empty/partial/long-list handling.
4. Re-run/update API modal QA and build.
5. Update Sprint 012 evidence and use a scoped issue-closure agent/process to comment and close issue #6 only if all issue requirements are satisfied.

## Acceptance criteria

- [x] TV series details show season count and useful season summaries when API data exists.
- [x] Season rows/cards remain compact and readable on mobile.
- [x] Long season lists use progressive disclosure or an equivalent low-noise pattern.
- [x] Specials are handled clearly when present.
- [x] Missing/partial season data does not produce broken or misleading UI.
- [x] Overview, cast, collection, and season details together satisfy issue #6's requested metadata enrichment.
- [x] API failure fallback from Sprint 011 still works.

## Required tests

- `npm run build`
- Targeted modal/API QA for TV series season rendering and failure/partial states.
- Manual smoke: TV series with multiple seasons, title with no seasons, mobile modal scroll.

## Verification commands

```bash
cd website
npm run build
```

## Handoff

Implemented 2026-07-22:

- API detail normalization now includes `seasonCount` and compact normalized `seasons[]` fields: season/specials number, title, episode count, air date/year, overview, poster URL, and specials flag.
- Movie details render a compact Seasons section for TV API data, with count/list summary, first regular seasons first, Specials de-emphasized after regular seasons, poster fallback, episode metadata, two-line overview, and **Show all / Show fewer** disclosure for long lists.
- API loading/error fallback from Sprint 011 remains unchanged: static detail still renders if the Ohana API is slow or unavailable.
- Sample API smoke used `tt0944947` / Game of Thrones: production API returned 8 seasons plus Specials with posters, overviews, and episode counts.

Verification passed:

```bash
cd website
npm run qa:sprint12
npm run qa:sprint11
npm run build
git diff --check
```

Issue #6 was commented and closed after Sprint 011 + Sprint 012 together satisfied the requested API overview/cast/collection/seasons metadata enrichment.

## Dependencies unlocked

- Completion of the current API-enriched website detail tranche.
