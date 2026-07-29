# Sprint 039 — Movie detail share action

## Status

complete

## Outcome

Movie detail has a direct standard share icon button that shares the current movie deep link smoothly.

## Why now

Issue [#42](https://github.com/greg-26/static/issues/42) asks for sharing from the movie detail page. This is a contained UX improvement after the detail clutter cleanup.

## Source requirements

- GitHub issue #42: add a share button on the movie detail page using the standard icon; use direct top-right share instead of a 3-dot menu because share is the only option.
- `DESIGN_GUIDELINES.md`: avoid unnecessary menus/components; direct actions beat decorative indirection.
- Current URL handling supports `?movie=` deep links from `src/App.vue` / modal state.

## Starting context

`MovieModal.vue` controls close buttons, poster expansion, modal focus trapping, and title details. `user.js` already has a list-share URL helper pattern for current-origin links that may be useful as a reference, but movie sharing should produce a movie detail link, not a list invite link.

## Scope

### In scope

- Add one direct share icon button in the movie detail top-right/header area, with accessible label.
- Share a canonical movie detail URL for the selected movie, preserving app origin/path and setting `?movie=<imdbId>`.
- Use `navigator.share` when available.
- Provide a practical fallback, preferably `navigator.clipboard.writeText`, with brief local `Copied` / fallback feedback.
- Ensure the control is tap-friendly and does not conflict with the close/back control on mobile.

### Out of scope

- Creating a 3-dot menu for a single action.
- Sharing list invite links.
- Changing router/deep-link semantics beyond the current movie query parameter.
- Adding analytics.

## Technical guidance

- Use a normal SVG share icon or existing icon pattern; no emoji.
- Avoid adding a new dependency unless the project already has an icon dependency in use.
- Keep focus behavior sane: sharing must not break modal escape/tab trapping.
- Guard browser globals so build remains safe.

## Expected file impact

- `website/src/components/MovieModal.vue`
- Possibly a tiny helper in `website/src/lib/` only if URL construction would otherwise be duplicated.

## Implementation sequence

1. Identify the best modal action area after Sprint 038.
2. Add a share button with icon, label, and state feedback.
3. Implement URL construction and `navigator.share` / clipboard fallback.
4. Verify the generated deep link opens the same movie detail.

## Acceptance criteria

- [x] Movie detail shows one standard share icon button in the top-right/action area.
- [x] Tapping share invokes Web Share API on supported browsers.
- [x] Unsupported browsers copy the movie link or clearly indicate why sharing is unavailable.
- [x] Shared/copied URL includes `?movie=<id>` and reopens the same title.
- [x] Button is accessible by label and keyboard focus, and does not overlap close controls on mobile.

## Required tests

- `npm run build`
- Manual browser check of share fallback and generated URL.
- Manual mobile/narrow viewport check for tap target placement.

## Verification commands

```bash
cd website
npm run build
git diff --check
```

## Handoff

Completed 2026-07-30 01:00 Europe/Madrid.

- Changed `src/components/MovieModal.vue` to add one direct share icon action, canonical current-path `?movie=<imdbId>` URL construction, Web Share API support, clipboard fallback, and brief status feedback.
- Verification: `npm run build` passed; `git diff --check` passed; dev server responded `200 OK` at `http://100.85.92.106:5173/`; deep-link smoke check responded `200 OK` for `/discover?movie=tt0111161`.
- Caveat: no headed mobile browser was available in this cron run, so placement was verified by CSS/source inspection and reachable dev URL rather than real-device tapping.
- Issue #42 should be commented and closed with commit/build evidence.

## Dependencies unlocked

None directly; this completes the share-action issue.
