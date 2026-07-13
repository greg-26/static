# Current vision execution status

Last reorganized: 2026-07-13.

## Current CX vs Vision status
- Delivered: primary Discover/Search/Settings IA, route-backed tabs, bottom navigation, Search as vertical retrieval, reusable Search input primitive, Search landing recents, Settings deep links, native profile/list/maturity settings routes, custom maturity profile create/duplicate/rename/delete, Discover list integration, dedicated `/lists/:listId` poster-grid browsing, temporary vs permanent filter separation, compact mobile Discover hierarchy, persisted maturity profile selection/presets, clearer profile-aware suitability/availability/list signals in cards/details, movie-detail maturity hierarchy with raw parental-guide detail secondary, a narrowed shared-list invite modal instead of duplicate broad Settings modal UI, and `UiChip` support for semantic links plus buttons.
- Partial: manual mobile review is still needed for the new list grid, bottom-nav interaction, movie detail full-screen/close-button behavior, narrowed shared-list invite flow, lightweight structured Search sections/deep links/no-results state, the stacked mobile From your lists row actions, the Search no-mobile-autofocus/recent-chip/touch-card behavior, the flatter Settings subroutes, and the Discover hero after removing the redundant Settings shortcut.
- CEO feedback status: implemented locally: manage-list share behavior, Settings index two-line density, shorter **Available on …** row titles, duplicate movie-detail availability removal, cross-profile suitability glance, subtle row-title list selector, and Settings → Lists row-open navigation plus clipboard-first **Copied** share feedback. Implemented locally: source-level chip/dropdown color semantics now keep non-destructive selected/hover states teal or neutral, with red reserved for danger/destructive states. Still open: manual phone/touch verification of dropdown behavior and selected-state readability.
- PM/QA follow-up backlog: visible suitability reasoning for Adults/no-limit profiles, broader Search ranking regression review beyond the fixed exact-title `godfather` case, abstract availability annotations in Search results without provider-name clutter, non-destructive Search result hover/active colors, Settings input-label verification, list/profile gate copy, and modal-specific QA coverage.
- Deferred: true backend-backed collection/person search, true Included/Free/Rent/Buy provider groups, list ownership/delete semantics, and backend/scraper data changes.

## Active sprint

**Sprint 9 — PM/QA trust, retrieval, and accessibility follow-ups.**

Recently landed:

- Slice 73: exact-title search ranking now prefers canonical intent; `/search?q=godfather` ranks **The Godfather** (1972) first.
- Slice 74: Discover first row is profile-aware and primary Discover controls are normalized to English.
- Slice 75: Movie-detail suitability reasoning stays visible for Adults/no-limit profiles with explicit **No limit set** category rows.
- Slice 76: Search result cards show abstract availability annotations from existing provider bitmasks only, and Search result hover/active borders now use teal/neutral feedback instead of red.

Next useful slices:

1. Settings-route text input label/accessibility-name verification; current visible Settings inputs are wrapped by labels, so this should be a quick audit/test slice rather than a UI rewrite. If labels pass, use the slice to mop up non-destructive red focus indicators (`SearchBox`, Settings form inputs, Settings row focus) instead of changing copy or layout.
2. No-profile/wrong-profile copy for list-gated surfaces.
3. Modal QA coverage for movie-detail content, close control, focus/scroll state, suitability, and availability rows.

## Do not do yet
- Do not implement true Included/Free/Rent/Buy provider grouping until backend/scraper data supports it.
- Do not implement real person/studio search without backend data.
- Do not implement list ownership/delete semantics beyond current rename/remove-from-profile language.
- Do not rewrite profile/list persistence or KV merge behavior as part of UI cleanup.
- Do not deploy externally unless Alex asks.

## Notes / assumptions
- Keep implementation local and reviewable; no external deploy until asked.
- Preserve current Pinia stores and KV merge behavior.
- Use existing data fields; do not invent backend support for availability categories.
- Search is now first-class visually; collection/person structured results remain future/backend work except for a limited inferred-collection prototype.
- Settings is now first-class as an index, and core profile/list/maturity edit flows have route-backed pages; any remaining `ConfigModal.vue` dependency should be audited before removal.
- Provider subscriptions now live visually in Settings, but still reuse the existing `selectedProviders` persistence path for compatibility.
- Named maturity profiles now persist as profile presets in `filterPrefs.maturityProfiles`; custom create/duplicate/rename/delete UI exists in `/settings/maturity`.
- Latest remaining priority: Sprint 9 trust/accessibility items above. Code review confirms the next implementation should start with Settings input-label/focus-color audit or list/profile gate copy; avoid reopening completed CEO layout changes unless manual phone QA finds a regression.
