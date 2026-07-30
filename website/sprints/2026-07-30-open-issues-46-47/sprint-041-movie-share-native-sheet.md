# Sprint 041 — Movie Share Native Sheet Hardening

## Status

complete

## Outcome

The movie detail share icon opens the platform-native share sheet on supported mobile browsers, and copy/manual-link behavior is only a clear fallback near the share action.

## Why now

Issue [#47](https://github.com/greg-26/static/issues/47) says the current user-facing result still feels like “copy URL” rather than share. Sharing is a small isolated interaction and should be fixed before more metadata is added to the detail page.

## Source requirements

- GitHub issue [#47 Movie share](https://github.com/greg-26/static/issues/47)
- `VISION.md` movie detail guidance: actions should help users decide/save/watch/share without visual noise.
- `DESIGN_GUIDELINES.md`: respect platform conventions; use native-feeling interactions over custom workarounds.
- Current code: `src/components/MovieModal.vue` share button and fallback helpers.

## Starting context

`MovieModal.vue` already has a top-right share icon, deep-link generation via `?movie=`, native-share helper code, clipboard/manual fallbacks, and a status paragraph. The issue remains open, so implementation should verify the actual mobile path rather than assuming prior code fully satisfied it.

## Scope

### In scope

- Audit and adjust `shareMovie()`, `canUseNativeShare()`, and fallback order so `navigator.share({ title, url })` is attempted first when available.
- Keep clipboard/prompt fallback only for unsupported browsers or non-cancel native-share failures.
- Move fallback/status feedback so it is visually adjacent to the share icon on mobile and desktop.
- Ensure cancelled native share does not show a misleading success/failure message.
- Add a minimal local/manual verification note for mobile Web Share behavior.

### Out of scope

- Replacing the share icon with a menu.
- List-sharing behavior in Settings/List routes.
- Closing #47 without implementation evidence.
- Broad modal layout redesign.

## Technical guidance

- Prefer the simplest Web Share API path from the issue: `navigator.share({ title, url })`; include `text` only if it does not reduce support.
- Be careful with `navigator.canShare`; some browser support varies by payload shape. If `navigator.share` exists, avoid over-filtering valid URL shares.
- Keep the deep link stable: current movie detail URL should retain/produce `?movie=<imdbId>`.
- Use compact nearby feedback such as `Copied link` only after fallback copying succeeds.
- Do not break keyboard/focus behavior for the modal top line.

## Expected file impact

- `website/src/components/MovieModal.vue`
- Optional concise verification note in this sprint file after implementation.

## Implementation sequence

1. Reproduce/inspect current share flow from `MovieModal.vue`.
2. Simplify native-share detection and payload if needed.
3. Adjust fallback/status placement beside the share icon.
4. Verify the button still has an accessible name and stable focus behavior.
5. Run the required tests and document mobile/manual evidence.
6. Comment on #47 with implementation evidence; close only if fully satisfied.

## Acceptance criteria

- [x] On browsers with `navigator.share`, tapping the movie share icon attempts the native share sheet before any clipboard fallback.
- [x] On unsupported browsers, fallback copy/manual-link behavior remains available and reports status adjacent to the share icon.
- [x] Cancelling the native share sheet does not display “Shared”, “Copied”, or an error.
- [x] Generated shared URLs open the same title through the existing `?movie=<imdbId>` flow.
- [x] Share button remains keyboard-focusable and screen-reader labelled.

## Required tests

- Website build.
- Manual or mocked browser check for native-share path.
- Manual or mocked unsupported-browser fallback check.

## Verification commands

```bash
cd website
npm run build
```

Optional focused smoke test if practical:

```bash
cd website
npm run dev -- --host 0.0.0.0
```

## Handoff

Implementation agent: make the smallest share-only change, document how native share was verified, and comment on #47 with files changed and verification. Do not touch country metadata in this sprint.

## Dependencies unlocked

- Sprint 042 can proceed after this interaction regression is isolated and verified.

## Implementation note — 2026-07-30

Completed in this implementation slice. `MovieModal.vue` now attempts `navigator.share({ title, url })` whenever `navigator.share` exists, before any clipboard/manual fallback, without `navigator.canShare` over-filtering. Native share success and user cancellation stay silent; unsupported browsers and non-cancel native failures fall back to copy/prompt with compact feedback inside the same share-action cluster as the icon.

Verification:

- `npm run qa:issue47` — passed; static mocked checks cover native-first order, simple payload, cancel silence, fallback availability, adjacent feedback, and accessible button labelling.
- `npm run build` — passed.
- `curl http://100.85.92.106:5173/` — returned 200 with the existing Vite dev server.

Issue #47 commented/closed after verification.
