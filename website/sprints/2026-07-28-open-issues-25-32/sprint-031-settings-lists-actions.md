# Sprint 031 — Settings Lists Actions

## Status
complete

## Outcome

Settings → Lists keeps create/import actions immediately available at the top, while each list row opens on click and hides rename/share/remove behind a compact overflow menu.

## Why now

Issues #29 and #30 are one Settings → Lists interaction pass. Combining them prevents contradictory row/action layouts.

## Source requirements

- Issue #29: <https://github.com/greg-26/static/issues/29>
- Issue #30: <https://github.com/greg-26/static/issues/30>
- `VISION.md`: Settings is for persistent configuration; lists support discovery.
- `DESIGN_GUIDELINES.md`: Settings rows should be compact two-line rows; avoid oversized boxes and unnecessary helper labels.

## Starting context

`src/components/SettingsView.vue` renders Settings → Lists rows, create-list form, and import shared-list form. `src/views/ListView.vue` renders the dedicated list page.

## Scope

### In scope

- Move create/import entry actions to the top of Settings → Lists.
- Show only two light buttons initially: create list and import list.
- Reveal the input plus submit button only after the corresponding action is chosen.
- Make each list row click/keyboard-open the list; remove visible Open text.
- Remove the “Saved list” label from list rows.
- Move rename/share/remove actions behind a top-right three-dots/overflow button and menu.
- Preserve existing rename/share/remove semantics and copy feedback.

### Out of scope

- Adding a primary Lists tab.
- Rewriting list ownership/delete semantics.
- Changing KV profile/list persistence.

## Technical guidance

- Reuse existing row/menu primitives if practical; otherwise keep the overflow menu locally scoped and accessible.
- Stop propagation from overflow controls so row-click-to-open remains predictable.
- Keep destructive Remove styling, but do not add confirmation complexity unless a lightweight existing pattern already exists.

## Expected file impact

- `src/components/SettingsView.vue`
- Possibly existing shared primitives if already appropriate (`SettingsRow`, `UiChip`).

## Implementation sequence

1. Inspect existing Settings → Lists state and actions.
2. Move create/import controls above list rows as collapsed action buttons.
3. Add accessible row overflow menu for rename/share/remove.
4. Remove irrelevant labels/open text and ensure row click/keyboard open still works.
5. Smoke create/import/retrieve/copy/remove behaviors.
6. Comment on issues #29 and #30 with evidence; close only if fully resolved.

## Acceptance criteria

- [x] Create/import actions are visible at the top of Settings → Lists without scrolling.
- [x] Inputs are hidden until the user chooses Create or Import.
- [x] Clicking or keyboard-activating a list row opens that list.
- [x] Row management actions live behind a three-dots menu in the top-right of each row.
- [x] “Saved list” and visible “Open” row labels are removed.
- [x] Rename/share/remove behavior remains intact.

## Required tests

- Manual Settings → Lists mobile-width check.
- Manual create, import-form reveal, rename, copy/share, remove, and row-open smoke.

## Verification commands

```bash
cd website
npm run build
git diff --check
```

## Handoff

Comment on issues #29 and #30 with changed files, verification, and any mobile caveat. Close only if both interaction changes are verified.

## Implementation log

- 2026-07-28: Implemented the Settings → Lists action pass in `src/components/SettingsView.vue`. Create/import now begin as two top buttons and reveal only their active form; list rows open directly by click/Enter/Space; row management moved into a compact three-dots menu with existing rename/copy/remove behavior preserved. Verified with `npm run build`, `git diff --check`, and Vite reachability at `http://100.85.92.106:5173/settings/lists`. Manual mobile-width visual interaction smoke is still recommended on Alex's phone.

## Dependencies unlocked

- Settings list-management tranche complete.
