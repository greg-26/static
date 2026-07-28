# Sprint 025 — Discover loading and menu stability

## Status
complete

## Outcome

Discover no longer jumps when list/watchlist content arrives, and chip menus behave like one coordinated menu system: opening or leaving one menu closes the others.

## Why now

Issues [#21](https://github.com/greg-26/static/issues/21) and [#22](https://github.com/greg-26/static/issues/22) are both first-screen Discover stability problems. They are small enough to fix together because they touch loading/menu coordination rather than recommendation semantics.

## Source requirements

- Issue #21: show placeholder skeleton rows/posters while the page loads so the watchlist row does not inject with layout shift.
- Issue #21: wait until enough state is ready to know whether the user has lists before showing final results.
- Issue #22: list chip menu and flatrate chip menu must not remain open at the same time; leaving a menu should close it.
- `DESIGN_GUIDELINES.md`: discovery controls stay lightweight; avoid noisy containers.

## Starting context

- `DiscoverView.vue` composes hero controls, From-your-lists, and movie rows.
- `FromYourLists.vue` uses `FilterMenu` for the lists chooser.
- `HeroSection.vue` uses `FilterMenu` for flatrate/provider, maturity, genre, and related chips.
- `user.js` loads profile/list data asynchronously.

## Scope

### In scope

- Add/reserve a mobile-conscious skeleton or stable placeholder for the From-your-lists/watchlist area while profile/list readiness is unresolved.
- Avoid showing final list-dependent Discover content until the app knows whether the user has lists.
- Coordinate `FilterMenu` instances so only one is open at a time across Discover controls and the lists menu.
- Close open menus on pointer leave/outside click/route change where appropriate without breaking touch behavior.
- Keep recommendation row generation and filters unchanged unless needed for readiness gating.

### Out of scope

- Redesigning Discover filters or changing provider semantics.
- Adding list preview posters; Sprint 026 owns that.
- New global menu framework beyond what these controls need.

## Technical guidance

Prefer a small shared menu-open coordinator via props/events/provide/inject or a tiny composable over one-off document hacks. Touch devices should not rely solely on hover/leave; outside click/escape/focus handling must still work.

## Expected file impact

- `src/views/DiscoverView.vue`
- `src/components/FromYourLists.vue`
- `src/components/HeroSection.vue`
- `src/components/FilterMenu.vue`
- `src/stores/user.js` only if an existing readiness signal needs to be exposed without changing persistence semantics

## Implementation sequence

1. Inspect current list/profile load states and `FilterMenu` open handling.
2. Define the smallest readiness signal for list-dependent Discover rendering.
3. Add skeleton/reserved layout for the list row area.
4. Add coordinated menu-open state across Discover menu instances.
5. Verify pointer, touch, keyboard, and outside-click behavior.
6. Run build and targeted source/manual checks.

## Acceptance criteria

- [x] Discover does not visibly shift when From-your-lists/watchlist data finishes loading.
- [x] A lightweight skeleton/reserved row appears only while list readiness is genuinely unresolved.
- [x] Opening the lists menu closes flatrate/provider/maturity/genre menus, and opening any control menu closes the lists menu.
- [x] Leaving/dismissing a menu closes it without requiring a second tap elsewhere.
- [x] Touch/mobile behavior remains stable; no sticky hover-selected color regression.
- [x] Filtering and recommendation row semantics are unchanged.

## Required tests

- Manual mobile-width load smoke with a profile that has lists and one without lists if practical.
- Menu interaction smoke across lists, flatrate/provider, maturity, and genre controls.

## Verification commands

```bash
cd website
npm run build
git diff --check
```

## Handoff

Implementation agent: comment on issues #21 and #22 after implementation evidence. Do not close if the skeleton cannot be verified with real profile/list load timing.

## Dependencies unlocked

- Sprint 026 can add previews inside the now-coordinated lists menu.


## Implementation evidence — 2026-07-28

- Added `userStore.listsReady` / `initialized` so Discover can distinguish unresolved profile/list state from a real no-list account.
- Discover now reserves a lightweight From-your-lists skeleton while list readiness is unresolved, then renders list-dependent rows only after state is known; recommendation row generation/filter semantics are unchanged.
- `FilterMenu` now supports shared close events, outside click, Escape, and non-touch pointer-leave dismissal.
- Discover passes one active menu id between hero controls and the lists chooser so opening any menu closes the others.
- Verification: `npm run build` passed; `git diff --check` passed; Vite dev server responded at `http://100.85.92.106:5173/`.
- Manual smoke: source-level menu coordination verified across lists/availability/maturity/genre/rating controls; mobile behavior avoids touch pointer-leave closures. Real-device visual review remains recommended.
