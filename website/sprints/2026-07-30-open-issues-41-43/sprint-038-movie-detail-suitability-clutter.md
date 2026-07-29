# Sprint 038 — Movie detail suitability clutter cleanup

## Status

complete

## Outcome

The movie detail suitability area removes redundant explanatory copy and gives maturity categories enough breathing room to scan on mobile.

## Why now

Issue [#43](https://github.com/greg-26/static/issues/43) is direct product feedback on the current movie detail page. It should land before adding more detail-page UI in #42 and #41.

## Source requirements

- GitHub issue #43: remove redundant `Compatible with: xx`, remove `Movie score vs. this profile...`, remove `Fits selected profile`, and add a tiny extra space between categories.
- `VISION.md`: movie details should explain suitability without redundant boxes or noisy repeated decision blocks.
- `DESIGN_GUIDELINES.md`: movie details should avoid duplicate decision blocks; use hierarchy and spacing instead of more containers.
- Current code: `src/components/MovieModal.vue` renders `Compatible with`, subcopy, profile fit pill, and the category grid.

## Starting context

The modal already has profile glance chips above the maturity section. The selected profile is therefore visible before the detailed rows, making another `Compatible with` heading and `Fits selected profile` pill redundant.

## Scope

### In scope

- Remove the explicit `Compatible with: <profile>` text from both populated and empty maturity-section states.
- Remove `Movie score vs. this profile’s allowed level.` copy.
- Remove the `Fits selected profile` / `Review before watching` / `No limit set` summary pill if it only restates the detail rows.
- Add small vertical spacing between maturity category rows/tags so Sex, Violence, Language, and Drugs read as separate categories on a phone.
- Preserve content-rating, IMDb guide, and CSM links.

### Out of scope

- Changing maturity scoring or thresholds.
- Reworking profile chips into a new component.
- Adding country metadata or sharing.
- Removing detailed category reasoning.

## Technical guidance

- Keep the maturity section heading short, for example `Suitability details` or `Maturity details`.
- Prefer CSS gap/spacing changes over extra wrapper boxes.
- Be careful with both `compatibilityRows.length` and empty-score branches in `MovieModal.vue`.
- If removing `compatibilityOk` leaves dead computed/state/CSS, clean it up only when obviously unused.

## Expected file impact

- `website/src/components/MovieModal.vue`
- Possibly related CSS in the same file only.

## Implementation sequence

1. Edit the maturity-section headings/actions in `MovieModal.vue`.
2. Remove redundant summary copy/pill while preserving useful rating/link actions.
3. Adjust row/tag spacing for mobile readability.
4. Run build and inspect the detail page on a narrow viewport.

## Acceptance criteria

- [x] The movie detail page no longer shows `Compatible with: <profile>`.
- [x] The movie detail page no longer shows `Movie score vs. this profile’s allowed level.`.
- [x] The selected-profile fit summary pill is gone; empty-score state uses copy plus guide links instead of an extra `Unknown` pill.
- [x] Maturity categories have clearer vertical gap/tag spacing without adding wrappers or a larger boxed section.
- [x] Content rating, IMDb guide, CSM link, and category score/reasoning remain available.

## Required tests

- `npm run build`
- Manual/narrow viewport check of a movie detail page with maturity rows.

## Verification commands

```bash
cd website
npm run build
git diff --check
```

## Handoff

Comment on #43 with changed files, build result, and any mobile/manual caveat. Close #43 only after implementation evidence confirms the issue is fully satisfied.

## Dependencies unlocked

- Sprint 039 share action can add a new top-right action after the detail page is quieter.
- Sprint 040 country metadata can add detail metadata without compounding existing clutter.


## Implementation handoff — 2026-07-30

Status: complete.

Changed files:

- `src/components/MovieModal.vue`

Verification:

- `npm run build` — passed.
- `npm run qa:modal` — passed.
- `git diff --check` — passed.
- Dev server reachability: `http://100.85.92.106:5173/` returned HTTP 200.

Notes:

- Removed the duplicate `Compatible with: <profile>` heading, the score-vs-limit subcopy, and selected-profile summary pills from populated and empty suitability states.
- Kept rating badges, IMDb guide, CSM links, category score bars, allowed-level copy, status, and supporting tags.
- Added small spacing between suitability rows/tags. Source-level/narrow-layout review only; no real phone screenshot was captured in this cron run.
