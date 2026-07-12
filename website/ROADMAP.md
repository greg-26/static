# Ohana TV Website Roadmap

This file tracks remaining product and UX ideas for the static `website` project. Completed items are moved to [`ROADMAP_DONE.md`](./ROADMAP_DONE.md).

## Product direction

- Default browsing type is **Both** movies and TV shows.
- Search remains broad for now: when query length triggers title search, it may ignore browse filters as the app currently does.
- The hero should prioritize **search and movie posters**. Filters must be easy to spot and use, but should not dominate the page.
- Prefer polished filter chips that open anchored overlay menus on top of the page, similar to compact multi-select dropdowns. Avoid revealing a hidden inline slot that pushes content down.

## Filters

### Rework providers as a compact provider filter

**Problem:** Provider filtering currently exposes every platform as a browse filter, which consumes too much UI space.

**Decision:** Do **not** force a separate “My providers” onboarding model for now. Treat providers as a normal optional filter.

**Plan:**
- Start with provider filtering off, meaning `Any provider`.
- Show one compact provider chip in the filter row:
  - `Any provider` when none are selected.
  - Provider name when one is selected, e.g. `Netflix`.
  - Count when multiple are selected, e.g. `3 providers`.
- Clicking the chip opens provider selection in an anchored overlay menu/dropdown.
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
- Clicking/long-pressing/opening the chip reveals detailed maturity controls in an anchored overlay menu/dropdown.
- Avoid duplicating controls in unrelated settings sections until there is a clear need.

**Acceptance notes:** Browsing has a simple `Safe` state while still allowing detailed maturity editing.

### Replace always-visible genre cloud with a genre chip

**Goal:** Keep genre access easy without letting genre chips crowd the hero.

**Decision:** Use one genre chip that opens the genre list on click/tap.

**Plan:**
- Show `Genres` when none are selected.
- Show the genre name when one is selected, e.g. `Comedy`.
- Show a count when multiple are selected, e.g. `3 genres`.
- Clicking the chip opens genre selection in an anchored overlay menu/dropdown.
- Keep selected genre state obvious and easy to clear.

### Chip + anchored menu filter pattern

**Direction:** Each filter starts as a simple, readable chip. Complex filters open a richer overlay menu anchored to that chip, like a compact multi-select dropdown. The menu appears on top of the page rather than revealing an inline hidden slot.

**Examples:**
- `Safe` → opens maturity levels.
- `Any provider` / `3 providers` → opens provider selection.
- `Both` / `Movies` / `TV Shows` → opens title-type selection.
- `Rating 7+` → opens rating slider.
- `Genres` / `Comedy` / `3 genres` → opens genre selection.

**Implementation notes:**
- Desktop and mobile: anchored overlay menu/dropdown with large touch targets.
- Keep menus above posters and other hero artwork; they must not be clipped by the hero container.
- Keep all controls keyboard accessible.
- Use the same visual language for active, inactive, and partially configured filters.

## Settings and navigation

### Keep settings, but reduce overload

**Problem:** The current settings gear/modal is becoming overloaded. Profile, lists, provider setup, maturity preferences, and future app sections need clearer organization.

**Decisions:**
- If provider, maturity, rating, and genre controls move into filter chips, the existing settings entry can remain settings-focused for now.
- Maturity and provider controls should not be duplicated in settings unless there is a later product reason.
- Lists need special attention: adding lists makes the current lists settings section too large.

**Plan:**
- Keep account/profile/settings concerns in Settings.
- Move day-to-day browse controls into the hero filter chip row.
- Collapse the Lists settings section so it does not expand into a giant panel.
- Keep Lists out of the browse filter chip row; list management belongs in Settings or a separate non-filter surface.
- Roadmap/About can remain accessible during development.

### Decouple settings into sections

**Goal:** Avoid one giant modal as the app grows.

**Plan:**
- Split current `ConfigModal.vue` responsibilities conceptually into Profile, Lists, and app/account settings.
- Implementation can remain in one component initially, but structure should move toward section components.
- Each section should own its state, validation, and save/error UX.
- Lists should be collapsed by default or shown one at a time to prevent the settings modal from becoming too tall.

## Technical notes / implementation order

Recommended next sequence:
1. Review and finish compact provider chip/menu behavior, including provider-specific rows when providers are selected.
2. Finish the Safe maturity chip so it cleanly relates to persisted `maxMaturityCat` thresholds.
3. Finish replacing the visible genre cloud with a compact genre chip + anchored multi-select menu.
4. Keep title type (`Both` / `Movies` / `TV Shows`) as an anchored dropdown chip, not a segmented inline control.
5. Collapse/split settings sections, especially Lists.
6. Revisit hamburger/menu only if settings still feels overloaded after browse filters move out.

## Review status

Updated on 2026-07-10 after moving completed work to `ROADMAP_DONE.md`.

Partially explored in the current worktree and still needs product/code review before treating as done:
- Compact chip filter row for genres, providers, rating, and Safe.
- Session-only Safe toggle for baseline explicit-content hiding.

Manual phone review still needed at the Tailscale dev URL, especially 320–430px settings overflow and row swipe behavior for the completed mobile cleanup.
