# Sprint 026 — List menu previews

## Status
ready

## Outcome

The lists menu gives users a quick sense of each list by showing compact poster previews from the first few movies/shows, without promoting Lists into a new primary app destination.

## Why now

Issue [#23](https://github.com/greg-26/static/issues/23) asks for small poster previews in the lists menu so users can recognize what is inside before opening a list.

## Source requirements

- Issue #23: show poster of the first few movies/shows on the lists menu, using a small carousel/preview so users can sense the list contents.
- `DESIGN_GUIDELINES.md`: lists support discovery; avoid making lists compete visually with recommendations.
- Existing IA: Discover/Search/Settings remain the primary tabs.

## Starting context

- `FromYourLists.vue` contains the lists chooser/menu in Discover.
- `ListView.vue` renders full list browsing at `/lists/:listId`.
- `user.js` and the movies store already know saved list ids and movie poster data.

## Scope

### In scope

- Add compact poster-preview thumbnails to each list option in the Discover lists menu/chooser.
- Use the first few resolvable saved titles with poster fallbacks that do not create layout jumps.
- Keep previews one-line/compact on mobile; no wrapping poster walls inside the menu.
- Preserve the existing ability to open/select a list.

### Out of scope

- Creating a new primary Lists tab.
- Redesigning the full `/lists/:listId` page.
- Changing list share/copy/manage semantics.
- Fixing menu-open coordination; Sprint 025 owns that dependency.

## Technical guidance

Use existing poster data already loaded in the movies store. If a list item cannot resolve to a movie/poster, skip that thumbnail or show a quiet tiny fallback; do not fetch extra API details just for menu previews.

## Expected file impact

- `src/components/FromYourLists.vue`
- `src/stores/movies.js` only if a tiny resolver helper is needed
- CSS in the same component or existing shared primitives if appropriate

## Implementation sequence

1. Inspect list item structure and movie lookup availability.
2. Build a computed preview array per list capped at a small mobile-safe count.
3. Render previews inside each menu option without changing selection/open behavior.
4. Add fallback/empty states for lists without resolvable posters.
5. Run build and mobile-width menu smoke.

## Acceptance criteria

- [ ] Each populated list option shows up to a few compact poster previews when posters are available.
- [ ] Preview thumbnails do not wrap, overflow awkwardly, or make chip/menu labels two-line on mobile.
- [ ] Lists with missing posters remain selectable and visually stable.
- [ ] Selecting/opening lists works as before.
- [ ] No new primary Lists navigation tab is added.

## Required tests

- Manual/source smoke with at least one list containing several saved movies and one empty/sparse list if practical.

## Verification commands

```bash
cd website
npm run build
git diff --check
```

## Handoff

Implementation agent: comment on issue #23 with evidence after implementation. Note if local data lacks enough list contents to manually verify poster variety.

## Dependencies unlocked

- None; completes list-menu preview request.
