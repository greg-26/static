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
- [x] Slice 10: made “Clear” respect the vision split between permanent Settings and temporary Discover controls by preserving configured streaming services and no longer counting them as session filters.
- [x] Verification: `npm run build` passed (Vite/PWA, 63 modules, 208.92 kB JS gzip 76.67 kB).
- [x] Slice 11: converted the Discover maturity control from a Settings shortcut into a real profile dropdown with Adults / Me / Family / With kids viewing contexts, while still linking detailed limits to Settings.
- [x] Verification: `npm run build` passed (Vite/PWA, 63 modules, 210.47 kB JS gzip 77.06 kB); dev routes `/`, `/discover`, `/search`, `/settings`, `/roadmap` returned HTTP 200 on port 5174.
- [x] Slice 12: added Search landing recents: debounced recent searches, recently viewed titles recorded on movie open, and reusable localStorage-backed recent activity helpers.
- [x] Slice 13: added Settings deep links `/settings/profile`, `/settings/streaming`, `/settings/maturity`, `/settings/lists`, `/settings/about`; Settings rows now open dedicated routes and streaming/maturity/list pages have first-pass native controls.
- [x] Slice 14: added temporary Discover `availabilityMode` (`my-services` vs `any`) so users can ignore configured services without deleting Settings subscriptions.
- [x] Slice 15: improved movie detail decision summary: suitability, availability against configured services, list/watched status, actual active profile label, provider sorting with selected services first, and fixed `mat === 0` compatibility handling.
- [x] Slice 16: reworked discovery row labels toward vision language: Recommended for this profile, Popular now, Hidden gems, Included with your services.
- [x] Verification: `npm run build` passed (Vite/PWA, 65 modules, 219.64 kB JS gzip 79.62 kB); dev routes `/`, `/discover`, `/search`, `/settings`, `/settings/streaming`, `/settings/maturity`, `/settings/lists`, `/roadmap` returned HTTP 200 on port 5174.
- [x] Slice 17: added list rename support and clarified list removal as “Remove from profile” until ownership/delete semantics exist.

## Current CX vs Vision status
- Delivered: primary Discover/Search/Settings IA, route-backed tabs, bottom navigation, Search as vertical retrieval, Search landing recents, Settings deep links, Discover list integration, temporary vs permanent filter separation, first-pass maturity profile presets, and clearer suitability/availability/list signals in cards/details.
- Partial: Settings subpages still reuse legacy modal for profile creation/import and detailed list/maturity editing; maturity profiles are presets over the existing single `maxMaturityCat` array, not fully persisted multi-profile entities.
- Deferred: structured collection/person search, true Included/Free/Rent/Buy provider groups, list rename/ownership semantics, and backend/scraper data changes.

## Next recommended slices
1. Persist real multi-profile maturity settings in `userStore.userData` (`activeMaturityProfileId`, `maturityProfiles`) and migrate current `filterPrefs.maxMaturityCat` into “Me”.
2. Extract Profile, Maturity, and Lists edit flows from `ConfigModal.vue` into the new Settings routes one section at a time.
3. Add ownership-aware list delete/leave semantics once ownership is modeled.
4. Add lightweight structured Search sections for inferred collections before backend person/collection data exists.

## Notes / assumptions
- Keep implementation local and reviewable; no external deploy until asked.
- Preserve current Pinia stores and KV merge behavior.
- Use existing data fields; do not invent backend support for availability categories or multi-profile maturity yet.
- Search is now first-class visually, but collection/person structured results remain future/backend work.
- Settings is now first-class as an index, but detailed edit screens still reuse the existing config modal to avoid risky persistence rewrites.
- Provider subscriptions now live visually in Settings, but still reuse the existing `selectedProviders` persistence path for compatibility.
- Named maturity profiles are still represented by current maturity limits for now; a real multi-profile data migration should be a separate slice.
