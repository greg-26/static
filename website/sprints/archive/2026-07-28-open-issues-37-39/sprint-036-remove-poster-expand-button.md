# Sprint 036 — Remove poster expand button

## Status

complete

## Outcome

The movie-detail poster remains clickable/tappable to open the larger poster viewer, but the visible `Expand` affordance is removed so the poster area is calmer and less cluttered. Implemented in `src/components/MovieModal.vue` with a focused QA guard in `scripts/qa-sprint36-poster-expand-affordance.mjs`.

## Why now

Issue #37 is a narrow, immediately executable website polish item. It removes an unnecessary visible control from the movie-detail hero without changing the underlying poster-viewer behavior.

## Source requirements

- [Issue #37 — Remove the expand button on poster](https://github.com/greg-26/static/issues/37)
- `DESIGN_GUIDELINES.md`: reduce noise; components are expensive; progressive disclosure.
- `CODING_STANDARDS.md`: reuse existing behavior and avoid one-off control variants.

## Starting context

- `src/components/MovieModal.vue` renders the movie detail surface and poster viewer.
- The poster currently uses a clickable `button` with class `modal-poster modal-poster--button` and accessible label such as `View {title} poster larger`.
- The visible text affordance is currently rendered as `modal-poster-affordance` with the text `Expand`.
- `openPosterViewer`, `closePosterViewer`, focus restoration, and the poster-viewer dialog already exist; do not remove them.

## Scope

### In scope

- Remove the visible `Expand` text/overlay/affordance from the poster.
- Keep the poster itself clickable/tappable when poster artwork exists.
- Preserve keyboard accessibility, focus-visible styling, aria labeling, modal open/close behavior, and focus restoration.
- Remove now-unused CSS for the visible affordance if it becomes dead code.
- Verify no other visible expand button remains on the movie poster.

### Out of scope

- Removing the poster viewer feature itself.
- Changing the close button or modal/dialog behavior.
- Redesigning movie-detail hero layout, imagery hierarchy, or provider/content sections.
- Implementing TMDB content ratings from issues #38/#39.
- Changing poster cards outside the movie-detail modal.

## Technical guidance

- Start in `src/components/MovieModal.vue`.
- Prefer the smallest safe change: remove the `modal-poster-affordance` span and any CSS selectors that exist only to show/hide that text.
- Keep the button element if it is what provides semantics, keyboard activation, and focus restoration.
- If removing the affordance changes perceived interactivity too much, rely on cursor/focus styling rather than adding a new visible label.
- Search for `modal-poster-affordance` and `Expand` after editing to confirm no dead text/CSS remains.

## Expected file impact

- `src/components/MovieModal.vue`

## Implementation sequence

1. Inspect the poster button and poster-viewer code path in `src/components/MovieModal.vue`.
2. Remove the visible `Expand` affordance from the poster template.
3. Remove or simplify unused `modal-poster-affordance` CSS.
4. Confirm poster click/tap and keyboard activation still call `openPosterViewer`.
5. Run verification commands.

## Acceptance criteria

- [x] No visible `Expand` button/text appears over or near the movie-detail poster.
- [x] Clicking/tapping the poster still opens the larger poster viewer.
- [x] Keyboard users can still focus and activate the poster control.
- [x] The poster control still has an accessible label describing the larger-poster action.
- [x] Closing the poster viewer returns focus safely to the poster control.
- [x] No unused `modal-poster-affordance` CSS or template markup remains.

## Required tests

- Open at least one movie detail with poster artwork.
- Click/tap the poster and confirm the poster viewer opens.
- Close the poster viewer and confirm focus/interaction remains stable.
- Check a narrow/mobile viewport for reduced poster clutter.

## Verification commands

```bash
npm run build
git diff --check
grep -RIn "modal-poster-affordance\|>Expand<\|Expand</" src/components/MovieModal.vue
```

The grep command should return no matches after implementation.

## Implementation notes

- Removed the visible `modal-poster-affordance` / `Expand` span from the poster button.
- Removed the now-unused desktop and mobile affordance CSS.
- Preserved the poster button, `aria-label`, `@click="openPosterViewer"`, focus-visible outline, poster-viewer dialog behavior, Escape handling, and focus restoration.
- Added `npm run qa:sprint36` as a narrow static QA check for this flow.

## Verification

- `npm run qa:sprint36` ✅
- `npm run build` ✅
- `git diff --check` ✅
- `grep -RIn "modal-poster-affordance\|>Expand<\|Expand</" src/components/MovieModal.vue` ✅ no matches

Manual browser/mobile validation remains pending; the repo does not include browser automation for this modal flow.

## Handoff

Issue #37 should be commented and closed with the changed files and verification evidence after the implementation commit is pushed.

## Dependencies unlocked

- None. Issue #39 should still wait for API issue #38 before planning a frontend implementation sprint.
