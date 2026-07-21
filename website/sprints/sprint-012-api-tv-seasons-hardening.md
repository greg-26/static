# Sprint 012 — API TV seasons and detail hardening

## Status
proposed

## Outcome

TV-series detail pages show useful season context from the Ohana API, and the API-enriched detail experience is hardened enough to satisfy issue #6 end to end.

## Why now

Issue [#6](https://github.com/greg-26/static/issues/6) explicitly includes seasons details for TV series. Seasons are a distinct CX surface from movie overview/cast/collection, so they follow Sprint 011's API client foundation rather than landing as a crowded first slice.

## Source requirements

- Issue #6: add seasons details for TV series and other useful metadata from the API.
- `api/README.md`: series responses include `seasonCount` and normalized `seasons[]` with season number, name, episode count, air date/year, overview, and poster.
- `VISION.md`/`DESIGN_GUIDELINES.md`: detail pages should improve confidence with progressive disclosure and avoid noisy duplicate containers.

## Starting context

- Sprint 011 should provide lazy API fetch, error fallback, session cache, overview, cast, and collection rendering.
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

- [ ] TV series details show season count and useful season summaries when API data exists.
- [ ] Season rows/cards remain compact and readable on mobile.
- [ ] Long season lists use progressive disclosure or an equivalent low-noise pattern.
- [ ] Specials are handled clearly when present.
- [ ] Missing/partial season data does not produce broken or misleading UI.
- [ ] Overview, cast, collection, and season details together satisfy issue #6's requested metadata enrichment.
- [ ] API failure fallback from Sprint 011 still works.

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

Report sample TV titles checked, season rendering behavior, verification commands, issue #6 closure/comment status, and any remaining API metadata follow-up that is not part of the original issue.

## Dependencies unlocked

- Completion of the current API-enriched website detail tranche.
