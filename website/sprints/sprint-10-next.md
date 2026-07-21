# Sprint 10 — Where-to-watch country and source context

Status: **proposed** — next after Sprint 9 validation unless Alex escalates
Owner: sprint planner for sequencing, sprint implementation agent after Sprint 9 validation or if Alex escalates it.

## Trigger

Human feedback on the working fork:

- [GitHub issue #2](https://github.com/greg-26/static/issues/2): Where-to-watch/provider data changes by country, so the CX must be explicit about the current country. Settings should show a country selector before providers; if only Spain is supported, keep Spain fixed/read-only. If more countries are supported, handle the choice throughout the CX.
- [GitHub issue #1](https://github.com/greg-26/static/issues/1): Where-to-watch data comes from JustWatch through TMDB and should be attributed, ideally with the JustWatch logo.

## Goal

Make the country and source behind streaming/provider availability explicit without inventing unsupported backend semantics.

## Current evidence

- `src/stores/movies.js` labels the hard-coded provider list as Spain streaming providers.
- `public/movies.json` currently exposes `providers`/`providerNames` and per-title `prov` bitmasks, but no country key or per-country availability map.
- Therefore the safe first slice is Spain-only/read-only UI unless scraper/data inspection proves otherwise.

## Planned slice order

1. Confirm data contract and scraper output for country support before touching UI.
2. If Spain-only, add a compact read-only country row/selector before provider chips in Settings → Streaming services.
3. Make movie-detail Where-to-watch/provider copy identify Spain as the current availability country without repeating noise on poster cards.
4. Add JustWatch attribution to the Where-to-watch surface, preferably near the provider list/source context rather than poster cards.
5. Add the smallest source QA/build coverage for fixed country display, attribution, and provider semantics.

## Acceptance

- Users can see which country provider availability uses before selecting streaming services.
- If only Spain is supported, the UI says Spain is fixed/read-only and does not pretend country switching exists.
- If multi-country data exists, country selection is persisted and reflected anywhere provider availability is interpreted.
- Provider availability semantics remain bitmask-compatible; no fake Included/Free/Rent/Buy or unsupported country/provider combinations.
- Where-to-watch data is attributed to JustWatch/TMDB as supported by available assets/legal requirements; if the logo is unavailable, use clear text attribution and leave the logo as a follow-up.
- `npm run build` passes, plus any targeted QA script added/updated for Settings/provider country/attribution copy.

## Out of scope

- Real multi-country switching without data support.
- Reworking provider bitmasks or scraper schema as a drive-by UI change.
- Showing provider/country/source labels on poster cards.
