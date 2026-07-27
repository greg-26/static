# Sprint 027 — Search recents container polish

## Status
ready

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

- [ ] Recent-search suggestions no longer render inside a visibly ugly rounded container.
- [ ] Recently viewed items blend with the Search page without adding nested-card noise.
- [ ] Clear recent searches and selecting a recent query still work.
- [ ] Recent viewed title taps still open details.
- [ ] No change to recent-activity storage keys or ranking behavior.

## Required tests

- Manual/source smoke for recent-search clear/select and recent-viewed click if local recent data exists.

## Verification commands

```bash
cd website
npm run build
git diff --check
```

## Handoff

Implementation agent: comment on issue #24 with before/after evidence after implementation.

## Dependencies unlocked

- None; completes current Search recents polish request.
