# Sprint 032 — Mobile First-Paint Stability

## Status
ready

## Outcome

The app no longer visibly flashes or drifts from desktop layout to mobile layout during slow mobile loads, or the precise remaining blocker is documented with evidence.

## Why now

Issue #26 reports a cross-route mobile first-paint problem. It should be handled after contained route/component polish so the implementation agent can isolate global shell/CSS causes without racing other UI edits.

## Source requirements

- Issue #26: <https://github.com/greg-26/static/issues/26>
- `VISION.md`: mobile-conscious execution and calm hierarchy.
- `DESIGN_GUIDELINES.md`: mobile first-screen clarity.
- `CODING_STANDARDS.md`: keep app working and verifiable after each slice.

## Starting context

Global sizing lives in `src/assets/global.css`; the app shell is `src/App.vue`; primary routes include Discover, Search, Settings, and list/detail surfaces. The reported issue is especially noticeable on slow mobile connections.

## Scope

### In scope

- Reproduce or approximate the issue with mobile viewport and throttled loading.
- Inspect global CSS/app shell/media-query behavior for desktop-first initial values that cause first-paint drift.
- Apply the smallest mobile-first/layout-stability fix.
- Verify app shell plus Discover, Search, Settings, and movie-detail entry points at mobile width.
- If not reproducible, document evidence and a targeted next check rather than guessing.

### Out of scope

- Broad redesign of responsive breakpoints.
- Changing data loading semantics unless they directly cause layout drift.
- Performance optimization unrelated to visible responsive layout shift.

## Technical guidance

- Prefer mobile-first base styles with desktop enhancements in min-width media queries when changing shared CSS.
- Watch for wide fixed padding, card widths, grid values, or JS-measured layout that initialize desktop-sized before media queries settle.
- Avoid hiding the entire app behind loading screens unless source evidence proves that is the only safe fix.

## Expected file impact

- `src/assets/global.css`
- `src/App.vue`
- Possibly route/component CSS where a specific desktop-first style causes the flash.

## Implementation sequence

1. Run/inspect the app at mobile width with throttling or equivalent slow-load simulation.
2. Identify the first-paint desktop-style source.
3. Apply a minimal mobile-first or layout-reservation fix.
4. Verify no desktop regression in basic width checks.
5. Comment on issue #26 with evidence; close only if the drift is resolved.

## Acceptance criteria

- [ ] Slow mobile load no longer visibly flashes desktop layout before settling, on the reproduced route(s).
- [ ] Discover, Search, Settings, and a movie detail entry remain usable at mobile width.
- [ ] Desktop layout remains intact after the mobile-first fix.
- [ ] If not reproducible, issue #26 has a precise blocker/evidence comment and remains open.

## Required tests

- Manual/throttled mobile-width check for at least Discover, Search, and Settings.
- Basic desktop-width smoke after CSS change.

## Verification commands

```bash
cd website
npm run build
git diff --check
```

## Handoff

Comment on issue #26 with reproduction method, changed files, verification, and whether the issue is closed or intentionally left open with a blocker.

## Dependencies unlocked

- Current mobile stability tranche complete.
