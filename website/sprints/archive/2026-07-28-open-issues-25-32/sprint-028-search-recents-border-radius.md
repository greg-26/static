# Sprint 028 — Search Recents Border-Radius Repair

## Status
complete — implemented 2026-07-28

## Outcome

Search recent-search suggestions and recently viewed content no longer show the off-looking border/radius artifact reported in issue #31.

## Why now

This is a small visible follow-up to completed Sprint 027. Clear it before larger detail/settings work so Search does not carry an obvious polish regression.

## Source requirements

- Issue #31: <https://github.com/greg-26/static/issues/31>
- `VISION.md`: Search starts with the search bar at the top and should avoid decorative wrapper noise.
- `DESIGN_GUIDELINES.md`: use whitespace/hierarchy over stacked bordered containers.
- `CODING_STANDARDS.md`: Search result surfaces should be vertical and scannable.

## Starting context

`src/components/SearchView.vue` owns recent search suggestions and recently viewed rendering. Sprint 027 removed an ugly rounded-container treatment, but issue #31 reports a remaining border/radius mismatch.

## Scope

### In scope

- Inspect Search recents CSS and markup for the specific border/radius mismatch.
- Repair the visual artifact with the smallest CSS/markup change.
- Preserve recent-search/recent-viewed storage and behavior.
- Verify mobile-width Search empty state and focused search suggestions.

### Out of scope

- Reworking Search ranking, storage, autocomplete semantics, or result cards.
- Adding new Search features.

## Technical guidance

- Prefer removing or flattening the offending border/background before adding another wrapper.
- Keep focus/keyboard affordances for recent suggestions intact.
- Avoid broad global CSS changes unless the artifact is caused by a shared primitive.

## Expected file impact

- `src/components/SearchView.vue`
- Possibly `src/assets/global.css` only if the artifact comes from a global token/primitive.

## Implementation sequence

1. Reproduce/inspect Search with no active query and with the search box focused.
2. Identify the exact class causing the mismatched radius/border.
3. Apply a minimal visual repair.
4. Verify recent searches can still be selected and cleared.
5. Update the issue with evidence; close only if fully resolved.

## Acceptance criteria

- [x] Recent search suggestions have no visibly incorrect border/radius at mobile width.
- [x] Recently viewed empty-query Search content has no decorative container artifact.
- [x] Recent-search selection, clear, focus, and escape behavior still work.
- [x] Search result storage semantics are unchanged.

## Implementation notes

- Removed an over-broad `.recent-section button:not(.ui-chip)` rule that restyled nested `SearchResultCard` buttons as pill controls, causing the off-looking border/radius artifact in the recently viewed Search surface.
- Left recent-search/recent-viewed storage and behavior unchanged; the fix is CSS-only in `SearchView.vue`.

## Required tests

- Manual mobile-width Search check for empty Search, focused Search, and query results.
- Keyboard/focus smoke for recent suggestions.

## Verification commands

```bash
cd website
npm run build
git diff --check
```

## Handoff

Issue #31 should be commented and closed with commit/build evidence. Mobile real-device review is still welcome, but the reported artifact source was identified and removed.

## Dependencies unlocked

- Sprint 029 can proceed independently, but clearing Sprint 028 keeps the active queue clean.
