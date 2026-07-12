# Ohana Vision Execution

Started: 2026-07-12

## Objective
Deliver the new `VISION.md` direction incrementally: Discover/Search/Settings IA, discovery-first CX, separate search intent, settings as permanent configuration, and clearer appropriateness/availability/list signals.

## Current CX baseline
- Single hero mixes search + browse controls.
- Rows already support discovery, user lists, watched titles, provider/genre/rating/maturity filters.
- Search already ignores browse filters, but displays as a carousel row rather than a vertical intentional retrieval page.
- Settings is a modal with profile/lists/maturity all in one long surface, not a primary tab/index.
- Movie details already include synopsis, genres, lists/watched actions, maturity scores, providers, and external links, but compatibility is not framed around an active profile.

## Implementation plan
1. Create primary navigation: Discover, Search, Settings.
2. Split Discover and Search experiences without rewriting data/persistence.
3. Add a vertical Search page with annotated result cards.
4. Convert Settings into a first-class page/index while preserving existing modal flows only where useful.
5. Improve Discover list integration with a visible “From your lists” section.
6. Improve compatibility language in cards/details using existing maturity limits.
7. Run build after each meaningful slice and keep this file updated.

## Progress
- [x] Read `VISION.md`, `README.md`, `AGENTS.md`; `ROADMAP.md`/`ROADMAP_EXECUTION.md` are referenced but absent.
- [x] Spawned subagents for CX gap audit and code structure audit.
- [x] Slice 1: IA tabs + separate Discover/Search/Settings pages.
- [x] Slice 2: vertical search result cards with compatibility/availability/list annotations.
- [x] Slice 3: settings index/page shell that opens existing config modal for edit flows.
- [x] Slice 4: Discover “From your lists” block with list selector and Manage action.
- [x] Slice 5: compatibility badges on cards and compatibility summary in movie details.
- [x] Fixed `/roadmap` page to render `VISION.md` because `ROADMAP.md` is gone.
- [x] Verification: `npm run build` passed (Vite/PWA, 58 modules, 181.95 kB JS gzip 67.13 kB).
- [x] Slice 6: changed primary navigation to iOS-style fixed bottom tabs and removed redundant floating gear.
- [x] Slice 7: brought Discover controls closer to vision: availability dropdown, maturity-profile entry, single-select genre, horizontal stepped rating.
- [x] Slice 8: moved streaming service provider selection into Settings so Discover can treat it as “Included with my services”.
- [x] Verification: `npm run build` passed (Vite/PWA, 58 modules, 182.43 kB JS gzip 67.25 kB).
- [x] Slice 9: added `vue-router`, real routes (`/discover`, `/search`, `/settings`, `/roadmap`), route-level `DiscoverView`, and simplified `App.vue` into shell/modal/bootstrap responsibilities.
- [x] Verification: `npm run build` passed (Vite/PWA, 63 modules, 208.94 kB JS gzip 76.67 kB) and local dev routes `/`, `/discover`, `/search`, `/settings`, `/roadmap` returned HTTP 200.

## Notes / assumptions
- Keep implementation local and reviewable; no external deploy until asked.
- Preserve current Pinia stores and KV merge behavior.
- Use existing data fields; do not invent backend support for availability categories or multi-profile maturity yet.
- Search is now first-class visually, but collection/person structured results remain future/backend work.
- Settings is now first-class as an index, but detailed edit screens still reuse the existing config modal to avoid risky persistence rewrites.
- Provider subscriptions now live visually in Settings, but still reuse the existing `selectedProviders` persistence path for compatibility.
- Named maturity profiles are still represented by current maturity limits for now; a real multi-profile data migration should be a separate slice.
