# Sprint 10 — Where-to-watch country context

Status: **Planned next**
Owner: PE for sequencing, SDE for implementation after Sprint 9 validation or if Alex escalates it.

## Trigger

Human feedback in [GitHub issue #7](https://github.com/ohanamovies/static/issues/7): Where-to-watch/provider data changes by country, so the CX must be explicit about the current country. Settings should show a country selector before providers; if only Spain is supported, keep Spain fixed/read-only. If more countries are supported, handle the choice throughout the CX.

## Goal

Make the country behind streaming/provider availability explicit without inventing unsupported backend semantics.

## Current evidence

- `src/stores/movies.js` labels the hard-coded provider list as Spain streaming providers.
- `public/movies.json` currently exposes `providers`/`providerNames` and per-title `prov` bitmasks, but no country key or per-country availability map.
- Therefore the safe first slice is Spain-only/read-only UI unless scraper/data inspection proves otherwise.

## Planned slice order

1. Confirm data contract and scraper output for country support before touching UI.
2. If Spain-only, add a compact read-only country row/selector before provider chips in Settings → Streaming services.
3. Make movie-detail Where-to-watch/provider copy identify Spain as the current availability country without repeating noise on poster cards.
4. Add the smallest source QA/build coverage for the fixed country display and provider semantics.

## Acceptance

- Users can see which country provider availability uses before selecting streaming services.
- If only Spain is supported, the UI says Spain is fixed/read-only and does not pretend country switching exists.
- If multi-country data exists, country selection is persisted and reflected anywhere provider availability is interpreted.
- Provider availability semantics remain bitmask-compatible; no fake Included/Free/Rent/Buy or unsupported country/provider combinations.
- `npm run build` passes, plus any targeted QA script added/updated for Settings/provider country copy.

## Out of scope

- Real multi-country switching without data support.
- Reworking provider bitmasks or scraper schema as a drive-by UI change.
- Showing provider/country labels on poster cards.
