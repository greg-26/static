# Sprint 034 — Discover list menu manage action

## Status

ready

## Outcome

The Discover `From your lists` row uses its existing list chooser menu as the single place for list selection plus the `Manage lists` action, removing the separate row-level Manage lists chip.

## Why now

Issue #36 is small, user-visible, and aligns with the existing provider/list chip-menu pattern: configuration actions belong at the end of the menu, not as extra row chrome competing with content actions.

## Source requirements

- [Issue #36 — Website - discover - list row - manage link](https://github.com/greg-26/static/issues/36)
- `DESIGN_GUIDELINES.md`: reduce noise, progressive disclosure, compact controls.
- `CODING_STANDARDS.md`: chips stay one line and controls should reuse existing patterns.

## Starting context

- `src/components/FromYourLists.vue` renders a `FilterMenu` list selector in the row label area.
- The same component currently renders `See all` and `Manage lists` chips in the row actions slot.
- The component already emits `manage`, so implementation should be able to move the trigger without changing parent route behavior.

## Scope

### In scope

- Add `Manage lists` as the final option/action inside the From-your-lists chooser menu.
- Remove the separate row action `Manage lists` chip from the Discover row.
- Keep `See all` available where it exists today.
- Preserve current list selection behavior and preview thumbnails.
- Ensure the menu closes when `Manage lists` is activated.

### Out of scope

- Reworking list data, persistence, or profile behavior.
- Adding rename/share/remove actions to Discover; list detail management is Sprint 035.
- Changing provider or other filter menus.

## Technical guidance

- Start in `src/components/FromYourLists.vue`.
- Reuse the current `manage` event; do not hardcode router navigation inside this component if the parent already owns it.
- Treat `Manage lists` as a menu action, not a radio option. Use appropriate `role="menuitem"`, not `menuitemradio`.
- Place it visually after the list choices with a small separator or spacing if needed, but avoid a heavy box.
- Keep touch states stable; avoid hover-only behavior that sticks on mobile.

## Expected file impact

- `src/components/FromYourLists.vue`
- Possibly scoped CSS in the same file only.

## Implementation sequence

1. Inspect how the parent handles the `manage` event from `FromYourLists`.
2. Add a final menu action inside the existing list chooser menu that emits `manage` and closes the menu.
3. Remove the row-level `Manage lists` chip while keeping `See all` unchanged.
4. Verify keyboard/touch semantics and no wrapping in the menu.

## Acceptance criteria

- [ ] The Discover From-your-lists row no longer shows a separate `Manage lists` chip beside `See all`.
- [ ] Opening the list chooser menu shows `Manage lists` at the end.
- [ ] Tapping/clicking `Manage lists` navigates to the same Settings list management destination as before.
- [ ] Existing list selection and previews still work.
- [ ] The menu action is accessible as a menu item and closes the menu after activation.

## Required tests

- Smoke-test Discover with at least one saved/imported list.
- Check the list menu on a narrow/mobile viewport.

## Verification commands

```bash
cd website
npm run build
git diff --check
```

## Handoff

After implementation, comment on issue #36 with the changed files, verification result, and any manual mobile check caveat. Do not close until the behavior is verified.

## Dependencies unlocked

- Sprint 035 can reuse the cleaner list-management model but is not strictly blocked by this sprint.
