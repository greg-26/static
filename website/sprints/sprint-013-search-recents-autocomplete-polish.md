# Sprint 013 — Search recents autocomplete polish

## Status
ready

## Outcome

Search recent activity feels like part of the search box instead of a separate chip block: recent searches appear as focused autocomplete-style suggestions, and recent movie/search result rows have aligned card/poster corner radii.

## Why now

Alex added two latest non-API working-fork issues for the Search/recents surface: [#8](https://github.com/greg-26/static/issues/8) and [#9](https://github.com/greg-26/static/issues/9). Both are small, user-visible polish fixes in the same area and should land before continuing larger API-detail work so the everyday Search flow stays clean.

## Source requirements

- Issue #8: recent movie list items have rounded corners that do not align with poster borders; align the list item and poster radii.
- Issue #9: recent searches should not be always-visible chips; show them only when the search box is focused, as autocomplete-style suggestions like Amazon.
- Existing Search behavior: `SearchView.vue` owns route-backed query state, recent-search persistence, no-results state, and mobile keyboard focus rules.
- Existing Search primitive: `SearchBox.vue` is the reusable input shell and should stay the obvious place for input-adjacent suggestion UI if the implementation stays clean.

## Starting context

- Recent searches are persisted through `src/lib/recentActivity.js` and currently render under the Search box when no query is active.
- `SearchView.vue` renders recent movies/searches, committed query routing, and result selection behavior.
- `SearchResultCard.vue` owns search/recent movie row styling and poster rendering.
- Prior mobile work intentionally avoids opening the keyboard unexpectedly on touch devices.

## Scope

### In scope

- Replace the always-visible recent-search chip section with an input-adjacent suggestion dropdown that appears only while the Search input is focused and there is no active committed query or while the local input is empty/usable for suggestions.
- Allow selecting a recent search suggestion to commit the query, update the route query, update recent activity, and show results.
- Preserve keyboard and screen-reader usability: suggestions are reachable, labelled, dismiss on blur/Escape, and do not trap focus.
- Preserve mobile touch rules: selecting a suggestion on touch devices must not immediately re-open or fight the keyboard beyond the user’s direct focus interaction.
- Align recent movie/search result card border radius with poster radius so row and poster corners visually match.
- Add targeted QA/source checks for the suggestion dropdown visibility contract and radius alignment if cheap.

### Out of scope

- API-backed suggestions, person/studio search, or remote autocomplete.
- Changing the search ranking/model beyond existing committed query behavior.
- Discover-row movie deduplication from issue #7; plan that as a separate Discover sprint.
- Replacing recent movie history or localStorage persistence.
- Closing issues; closure belongs to the implementation completion workflow after verification.

## Technical guidance

- Prefer extending `SearchBox.vue` with a small suggestion slot/props only if it keeps focus/blur behavior local and reusable; otherwise keep the dropdown in `SearchView.vue` but position it as part of the search field.
- Use established combobox/autocomplete semantics where practical: a labelled listbox of suggestions tied to the search input beats a custom pile of buttons with no relationship to the field.
- Keep suggestion copy compact: recent query text is enough, with maybe a subtle **Recent** label outside repeated items.
- Use one shared radius token/value for the recent/result row and poster where possible instead of manually matching separate numbers.
- Do not regress `/search?q=...` deep-link hydration or committed search persistence.

## QA/CX notes

- Empty Search landing should feel lighter: the page can still show recent movies if useful, but recent search chips should not occupy permanent vertical space under the input.
- When the input gains focus and recent searches exist, suggestions should appear immediately and feel attached to the field.
- When the input blurs without selecting a suggestion, the dropdown should close without committing accidental queries.
- Clear/Escape behavior should be predictable: clear removes the current input/query; Escape closes suggestions first.
- On mobile, the dropdown must not push content into a weird jumpy state or create an accidental keyboard loop.

## Expected file impact

- `src/components/SearchView.vue`
- `src/components/SearchBox.vue` if the dropdown/slot belongs in the input primitive
- `src/components/SearchResultCard.vue`
- Optional targeted QA script or source-inspection check
- Sprint docs after implementation

## Implementation sequence

1. Inspect current Search focus, route-query, recent-search, and recent-movie rendering paths.
2. Decide whether suggestion UI belongs inside `SearchBox.vue` via slot/props or remains in `SearchView.vue` positioned against the field.
3. Implement focus-gated recent-search suggestions with click/tap, keyboard, blur, Escape, and route-query behavior preserved.
4. Remove or hide the old always-visible recent-search chip block.
5. Align recent/result card and poster radii through a shared value or equivalent CSS.
6. Add targeted QA/source inspection for dropdown visibility and radius alignment if cheap; run build.
7. Update Sprint 013 evidence and comment/close issues #8/#9 only if fully satisfied.

## Acceptance criteria

- [ ] Recent searches are not shown as a permanent chip section on the Search landing page.
- [ ] Recent searches appear as input-attached suggestions only when the search field is focused and recent searches exist.
- [ ] Selecting a recent search commits the query, syncs `/search?q=...`, refreshes recents, and shows results.
- [ ] Blur/Escape closes suggestions without accidentally committing a query.
- [ ] Keyboard and screen-reader affordances are preserved for the suggestions.
- [ ] Touch/mobile focus behavior remains intentional and does not reopen the keyboard unexpectedly after suggestion selection.
- [ ] Recent movie/search result row corners visually align with the poster corners.
- [ ] Existing query deep links, result selection, no-results state, and recent movie history still work.
- [ ] Issues #8 and #9 have implementation evidence comments only after the sprint is complete.

## Required tests

- `npm run build`
- Targeted Search QA/source inspection for focus-gated recents, committed suggestion selection, Escape/blur behavior, and radius alignment.
- Manual smoke: `/search`, focus/blur search box with stored recents, select a recent suggestion, `/search?q=godfather`, mobile-width Search.

## Verification commands

```bash
cd website
npm run build
```

## Handoff

Report the final suggestion interaction model, radius value/shared styling used, files changed, verification commands, and whether issues #8/#9 were closed or left open with blockers.

## Dependencies unlocked

- Sprint 011/012 API-detail work can resume after this Search polish sprint unless Alex prioritizes issue #7 Discover deduplication next.
