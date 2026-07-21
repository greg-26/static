# Sprint 015 — Provider settings and custom source ownership

## Status
proposed

## Outcome

Provider management belongs in Settings, while movie details clearly separate normal provider availability from user-defined custom providers.

## Why now

Alex added working-fork issue [#11](https://github.com/greg-26/static/issues/11) after Sprint 013 was planned. The current movie-detail **Add** provider action is configuration, not a detail-page decision, and moving it to Settings keeps the detail surface calmer before richer provider grouping lands.

## Source requirements

- Issue #11: move the custom provider **Add** button from movie details into Settings → Providers; movie details should show normal providers together and custom providers on a separate line.
- `DESIGN_GUIDELINES.md`: configure once, use everywhere; permanent preferences belong in Settings.
- `CODING_STANDARDS.md`: Settings rows should represent user-owned configuration and stay compact.
- Sprint 010: Spain/source availability context is already explicit and should not regress.

## Starting context

- Provider filters/settings use the existing provider list and profile persistence.
- Movie details currently expose Where-to-watch/provider information and an add/custom-provider affordance.
- Settings already has a Streaming services/provider-related route that can own provider configuration.

## Scope

### In scope

- Move custom-provider creation/edit entry point from the movie-detail Where-to-watch area into Settings → Streaming services / Providers.
- Keep movie details focused on availability: normal providers grouped together, custom providers visually separated on their own line/section when present.
- Preserve existing custom-provider persistence and any current add/remove semantics.
- Keep country/source attribution from Sprint 010 adjacent to provider availability and still understandable.
- Add targeted QA/source coverage for settings-owned custom provider entry and detail-page separation if cheap.

### Out of scope

- Stream/Rent/Buy provider grouping and provider icons from issue #12.
- Fetching provider favicons or custom-provider icons.
- Multi-country provider switching.
- Rewriting provider bitmask/profile persistence.
- Closing issue #11; closure belongs to the implementation completion workflow after verification.

## Technical guidance

- Treat this as ownership and hierarchy cleanup, not a provider-data rewrite.
- Reuse Settings row/list primitives for the add/manage entry point.
- In movie details, separate custom providers with concise labelling only if needed; avoid adding a new heavy box.
- Do not duplicate provider configuration controls in both Settings and movie details.

## Expected file impact

- `src/components/SettingsView.vue`
- `src/components/MovieModal.vue`
- `src/stores/user.js` only if existing custom-provider actions need to be exposed differently
- Optional targeted QA/source inspection script
- Sprint docs after implementation

## Implementation sequence

1. Inspect current provider/custom-provider persistence and movie-detail add flow.
2. Add or move the custom-provider add/manage affordance into Settings → Streaming services / Providers.
3. Remove the movie-detail custom-provider add button.
4. Render normal providers and custom providers separately in movie details without changing provider truth.
5. Verify existing provider preferences/custom providers persist correctly.
6. Add/update targeted QA if cheap and run build.
7. Update Sprint 015 evidence and comment/close issue #11 only if fully satisfied.

## Acceptance criteria

- [ ] Custom-provider add/manage entry point is available from Settings → Streaming services / Providers.
- [ ] Movie details no longer show the custom-provider **Add** button.
- [ ] Movie details show standard provider availability together and custom providers separately when present.
- [ ] Existing provider preferences and custom-provider persistence are preserved.
- [ ] Sprint 010 country/source attribution remains clear and adjacent to Where-to-watch.
- [ ] No Stream/Rent/Buy grouping or provider-icon work is introduced early.
- [ ] Issue #11 has implementation evidence comments only after the sprint is complete.

## Required tests

- `npm run build`
- Targeted provider Settings/detail QA for add/manage location, custom-provider display, and persistence if cheap.
- Manual smoke: `/settings/streaming`, movie detail with providers, movie detail with custom providers if available.

## Verification commands

```bash
cd website
npm run build
```

## Handoff

Report the final custom-provider management location, detail-page provider grouping behavior, files changed, verification commands, and whether issue #11 was closed or left open with blockers.

## Dependencies unlocked

- Sets up Sprint 016 provider grouping/icons with a cleaner division between provider configuration and provider availability display.
