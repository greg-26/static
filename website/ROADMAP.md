# Ohana TV Website Roadmap

This file tracks product and UX ideas for the static `website` project. Items here are proposals only until explicitly picked up for implementation.

## Product direction

- Default browsing type is **Both** movies and TV shows.
- Search remains broad for now: when query length triggers title search, it may ignore browse filters as the app currently does.
- The hero should prioritize **search and movie posters**. Filters must be easy to spot and use, but should not dominate the page.
- Prefer a polished chip + rich menu / mobile bottom sheet UX. It is OK to go bigger on UX if the improvement is contained and testable.

## Near-term UX fixes

### Fix settings width overflow on maturity limits

**Problem:** In Settings → Family maturity limits, selecting several category limits creates a long summary string. On narrow screens it overflows horizontally and can break the modal layout.

**Plan:**
- Keep the settings modal constrained to viewport width at all times.
- Replace long inline maturity summaries with wrapped chips or a compact summary like `4 active limits` until the maturity controls move into filter UX.
- Make the expanded maturity controls wrap cleanly and avoid any `white-space: nowrap` on user-generated/variable-length summaries.
- Regression-check mobile widths around 320–430px.

**Acceptance notes:** No horizontal page/modal scrolling when all maturity categories are enabled with long labels.

### Remove movie-row scroll arrows on mobile

**Problem:** Horizontal row arrows are unnecessary on touch devices and steal visual space.

**Plan:**
- Hide `.row-arrow` under the mobile breakpoint.
- Keep arrows on desktop and pointer-first layouts.
- Preserve native horizontal swipe scrolling and lazy rendering behavior.

**Acceptance notes:** Mobile rows swipe naturally with no visible arrows; desktop rows still show arrows when scrollable.

## Filters

### Add title-type filter: Movies / TV shows / Both

**Goal:** Let users choose whether browsing includes movies, TV shows, or both.

**Decisions:**
- Default to `Both`.
- Search should ignore this filter for now, matching the current broad-search behavior.
- Local `movies.json` appears to mark TV shows with `s: 1`; missing/false means movie unless data proves otherwise.

**Plan:**
- Add a compact segmented chip/control: `Movies`, `TV Shows`, `Both`.
- Persist the last selected control per profile with existing filter preferences.
- Keep the default for new/unconfigured profiles as `Both`.

### Rework providers as a compact provider filter

**Problem:** Provider filtering currently exposes every platform as a browse filter, which consumes too much UI space.

**Decision:** Do **not** force a separate “My providers” onboarding model for now. Treat providers as a normal optional filter.

**Plan:**
- Start with provider filtering off, meaning `Any provider`.
- Show one compact provider chip in the filter row:
  - `Any provider` when none are selected.
  - Provider name when one is selected, e.g. `Netflix`.
  - Count when multiple are selected, e.g. `3 providers`.
- Clicking the chip opens provider selection in a rich menu/bottom sheet.
- Persist selected providers per profile using the existing filter preference mechanism.
- If no provider is selected, browsing can still show some provider rows.
- If providers are selected, create rows like `On Netflix` for each selected provider with relevant movies available there.

**Acceptance notes:** Main filter area no longer lists every provider, but provider filtering remains obvious and fast.

### Make maturity filtering a default “Safe” filter

**Problem:** Maturity limits are currently configured in Settings and surfaced as a long summary. The concept is right, but the browsing control should be simpler.

**Decisions:**
- Focus maturity controls in the filter UX; avoid duplicating the same controls in Settings for now.
- Remember the user’s last controls, but for the next session default Safe to on when maturity limits exist.

**Plan:**
- Keep detailed maturity thresholds as profile/filter preferences.
- Add a primary filter chip/toggle: `Safe` / shield icon.
- Clicking/long-pressing/opening the chip reveals detailed maturity controls in a rich menu or mobile bottom sheet.
- Avoid duplicating controls in unrelated settings sections until there is a clear need.

**Acceptance notes:** Browsing has a simple `Safe` state while still allowing detailed maturity editing.

### Replace always-visible genre cloud with a genre chip

**Goal:** Keep genre access easy without letting genre chips crowd the hero.

**Decision:** Use one genre chip that opens the genre list on click/tap.

**Plan:**
- Show `Genres` when none are selected.
- Show the genre name when one is selected, e.g. `Comedy`.
- Show a count when multiple are selected, e.g. `3 genres`.
- Clicking the chip opens genre selection in a rich menu/bottom sheet.
- Keep selected genre state obvious and easy to clear.

### Chip + rich menu / bottom sheet filter pattern

**Direction:** Each filter starts as a simple, readable chip. Complex filters open a richer control surface.

**Examples:**
- `Safe` → opens maturity levels.
- `Any provider` / `3 providers` → opens provider selection.
- `Rating 7+` → opens rating slider.
- `Both` / `Movies` / `TV Shows` → compact segmented type control.
- `Genres` / `Comedy` / `3 genres` → opens genre selection.

**Implementation notes:**
- Desktop: popover/rich menu anchored to the chip.
- Mobile: bottom sheet with large touch targets.
- Keep all controls keyboard accessible.
- Use the same visual language for active, inactive, and partially configured filters.

## Settings and navigation

### Keep settings, but reduce overload

**Problem:** The current settings gear/modal is becoming overloaded. Profile, lists, provider setup, maturity preferences, and future app sections need clearer organization.

**Decisions:**
- If provider, maturity, type, rating, and genre controls move into filter chips, the existing settings entry can remain settings-focused for now.
- Maturity and provider controls should not be duplicated in settings unless there is a later product reason.
- Lists need special attention: adding lists makes the current lists settings section too large.

**Plan:**
- Keep account/profile/settings concerns in Settings.
- Move day-to-day browse controls into the hero filter chip row.
- Collapse the Lists settings section so it does not expand into a giant panel.
- Consider showing lists in the chip row: clicking one list at a time opens its details/management surface.
- Roadmap/About can remain accessible during development.

### Decouple settings into sections

**Goal:** Avoid one giant modal as the app grows.

**Plan:**
- Split current `ConfigModal.vue` responsibilities conceptually into Profile, Lists, and app/account settings.
- Implementation can remain in one component initially, but structure should move toward section components.
- Each section should own its state, validation, and save/error UX.
- Lists should be collapsed by default or shown one at a time to prevent the settings modal from becoming too tall.

## Technical notes / implementation order

Recommended sequence:
1. Fix mobile overflow and hide row arrows on mobile — low risk, immediate CX cleanup.
2. Add title-type filter (`Both` default; TV likely `s: 1`; search ignores filters for now).
3. Replace provider chip cloud with compact provider chip and provider picker.
4. Introduce `Safe` chip and move detailed maturity controls behind a richer filter surface.
5. Replace visible genre cloud with compact genre chip + picker.
6. Collapse/split settings sections, especially Lists.
7. Revisit hamburger/menu only if settings still feels overloaded after browse filters move out.

## Review status

Updated with Alex's July 10 decisions. Not implemented yet except for making this roadmap visible at `/roadmap`.
