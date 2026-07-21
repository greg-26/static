# Sprint 010 — Where-to-watch country and source context

## Status
complete — implemented 2026-07-22

## Outcome

Users can tell which country Ohana's provider availability represents and which external sources power Where-to-watch data, without the UI pretending unsupported country/provider modes exist.

## Why now

Working-fork issues [#1](https://github.com/greg-26/static/issues/1) and [#2](https://github.com/greg-26/static/issues/2) are open and both affect trust in the same Where-to-watch surface. The work is small, user-visible, and independent of Sprint 9's phone-validation blocker.

## Source requirements

- Issue #1: attribute Where-to-watch data from JustWatch through TMDB, ideally with the JustWatch logo.
- Issue #2: make the current availability country explicit; Settings should show country before providers, read-only if only Spain is supported.
- `VISION.md`: platforms belong in movie/show detail, not poster cards.
- `VISION_EXECUTION.md`: do not implement true Included/Free/Rent/Buy grouping until backend/scraper data supports it.
- Current evidence: `src/stores/movies.js` labels the hard-coded provider list as Spain streaming providers; `public/movies.json` exposes provider bitmasks but no per-country map.

## Starting context

- Provider filters/settings are bitmask-based.
- Movie details already include a Where-to-watch/provider surface.
- Settings has a Streaming services section/route.
- No app-level country selector exists today.

## Scope

### In scope

- Inspect scraper/static data enough to confirm whether `movies.json` contains one country or multiple countries.
- If Spain-only, add a compact read-only country row/selector before provider chips in Settings → Streaming services.
- Make movie-detail Where-to-watch copy identify Spain as the current availability country.
- Add JustWatch/TMDB attribution near the Where-to-watch provider list/source context. Prefer the JustWatch logo only if an acceptable asset is already available or can be added cleanly; otherwise use clear text attribution and leave logo polish as a follow-up.
- Add/update lightweight QA coverage for fixed country display, attribution, and provider semantics.

### Out of scope

- Real multi-country switching without data support.
- Provider bitmask/schema rewrites.
- Fake Free/Rent/Buy semantics.
- Provider/country/source labels on poster cards.
- Closing issues; closure belongs to the implementation completion workflow.

## Technical guidance

- Keep country/source copy concise; this is trust metadata, not a new marketing section.
- Reuse existing Settings row/chip primitives.
- Use one source of truth for the current country label so Settings and movie details cannot drift.
- Preserve existing profile/list/provider persistence and the static hosting model.

## QA/CX notes

- Treat the country row as trust context, not a new setting: if data inspection confirms Spain-only availability, show a fixed/read-only value such as **Country: Spain** with short support copy, not a disabled dropdown that looks broken.
- Keep Where-to-watch attribution adjacent to the provider list and scannable, e.g. **Availability in Spain · Data from JustWatch via TMDB**. If a JustWatch logo cannot be added cleanly, text attribution is acceptable for this slice.
- Verify no provider/source/country copy leaks onto poster cards or Discover rows; the card-level model still comes from `movies.json` and should stay abstract.
- Do not introduce API calls for this sprint. Confirm `movies.json` remains the only browse/card/provider source, with no multi-country UI until the static data model supports it.

## Expected file impact

- `src/components/SettingsView.vue`
- `src/components/MovieModal.vue`
- `src/stores/movies.js` or a small source/country constants module if cleaner
- `scripts/qa-*` only if targeted coverage is needed
- Docs/sprint status after implementation

## Implementation sequence

1. Confirm `public/movies.json` and scraper output do not expose multi-country provider availability.
2. Add a single fixed country/source constant for Spain availability if the data is Spain-only.
3. Render the read-only country row before provider controls in Settings → Streaming services.
4. Render concise country/source attribution in movie details Where-to-watch.
5. Add/update targeted QA and run build.
6. Update sprint status/evidence and comment/close issues #1/#2 only if fully satisfied.

## Acceptance criteria

- [x] Settings → Streaming services shows country before provider controls.
- [x] If only Spain is supported, the country control is visibly read-only/fixed and does not imply switching works.
- [x] Movie details Where-to-watch identifies Spain as the availability country.
- [x] Where-to-watch data is attributed to JustWatch/TMDB in the detail surface.
- [x] Provider availability semantics remain bitmask-compatible and unchanged.
- [x] Poster cards still do not show provider/source/country labels.
- [x] Issues #1 and #2 have implementation evidence comments only after the sprint is complete.

## Evidence

- 2026-07-22 — Confirmed `public/movies.json` has provider bitmasks/provider names only, with no country map.
- 2026-07-22 — Added shared Spain availability/source constants, fixed country row in Settings → Streaming services, and detail-surface copy: `Availability in Spain · Data from JustWatch via TMDB`.
- 2026-07-22 — Added `npm run qa:sprint10` coverage for country/source copy, Spain-only data semantics, and no card-level source/country leakage.
- Verification: `npm run qa:sprint10`; `npm run build`.

## Required tests

- `npm run build`
- Targeted QA/source inspection for country and attribution copy.
- Manual smoke: `/settings/streaming`, movie detail Where-to-watch, mobile width.

## Verification commands

```bash
cd website
npm run build
```

## Handoff

Report the exact country/source copy, files changed, verification commands, and whether issues #1/#2 were closed or left open with blockers.

## Dependencies unlocked

- Sprint 011 can safely integrate API metadata into movie details after the existing provider trust surface is explicit.
