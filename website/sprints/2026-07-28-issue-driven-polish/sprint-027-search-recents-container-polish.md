# Sprint 027 — Search recents container polish

## Status
complete

## Outcome

Search recents no longer sit inside an ugly rounded container; recent searches/viewed titles blend with the Search surface while staying scannable and touch-friendly.

## Why now

Issue [#24](https://github.com/greg-26/static/issues/24) is a contained visual polish request with low implementation risk. It should not be bundled into broader Search behavior changes.

## Source requirements

- Issue #24: Search recents widget container has ugly border radius; use no radius or a subtler treatment that blends with the div container and poster.
- `VISION.md`: Search starts with the search bar at the top, results are vertical and scannable.
- `DESIGN_GUIDELINES.md`: stop nesting boxes inside boxes; use whitespace and grouping before borders.

## Starting context

- `SearchView.vue` renders recent search suggestions and recently viewed title cards.
- `recentActivity.js` owns local recent search/viewed storage.
- `SearchResultCard.vue` owns vertical result card styling; avoid changing it unless needed for visual alignment.

## Scope

### In scope

- Remove or soften the rounded/bordered recent container treatment called out in issue #24.
- Keep recent searches and recently viewed titles scannable and tappable.
- Preserve clear/click behavior and recent-activity storage semantics.
- Make the visual treatment mobile-first and consistent with current Search hierarchy.

### Out of scope

- Changing search ranking, Fuse behavior, or storage keys.
- Adding new recent-search features.
- Redesigning Search result cards beyond tiny alignment needed for the recents surface.

## Technical guidance

This should be a CSS/layout cleanup, not a component rewrite. Prefer deleting decorative wrapper styling over adding another layer.

## Expected file impact

- `src/components/SearchView.vue`
- `src/components/SearchResultCard.vue` only if a tiny shared surface alignment is necessary

## Implementation sequence

1. Inspect current Search recents markup/styles.
2. Remove or reduce the offending radius/container styling.
3. Check recently viewed poster alignment and touch targets at mobile width.
4. Run build and source/manual smoke.

## Acceptance criteria

- [x] Recent-search suggestions no longer render inside a visibly ugly rounded container.
- [x] Recently viewed items blend with the Search page without adding nested-card noise.
- [x] Clear recent searches and selecting a recent query still work.
- [x] Recent viewed title taps still open details.
- [x] No change to recent-activity storage keys or ranking behavior.

## Required tests

- Manual/source smoke for recent-search clear/select and recent-viewed click if local recent data exists.

## Verification commands

```bash
cd website
npm run build
git diff --check
```

## Handoff

Sprint 027 implementation complete on 2026-07-28.

Changes:

- Removed the rounded/bordered recent-search suggestions shell in `SearchView.vue`; the dropdown now uses only a thin block border and page-aligned list rows.
- Made recently viewed cards render as transparent Search rows with square row edges and subtly rounded posters, avoiding nested-card noise while preserving the existing `SearchResultCard` click path.
- Left `recentActivity.js`, search ranking, route query handling, clear behavior, and selection handlers unchanged.

Verification:

- `npm run build` — passed.
- `git diff --check` — passed.
- Source smoke: recent-search clear/select handlers and recently viewed `@select` path are unchanged.

Issue #24 should be commented/closed with this evidence and the final commit hash.

## Dependencies unlocked

- None; completes current Search recents polish request.
