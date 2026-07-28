# Sprint 033 — Header brand and back-navigation compression

## Status

complete

## Outcome

The app header no longer stretches the non-square logo, and nested/settings/list routes use a compact, mobile-first back/header treatment instead of stacking a full brand header above labeled back controls.

## Why now

Open issues #34 and #35 both point at the same mobile chrome problem: the header consumes too much vertical space and the logo asset is visually wrong when forced into a square slot. Fixing chrome first reduces noise before more list-management polish.

## Source requirements

- [Issue #34 — Website - settings - back buttons](https://github.com/greg-26/static/issues/34)
- [Issue #35 — Ohana logo isn't square - remove it for now](https://github.com/greg-26/static/issues/35)
- `VISION.md` brand/header requirement: the main app header must visibly include the text `Ohana TV`.
- `DESIGN_GUIDELINES.md`: one hero per screen, mobile first-screen clarity, reduce visual noise.
- `CODING_STANDARDS.md`: reuse shared controls and avoid one-off chrome variants.

## Starting context

- `src/App.vue` renders a sticky header for every tab route with `/logo.png` plus `Ohana TV`.
- `src/views/ListView.vue` renders a separate `← Discover` chip below that global header.
- `src/components/SettingsView.vue` owns Settings subroutes and back affordances; inspect before editing because the issue is specifically about settings/back stacking.
- The logo is intentionally not being redesigned in this sprint; removal is the requested fix.

## Scope

### In scope

- Remove the image logo from app chrome for now.
- Preserve visible `Ohana TV` text on top-level app routes where the brand header is shown.
- Compress child-route navigation so Settings subroutes and list detail pages do not show excessive stacked chrome.
- Prefer a chevron-only or very compact back control where a child page needs navigation back to its parent.
- Keep tap targets accessible on mobile.

### Out of scope

- Designing a new logo or square asset.
- Changing bottom-tab behavior.
- Changing route definitions beyond what is needed for chrome/back rendering.
- Reworking Settings content or list-management actions; those are covered by later sprints.

## Technical guidance

- Start in `src/App.vue`, `src/components/SettingsView.vue`, and `src/views/ListView.vue`.
- Use route metadata or existing route names to decide when a full brand header is appropriate versus compact child chrome.
- Avoid duplicating large header markup in every view. If a reusable app-bar/back primitive is warranted, keep it tiny and product-named.
- Use an icon/chevron character or existing SVG pattern; do not use emoji.
- Make sure the active brand text still appears for main tabs such as Discover/Search/Settings home.

## Expected file impact

- `src/App.vue`
- `src/components/SettingsView.vue`
- `src/views/ListView.vue`
- Possibly `src/assets/global.css` or a tiny shared component if needed.

## Implementation sequence

1. Inspect current route metadata and Settings/ListView chrome.
2. Remove the logo image from the global app header while retaining `Ohana TV` text where the header remains.
3. Add or adjust compact child-page back/header behavior for Settings subroutes and list detail.
4. Replace labeled back chips with chevron-first compact controls where appropriate.
5. Check narrow/mobile layout for first-screen vertical space and tap targets.

## Acceptance criteria

- [x] The app header no longer renders `/logo.png` or any stretched logo image.
- [x] Top-level app routes still visibly show `Ohana TV` in app chrome.
- [x] Settings subroutes do not stack a full logo/brand header above a bulky labeled back button.
- [x] The dedicated list route has a compact back affordance to Discover or the appropriate parent.
- [x] Back controls are keyboard-accessible and have accessible labels.
- [x] Mobile viewport spacing is visibly reduced versus the previous header + labeled-back stack.

## Required tests

- Smoke-test `/discover`, `/search`, `/settings`, `/settings/lists`, and one `/lists/:listId` URL when data/profile state allows.
- Check a narrow viewport around 390px wide.

## Verification commands

```bash
cd website
npm run build
git diff --check
```

## Handoff

After implementation, comment on issues #34 and #35 with the changed files, verification result, and whether mobile manual validation is still pending. Do not close the issues unless implementation evidence is complete.

## Implementation notes

- Completed 2026-07-28: `src/App.vue` now switches between top-level `Ohana TV` brand chrome and compact child-route chrome with an accessible chevron back control.
- Removed `/logo.png` from the app header instead of forcing the non-square asset into a square slot.
- Removed duplicate in-view back chips from Settings subroutes and dedicated list routes; `/settings/:section` backs to Settings, `/lists/:listId` backs to Discover.
- Verification: `npm run build`, `git diff --check`, grep confirmed no header `logo.png`, and Vite returned HTTP 200 for `/`, `/discover`, `/search`, `/settings`, `/settings/profile`, `/settings/lists`, and `/lists/not-a-real-list`. Narrow/mobile visual validation remains limited to CSS/layout inspection in this cron run.

## Dependencies unlocked

- Sprint 034 and Sprint 035 can proceed independently, but benefit from the cleaner header/back baseline.
