# Sprint 035 — List detail management menu

## Status

ready

## Outcome

A user viewing a specific saved list can rename it, copy/share its link, or remove it from the current profile without backing out to Settings → Lists.

## Why now

Issue #33 reports a real workflow gap: list management is available in the previous Settings screen but not inside the list itself, where the user naturally discovers the need to rename/share/delete.

## Source requirements

- [Issue #33 — Website - Settings - lists](https://github.com/greg-26/static/issues/33)
- `DESIGN_GUIDELINES.md`: lists support discovery; share/copy interactions should complete the task with brief copied feedback.
- `CODING_STANDARDS.md`: reuse settings/list row/menu patterns instead of divergent controls.

## Starting context

- `src/components/SettingsView.vue` already implements per-list three-dot actions: rename, copy link, remove.
- `src/views/ListView.vue` shows a dedicated list page with a back chip, list title, count, and poster grid, but no management menu.
- `src/stores/user.js` exposes existing list operations and share URL helpers.

## Scope

### In scope

- Add a compact three-dot menu to the dedicated list view when the current list exists and the profile is logged in.
- Include rename, copy/share link, and remove actions matching Settings → Lists behavior.
- Show local copied feedback after copying the share link; use clipboard fallback if needed.
- After removing the current list, navigate to an appropriate safe destination such as `/settings/lists` or `/discover`.
- Keep the list page mobile-first and avoid adding bulky management panels.

### Out of scope

- Changing list ownership semantics or backend/KV persistence.
- Adding create/import controls to the dedicated list view.
- Changing Discover row list management; that is Sprint 034.
- Closing or deleting GitHub issues.

## Technical guidance

- Prefer extracting shared list menu behavior from `SettingsView.vue` only if duplication becomes awkward. A small local implementation is acceptable if it remains consistent and tiny.
- Use existing `userStore.renameList`, `userStore.getShareUrl`, and `userStore.removeList` methods.
- Keep the destructive action visually distinct but not dominant.
- Ensure menu clicks do not trigger movie/grid interactions.
- Confirm the route handles a removed list gracefully.

## Expected file impact

- `src/views/ListView.vue`
- Possibly `src/components/SettingsView.vue` only if shared code is extracted.
- Possibly a small shared component/composable if it reduces duplicate list action code.

## Implementation sequence

1. Inspect current Settings list menu behavior and copy wording/state.
2. Add a compact menu in `ListView.vue` header/actions area for the active list.
3. Wire rename/copy/remove through existing `userStore` methods.
4. Add copied state and fallback handling consistent with Settings.
5. Verify removal routing and missing-list fallback.

## Acceptance criteria

- [ ] A three-dot management menu appears on an existing dedicated list page.
- [ ] The menu includes rename, copy/share link, and remove actions.
- [ ] Rename updates the current list title without requiring navigation back to Settings.
- [ ] Copy/share writes the list URL to the clipboard and shows brief local `Copied` feedback; fallback is available when clipboard write fails.
- [ ] Remove detaches the list from the profile and routes the user to a safe page or clear empty/missing state.
- [ ] The layout remains compact on mobile and does not push the poster grid unnecessarily far down.

## Required tests

- Smoke-test a logged-in profile with at least one list.
- Exercise rename, copy/share, and remove on a narrow/mobile viewport.
- Check the missing-list state after removal.

## Verification commands

```bash
cd website
npm run build
git diff --check
```

## Handoff

After implementation, comment on issue #33 with changed files, verification result, and any manual validation caveat. Do not close until the workflow is verified.

## Dependencies unlocked

- Completes the current list-management issue tranche when Sprint 033 and Sprint 034 are also done.
