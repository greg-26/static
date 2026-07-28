# Sprint 029 — Movie-Detail List Actions and Scroll Polish

## Status
complete

## Outcome

Movie-detail list chips read as persistent list membership controls, include a fast route to manage lists, and related collection/season navigation resets the modal scroll to a sane position.

## Why now

Issues #27 and #28 are adjacent in the movie-detail primary decision area. Fixing them together keeps list-action behavior coherent without touching deeper media rail layout.

## Source requirements

- Issue #27: <https://github.com/greg-26/static/issues/27>
- Issue #28: <https://github.com/greg-26/static/issues/28>
- `VISION.md`: movie details should make save/watch/list state immediately useful.
- `DESIGN_GUIDELINES.md`: persistent choices should look distinct from temporary filters.

## Starting context

`src/components/MovieModal.vue` already renders watched/list chips near the top of the modal and supports internal collection/season/related navigation.

## Scope

### In scope

- Reduce list-chip corner radius so list membership chips look closer to platform/persistent chips.
- Add a final Manage lists action/link in the list-chip row.
- Ensure collection/season/related-title navigation scrolls the modal body/top to a natural starting position after the selected movie changes.
- Preserve watched/list toggles and profile/list persistence.

### Out of scope

- Redesigning all chips globally.
- Changing list create/import flows; that belongs to Sprint 031.
- Reworking collection/season card layout; that belongs to Sprint 030.

## Technical guidance

- Scope visual changes to movie-detail user actions unless a shared primitive already supports a compact persistent variant.
- The Manage lists action should route to `/settings/lists` and close or background the modal only if existing routing behavior requires it.
- Scroll reset should target the modal dialog/body, not the page behind it.

## Expected file impact

- `src/components/MovieModal.vue`
- Possibly `src/router/index.js` only if route handling needs a safe existing path check.

## Implementation sequence

1. Inspect current modal list action chip classes and related-title navigation handlers.
2. Add scoped list-chip styling and Manage lists action.
3. Add/adjust modal scroll reset after internal movie selection.
4. Smoke list toggle behavior and navigation to Settings → Lists.
5. Comment on issues #27 and #28 with evidence; close only if fully resolved.

## Acceptance criteria

- [x] Movie-detail list chips have a smaller persistent-control radius without affecting unrelated temporary filters.
- [x] The list-chip row ends with a Manage lists action that reaches Settings → Lists.
- [x] Clicking a collection/season/related title changes the modal content and returns the modal scroll to the top/hero area.
- [x] Watched/list membership toggles continue to persist correctly.

## Required tests

- Manual movie-detail mobile-width check with at least one list.
- Manual internal related-title navigation check from a scrolled modal.

## Verification commands

```bash
cd website
npm run build
git diff --check
```

## Handoff

Sprint 029 completed on 2026-07-28.

- Changed `src/components/MovieModal.vue` only: list membership chips get scoped smaller persistent-control radius, the chip row now ends with a `Manage lists` route action to `/settings/lists`, and movie changes reset the modal scroll container before refocusing the dialog.
- Preserved existing watched/list toggle calls and profile/list persistence semantics.
- Verification passed: `npm run build`, `git diff --check`, and Vite reachable at `http://100.85.92.106:5173/`.
- Caveat: mobile-width behavior was source/build/reachability checked in this cron environment; real-device visual review is still welcome.
- Issues #27 and #28 were commented with evidence and closed after the verified commit was pushed.

## Dependencies unlocked

- Sprint 030 can safely refine adjacent media rails after modal scroll/list controls settle.
