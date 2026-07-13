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
5. Improve Discover list integration with a visible “From your lists” section: no extra banner/headline like “Start with what you already saved.”; the first row itself should be “From your lists”, respect the active Discover filters, and include an All lists/specific-list dropdown.
6. Improve compatibility language in cards/details using existing maturity limits.
7. Add a dedicated list route/view where the URL input is the list id (`/lists/:listId`) and the page shows all movies in that list as a poster grid, not a horizontal row; each specific-list row should expose a “See all” link to that route.
8. Run build after each meaningful slice and keep this file updated.
9. todo: Principal SDE to include in sprint plans — [QA deep-dive report](reports/qa-deep-dive/2026-07-13-principal-sde-qa-report.md).
10. todo: Planning agents must review and address — [PM-tech vision/CX report](reports/pmt/2026-07-13-pm-tech-vision-cx-report.md).
11. todo: CEO feedback process correction and product follow-up — [Manage-list share and Settings density CEO feedback](reports/ceo/2026-07-13-manage-list-share-settings-density-ceo-feedback.md).
12. todo: Planning agents must review and address — [Principal engineer plan](reports/principal-engineer/2026-07-13-principal-engineer-plan.md).
13. todo: CEO feedback to route through PM/design/engineering — [Settings lists open/copy-share CEO feedback](reports/ceo/2026-07-13-settings-lists-open-copy-share-ceo-feedback.md).

## Durable agent prompts
- CEO assistant prompt: [`agents/ceo-assistant.md`](agents/ceo-assistant.md) → captures Alex/CEO feedback in `reports/ceo/`, then routes PM/design/engineering follow-up without implementing ad hoc.
- PM-tech reviewer prompt: [`agents/pmt.md`](agents/pmt.md) → writes reports to `reports/pmt/` and links new reports here.
- Principal engineer prompt: [`agents/principal-engineer.md`](agents/principal-engineer.md) → writes reports/plans to `reports/principal-engineer/` and links new reports here.
- QA/CX prompt: [`agents/qa.md`](agents/qa.md) → uses the global QA/CX harness, writes reports to `reports/qa/`, stores evidence under report folders, and links new reports here.

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
- [x] Slice 18: re-audited CX vs `VISION.md` with focused subagents; prioritized mobile Discover hierarchy, list integration, card availability/compatibility clarity, Settings copy, and maturity profile persistence.
- [x] Slice 19: compacted mobile Discover hero/controls so recommendations appear sooner and controls scroll horizontally instead of wrapping into chip soup.
- [x] Slice 20: made “All lists” in Discover a single deduped combined row (max 24 titles) so lists support discovery instead of pushing recommendation rows away.
- [x] Slice 21: clarified movie/search cards with profile-aware compatibility labels (`Fits Family`, `Review for With kids`) and separate primary provider badges instead of provider-or-genre ambiguity.
- [x] Slice 22: introduced persisted maturity profile state (`activeMaturityProfileId`, `maturityProfiles`) while preserving legacy `maxMaturityCat` migration into “Me”.
- [x] Slice 23: removed provisional implementation language from Settings maturity UX.
- [x] Verification: `npm run build` passed (Vite/PWA, 65 modules, 222.08 kB JS gzip 80.29 kB); dev routes `/`, `/discover`, `/search`, `/settings`, `/settings/profile`, `/settings/streaming`, `/settings/maturity`, `/settings/lists`, `/roadmap` returned HTTP 200 on port 5174.
- [x] Slice 24: extracted profile create/restore/name/token/logout flows into `/settings/profile`, removing the legacy settings modal dependency for core profile actions.
- [x] Slice 25: extracted list create/import/share/rename/remove-from-profile flows into `/settings/lists`, keeping ownership/delete semantics out of scope.
- [x] Verification: `npm run build` passed (Vite/PWA, 65 modules, 226.11 kB JS gzip 81.38 kB); same dev route smoke set returned HTTP 200 on port 5174.
- [x] Slice 26: collapsed the legacy “Healthiness” block into secondary “Parental-guide details” so the movie detail decision hierarchy leads with suitability/availability/list state.
- [x] Verification: `npm run build` passed (Vite/PWA, 65 modules, 226.13 kB JS gzip 81.38 kB); same dev route smoke set returned HTTP 200 on port 5174.
- [x] Slice 27: moved detailed maturity category limits into `/settings/maturity`, so the primary Settings route no longer depends on the legacy modal for this core flow.
- [x] Verification: `npm run build` passed (Vite/PWA, 65 modules, 226.72 kB JS gzip 81.52 kB); same dev route smoke set returned HTTP 200 on port 5174.
- [x] Slice 28: re-read the expanded `AGENTS.md` design guidance and re-audited CX against it. Main gaps added to plan: Discover chrome/list weight, metadata-heavy cards, disabled future controls, stale legacy modal surface, and custom maturity profile management.
- [x] Slice 29: added custom maturity profile create/duplicate/rename/delete in `/settings/maturity` while preserving built-in presets and existing persisted `filterPrefs.maturityProfiles` storage.
- [x] Slice 30: removed disabled future availability choices from Discover and deleted stale `family-pill` CSS noise from `HeroSection.vue`.
- [x] Captured Alex review feedback in `VISION.md` specifics, `AGENTS.md`, and `CODING_STANDARDS.md`: Discover dedupe, Ohana TV header, no nested boxes, no platform badges on posters, icon-only bottom nav, one-line chips, and reusable components.
- [x] Slice 31: implemented first feedback sprint: Discover row-start diversity in `movies.js`, visible **Ohana TV** app header, icon-only SVG bottom tabs, Search input at the top without decorative wrapper, compact Settings index via reusable `SettingsRow`, removed provider/platform badges from poster/search cards, and enforced one-line chip truncation on cards/search results.
- [x] Verification: `npm run build` passed (Vite/PWA, 68 modules, 232.18 kB JS gzip 83.95 kB); dev routes `/`, `/discover`, `/search`, `/settings`, `/settings/streaming`, `/settings/maturity`, `/settings/lists`, `/roadmap` returned HTTP 200 on port 5174.
- [x] Slice 32: started the reusable-components pass with `UiBadge` for card/search metadata badges and `SectionHeader` for repeated section heading/action layouts in list/search surfaces.
- [x] Verification: `npm run build` passed (Vite/PWA, 72 modules, 233.45 kB JS gzip 84.29 kB); dev routes `/`, `/discover`, `/search`, `/settings`, `/settings/streaming`, `/settings/maturity`, `/settings/lists`, `/roadmap` returned HTTP 200 on port 5174.
- [x] Slice 33: continued the polish/reusable sprint: moved watched/list status off poster overlays into the quieter card title row, reused `UiBadge` in movie details for TV/MPA/genre badge surfaces, and reused `SectionHeader` for Settings page headings.
- [x] Verification: `npm run build` passed (Vite/PWA, 72 modules, 233.59 kB JS gzip 84.38 kB); dev routes `/`, `/discover`, `/search`, `/settings`, `/settings/streaming`, `/settings/maturity`, `/settings/lists`, `/roadmap` returned HTTP 200 on port 5174.
- [x] Slice 34: applied Alex feedback on Search: removed the explanatory hero copy and empty-state prompt between the search box and results/recents, tightening Search into search field first, content immediately after.
- [x] Verification: `npm run build` passed (Vite/PWA, 72 modules, 233.11 kB JS gzip 84.18 kB); dev routes `/search`, `/settings`, `/discover` returned HTTP 200 on port 5174.
- [x] Slice 35: started the reusable interactive-chip primitive with `UiChip`, then reused it for Settings streaming-service toggles and maturity limit choices so selected/disabled/one-line chip behavior is centralized.
- [x] Verification: `npm run build` passed (Vite/PWA, 74 modules, 232.72 kB JS gzip 84.08 kB); dev routes `/settings`, `/settings/streaming`, `/settings/maturity` returned HTTP 200 on port 5174.
- [x] Slice 36: finished the list-first Discover correction: removed the promo panel/headline from `FromYourLists.vue`, kept only lightweight All lists/specific-list controls, kept the row heading exactly **From your lists**, capped previews at 24, and filtered saved-list previews through active Discover filters.
- [x] Verification: `npm run build` passed (Vite/PWA, 74 modules, 233.59 kB JS gzip 84.37 kB); dev routes `/discover`, `/settings`, `/settings/streaming`, `/settings/maturity` returned HTTP 200 on port 5174.
- [x] Slice 37: added dedicated `/lists/:listId` saved-list browsing with a responsive poster grid, calm invalid/missing-list states, movie modal integration, and **See all** links from specific Discover list previews.
- [x] Verification: `npm run build` passed (Vite/PWA, 76 modules, 236.14 kB JS gzip 85.00 kB); dev route smoke `/discover`, `/lists/bad-id`, and `/settings/lists` returned HTTP 200 on port 5174.
- [x] Captured Alex feedback from 2026-07-13 in `VISION.md` and `AGENTS.md`: mobile movie details should be full-screen with a fixed top close button, and detail suitability must expose per-movie score/detail reasoning instead of only summary verdicts.
- [x] Slice 38: tightened movie details against that feedback: mobile close is fixed at the top safe area while scrolling, and suitability rows now show per-category pass/exceeds status, movie score, active-profile allowed level, and supporting tags when available.
- [x] Verification: `npm run build` passed (Vite/PWA, 76 modules, 237.52 kB JS gzip 85.49 kB); route smoke `/discover`, `/search`, `/settings`, `/lists/bad-id` returned HTTP 200 on port 5174.
- [x] Slice 39: continued reusable UI primitive consolidation by moving Search recent-search chips onto `UiChip`, keeping truncation/hover/focus behavior centralized instead of maintaining another local chip style.
- [x] Verification: `npm run build` passed (Vite/PWA, 76 modules, 237.54 kB JS gzip 85.49 kB); route smoke `/search`, `/discover`, `/settings`, `/settings/streaming`, `/settings/maturity` returned HTTP 200 on port 5174.
- [x] Slice 40: continued `UiChip` consolidation in Discover by moving the content-type chips and rating preset chips onto the shared primitive while preserving the compact horizontal mobile control row.
- [x] Verification: `npm run build` passed (Vite/PWA, 76 modules, 237.48 kB JS gzip 85.45 kB); route smoke `/discover`, `/search`, `/settings`, `/settings/streaming`, `/settings/maturity` returned HTTP 200 on port 5174.
- [x] Slice 41: moved `FilterMenu` trigger buttons onto `UiChip`, removing another local chip-button implementation while preserving dropdown/safe active states for Discover controls.
- [x] Verification: `npm run build` passed (Vite/PWA, 76 modules, 237.49 kB JS gzip 85.46 kB); route smoke `/discover`, `/search`, `/settings`, `/settings/streaming`, `/settings/maturity` returned HTTP 200 on port 5174.
- [x] Slice 42: continued chip consolidation in movie details and the legacy compatibility modal by moving watched/list toggles and legacy maturity-limit choices onto `UiChip`, removing the now-dead local chip CSS.
- [x] Verification: `npm run build` passed (Vite/PWA, 76 modules, 237.49 kB JS gzip 85.44 kB); route smoke `/discover`, `/search`, `/settings`, `/settings/streaming`, `/settings/maturity` returned HTTP 200 on port 5174.
- [x] Slice 43: narrowed the legacy `ConfigModal.vue` to the only remaining app-shell modal role: accepting a shared-list invite from `?add=` when no profile is available. Removed dead `openConfig` event wiring and duplicated profile/list/maturity/settings UI from the modal; route-backed Settings remains the core management surface.
- [x] Verification: `npm run build` passed (Vite/PWA, 76 modules, 231.54 kB JS gzip 83.66 kB); route smoke `/discover`, `/search`, `/settings`, `/settings/profile`, `/settings/lists`, and `/discover?add=bad-token` returned HTTP 200 on port 5174.
- [x] Slice 44: started lightweight structured Search without backend entities by splitting exact title matches, high-confidence related title matches, and remaining fuzzy results into vertical sections. Related groups only appear when multiple title/alternate-title phrase matches support them, preserving broad Fuse retrieval and exact-title priority.
- [x] Verification: `npm run build` passed (Vite/PWA, 76 modules, 233.13 kB JS gzip 84.17 kB); route smoke `/search`, `/search?q=godfather`, `/discover`, `/settings`, and `/settings/maturity` returned HTTP 200 on port 5174.
- [x] Slice 45: mobile Discover/list polish: moved the From your lists selector, See all, and Manage lists actions into the `MovieRow` header action slot so the section now starts with the normal **From your lists** row heading instead of a separate controls strip. Added reusable row header actions in `MovieRow` for future contained row actions.
- [x] Verification: `npm run build` passed (Vite/PWA, 76 modules, 233.49 kB JS gzip 84.28 kB); route smoke `/discover`, `/search`, `/search?q=godfather`, `/settings`, `/settings/maturity`, and `/lists/bad-id` returned HTTP 200 on port 5174.
- [x] Slice 46: removed the dead Discover hero search UI, `showSearch` prop, and search-query filter-count coupling now that Search is a dedicated route. Discover controls are lighter and no longer carry dormant retrieval code or duplicate search-bar styling.
- [x] Verification: `npm run build` passed (Vite/PWA, 76 modules, 232.01 kB JS gzip 83.94 kB); route smoke `/discover`, `/search`, `/search?q=godfather`, `/settings`, `/settings/maturity`, and `/lists/bad-id` returned HTTP 200 on port 5174.
- [x] Slice 47: fixed movie-detail suitability/profile naming during Sprint 6 mobile CX review. The detail modal now uses the actual active maturity profile id/label, including custom profiles, instead of reverse-guessing from maturity limit values and accidentally falling back to built-in names.
- [x] Verification: `npm run build` passed (Vite/PWA, 76 modules, 231.83 kB JS gzip 83.85 kB); route smoke `/discover`, `/search`, `/search?q=godfather`, `/settings`, `/settings/maturity`, and `/lists/bad-id` returned HTTP 200 on port 5174.
- [x] Slice 48: tightened Search mobile behavior during Sprint 6 review. The Search tab no longer auto-focuses on touch/mobile viewports (avoids immediately opening the keyboard and hiding first-screen content), and recent-search persistence now records committed searches/result selections instead of every debounced partial query while typing.
- [x] Verification: `npm run build` passed (Vite/PWA, 76 modules, 231.95 kB JS gzip 83.90 kB); route smoke `/search`, `/search?q=godfather`, `/discover`, `/settings`, `/settings/maturity`, and `/lists/bad-id` returned HTTP 200 on port 5174.
- [x] Slice 49: made Search query deep links real. `/search?q=...` now hydrates the Search view/results, and committed searches/recents update the `q` route query while preserving other query params such as `movie=`.
- [x] Verification: `npm run build` passed (Vite/PWA, 76 modules, 232.40 kB JS gzip 84.11 kB); dev routes `/search`, `/search?q=godfather`, `/search?q=harry%20potter`, `/discover`, `/settings`, `/settings/maturity`, and `/lists/bad-id` returned HTTP 200 on port 5173.
- [x] Slice 50: extracted the Search input into reusable `SearchBox.vue`, preserving desktop-only autofocus, clear, submit, and route-query behavior while moving the search-field chrome out of `SearchView.vue`.
- [x] Verification: `npm run build` passed (Vite/PWA, 78 modules, 233.08 kB JS gzip 84.39 kB); dev routes `/search`, `/search?q=godfather`, `/discover`, `/settings`, `/settings/maturity`, and `/lists/bad-id` returned HTTP 200 on port 5174.
- [x] Slice 51: tightened mobile Discover first-screen density by reducing the mobile hero chrome, hiding the redundant Discover kicker on phones, shrinking the poster backdrop, and slightly reducing filter-chip height so recommendation rows appear sooner below the app header.
- [x] Verification: `npm run build` passed (Vite/PWA, 78 modules, 233.08 kB JS gzip 84.39 kB); dev route smoke `/discover`, `/search`, `/settings`, `/settings/maturity`, and `/lists/bad-id` returned HTTP 200 on ports 5173 and 5174.
- [x] Slice 52: tightened Search mobile recents behavior by reusing the desktop-only focus rule when a recent search chip is selected, so tapping a recent query on touch devices shows results without immediately reopening the keyboard.
- [x] Verification: `npm run build` passed (Vite/PWA, 78 modules, 233.09 kB JS gzip 84.39 kB); dev routes `/search`, `/search?q=godfather`, `/discover`, `/settings`, `/settings/maturity`, and `/lists/bad-id` returned HTTP 200 on port 5174.
- [x] Slice 53: polished the Settings index row icons by moving from placeholder text glyphs to consistent Material Design SVG icons inside the reusable `SettingsRow` primitive.
- [x] Verification: `npm run build` passed (Vite/PWA, 78 modules, 234.02 kB JS gzip 84.87 kB); dev routes `/settings`, `/settings/profile`, `/settings/streaming`, `/settings/maturity`, `/settings/lists`, `/discover`, `/search`, and `/lists/bad-id` returned HTTP 200 on port 5174.
- [x] Slice 54: tightened Settings subroute density for Sprint 6 mobile review by removing the oversized bordered card treatment from dedicated Settings pages, flattening the maturity action panel, and moving maturity-profile selection onto shared `UiChip` so profile choices use the same one-line selected-state primitive as other settings chips.
- [x] Verification: `npm run build` passed (Vite/PWA, 78 modules, 233.97 kB JS gzip 84.86 kB); dev routes `/settings`, `/settings/profile`, `/settings/streaming`, `/settings/maturity`, `/settings/lists`, `/discover`, `/search`, and `/lists/bad-id` returned HTTP 200 on port 5174.
- [x] Slice 55: removed the redundant desktop Settings pill from the Discover hero. Settings remains available through the primary bottom tab and the maturity control’s explicit Settings path, reducing extra hero chrome while preserving the route-backed configuration flow.
- [x] Verification: `npm run build` passed (Vite/PWA, 78 modules, 233.86 kB JS gzip 84.84 kB); dev routes `/discover`, `/search`, `/search?q=godfather`, `/settings`, `/settings/maturity`, and `/lists/bad-id` returned HTTP 200 on port 5174.
- [x] Slice 56: addressed the Sprint 6 row-header crowding risk by letting slotted row actions stack below the row title on phone widths while keeping simple `See all` rows inline. This keeps **From your lists** starting as a normal row heading without squeezing the selector/actions into the title line.
- [x] Verification: `npm run build` passed (Vite/PWA, 78 modules, 233.91 kB JS gzip 84.86 kB); route smoke `/discover`, `/search`, `/search?q=godfather`, `/settings`, `/settings/maturity`, and `/lists/bad-id` returned HTTP 200 on port 5174.
- [x] Slice 57: tightened phone poster-card behavior by disabling sticky hover zoom on coarse/touch pointers and hiding the tiny maturity-dot detail strip on touch cards; the card keeps the summary fit badge, while detailed suitability reasoning stays in movie details.
- [x] Verification: `npm run build` passed (Vite/PWA, 78 modules, 233.91 kB JS gzip 84.86 kB); route smoke `/discover`, `/search`, `/search?q=godfather`, `/settings`, `/settings/maturity`, and `/lists/bad-id` returned HTTP 200 on port 5174.
- [x] Slice 58: added a compact no-results state to Search so query-backed searches that miss the catalog do not leave a blank results surface; copy explicitly notes Search ignores Discover filters.
- [x] Verification: `npm run build` passed (Vite/PWA, 78 modules, 234.22 kB JS gzip 84.97 kB); route smoke `/search`, `/search?q=zzzzunlikelytitle`, `/search?q=godfather`, `/discover`, `/settings`, `/settings/maturity`, and `/lists/bad-id` returned HTTP 200 on port 5174.
- [x] Slice 59: tightened the Search landing mobile behavior by preventing the clear action from re-focusing the search box on touch/mobile viewports and making recent-search chips horizontally scroll instead of wrapping into a tall block.
- [x] Verification: `npm run build` passed (Vite/PWA, 78 modules, 234.24 kB JS gzip 84.96 kB); route smoke `/search`, `/search?q=zzzzunlikelytitle`, `/search?q=godfather`, `/discover`, `/settings`, `/settings/maturity`, and `/lists/bad-id` returned HTTP 200 on port 5174.
- [x] Slice 60: tightened structured Search confidence so the **Related titles** section only appears for stronger title-series signals: multi-word phrase matches or one-word collection prefixes of at least six characters. Short vague matches like “star” now remain in normal results instead of being over-labeled as related.
- [x] Verification: `npm run build` passed (Vite/PWA, 78 modules, 234.41 kB JS gzip 85.02 kB); route smoke `/search`, `/search?q=godfather`, `/search?q=star`, `/search?q=harry%20potter`, `/search?q=zzzzunlikelytitle`, `/discover`, `/settings`, `/settings/maturity`, and `/lists/bad-id` returned HTTP 200 on port 5174.
- [x] Slice 61: tightened mobile Search result touch behavior by removing sticky hover lift/background changes on coarse/touch pointers while preserving active press feedback and desktop hover/focus affordances.
- [x] Verification: `npm run build` passed (Vite/PWA, 78 modules, 234.41 kB JS gzip 85.02 kB); route smoke `/search`, `/search?q=godfather`, `/search?q=star`, `/discover`, `/settings`, `/settings/maturity`, and `/lists/bad-id` returned HTTP 200 on port 5174.
- [x] Slice 62: continued small mobile/reusable polish by moving the **From your lists** row actions (`See all`, `Manage lists`) onto shared `UiChip`, removing the local action-chip CSS while keeping the list selector lightweight and horizontally scrollable on phones.
- [x] Verification: `npm run build` passed (Vite/PWA, 78 modules, 234.52 kB JS gzip 85.03 kB); route smoke `/discover`, `/search`, `/search?q=godfather`, `/settings`, `/settings/maturity`, and `/lists/bad-id` returned HTTP 200 on port 5174.
- [x] Slice 63: continued action-chip consolidation by moving default `MovieRow` **See all** links and `/lists/:listId` empty/back/manage actions onto `UiChip`, removing another local link-action style and keeping list route actions one-line/mobile-safe.
- [x] Verification: `npm run build` passed (Vite/PWA, 78 modules, 234.99 kB JS gzip 85.07 kB).
- [x] Slice 64: fixed the Sprint 6 accessibility watch item by making `UiChip` polymorphic for real router links/anchors as well as buttons, then converting navigation chips in `MovieRow`, `FromYourLists`, and `/lists/:listId` away from custom RouterLink button shims.
- [x] Verification: `npm run build` passed (Vite/PWA, 78 modules, 234.80 kB JS gzip 85.12 kB); route smoke `/discover`, `/search`, `/search?q=godfather`, `/settings`, `/settings/maturity`, and `/lists/bad-id` returned HTTP 200 on port 5174.
- [x] Slice 65: cleaned up the Sprint 6 automated mobile/CX audit noise by marking decorative Discover hero poster-background images as presentational (`alt=""`, `role="presentation"`) and async-decodable, so audits and assistive tech do not treat the ambience layer as content.
- [x] Verification: `npm run build` passed (Vite/PWA, 78 modules, 234.84 kB JS gzip 85.14 kB); route smoke `/discover`, `/search`, `/search?q=godfather`, `/settings`, `/settings/maturity`, and `/lists/bad-id` returned HTTP 200 on port 5175; source audit confirmed all `<img>` usages include `alt`/`:alt`.
- [x] Slice 66: fixed the QA/P0 movie-detail enrichment bug by making optional `/extra.json` loading defensive. Missing/static-fallback `extra.json` responses now no-op after checking HTTP status and JSON content type instead of attempting to parse HTML and logging a console error.
- [x] Verification: `npm run build` passed (Vite/PWA, 78 modules, 234.96 kB JS gzip 85.17 kB); route smoke `/discover`, `/search`, `/search?q=godfather`, `/settings`, `/settings/maturity`, `/lists/bad-id`, and `/discover?movie=tt0120737` returned HTTP 200 on port 5173; source grep confirmed the old `Failed to preload extra.json` console error path is gone.

- [x] Captured Alex CEO feedback from 2026-07-13 in `reports/ceo/2026-07-13-alex-ceo-feedback.md`, `VISION.md`, and `DESIGN_GUIDELINES.md`: chip dropdowns must work; chips must not turn red when disabled/unselected; **From your lists — All lists ▼** should be a subtle row-title control; availability row titles should shorten to **Available on …**; movie details should remove duplicate availability and add cross-profile suitability glance.
- [x] Captured Alex CEO feedback/process correction from 2026-07-13 in `reports/ceo/2026-07-13-manage-list-share-settings-density-ceo-feedback.md`: manage-list Share must visibly work, Settings index rows should be two-line label/value items, and CEO feedback should be reported/linked before team-driving changes.
- [x] Slice 67: recorded and verified the manage-list/settings-density CEO feedback hotfix stack. `SettingsRow` now renders the Settings index as two-line label/title rows while keeping `summary` optional, and the Settings list Share action now uses native Web Share with clipboard/manual fallbacks.
- [x] Verification: `npm run build` passed (Vite/PWA, 78 modules, 236.42 kB JS gzip 85.74 kB); route smoke `/discover`, `/search`, `/search?q=godfather`, `/settings`, `/settings/profile`, `/settings/lists`, `/settings/maturity`, `/lists/bad-id`, and `/discover?movie=tt0120737` returned HTTP 200 on port 5174; source checks confirmed the stale `copyShareUrl`, Settings-row third line, and old `/extra.json` console error path are gone.
- [x] Principal engineer review linked the CEO, PM-tech, QA, CX, vision, and worktree findings into a concrete plan: [Principal engineer plan](reports/principal-engineer/2026-07-13-principal-engineer-plan.md).
- [x] Slice 68: started Sprint 7 copy cleanup by shortening provider discovery row labels from `Included with your services · <provider>` / `On <provider>` to `Available on <provider>`, and the combined configured-services row to `Available on your services`.
- [x] Verification: `npm run build` passed (Vite/PWA, 78 modules, 236.37 kB JS gzip 85.73 kB); route smoke `/discover`, `/search`, `/search?q=godfather`, `/settings`, `/settings/profile`, `/settings/lists`, `/settings/maturity`, `/lists/bad-id`, and `/discover?movie=tt0120737` returned HTTP 200 on port 5174; source grep confirmed the old long provider-row labels are gone from `src/stores/movies.js`.
- [x] Slice 69: started Sprint 8 movie-detail hierarchy cleanup by removing the duplicate top-level Availability summary card, keeping availability in the provider detail section as **Where to watch**, adding a cross-profile suitability glance, and giving provider chips a safe TMDB-search fallback URL when the enrichment URL is absent.
- [x] Verification: `npm run build` passed (Vite/PWA, 78 modules, 237.18 kB JS gzip 86.02 kB); route smoke `/discover`, `/discover?movie=tt0120737`, `/search`, `/search?q=godfather`, `/settings`, `/settings/maturity`, and `/lists/bad-id` returned HTTP 200 on port 5174; source grep confirmed the old `availabilitySummary`, top-level `Availability` summary label, and `Included` provider section label are gone from `MovieModal.vue`.
- [x] Slice 70: closed the remaining Sprint 7 row-header gap by moving the **From your lists** list picker out of a separate native `<select>` controls strip and into the row title as a subtle reusable `FilterMenu`/`UiChip` dropdown; `MovieRow` now exposes a label action slot for row-title controls without custom row markup.
- [x] Verification: `npm run build` passed (Vite/PWA, 78 modules, 237.19 kB JS gzip 85.91 kB); route smoke `/discover`, `/search`, `/search?q=godfather`, `/settings`, `/settings/maturity`, and `/lists/bad-id` returned HTTP 200 on port 5173; source grep confirmed `FromYourLists.vue` no longer uses a native `<select>` and the new list dropdown active state uses non-red teal/neutral styling.
- [x] Captured Alex CEO feedback from 2026-07-13 in `reports/ceo/2026-07-13-settings-lists-open-copy-share-ceo-feedback.md`, `VISION.md`, and `DESIGN_GUIDELINES.md`: Settings → Lists rows should open the dedicated `/lists/:listId` poster-grid contents, and list Share should copy automatically with brief **Copied** feedback instead of showing a raw link in normal flow.
- [x] Slice 71: implemented the Settings → Lists CEO feedback. List rows now act as keyboard/click navigational rows to `/lists/:listId`, secondary Rename/Copy link/Remove actions do not trigger row navigation, list share uses clipboard-first copy behavior with 1-second **Copied** feedback, and the manual raw URL prompt is only a clipboard-failure fallback. Also moved generic Settings button hover away from red to teal, preserving red only for destructive danger hover.
- [x] Verification: `npm run build` passed (Vite/PWA, 78 modules, 238.13 kB JS gzip 86.25 kB); route smoke `/settings/lists`, `/lists/bad-id`, `/discover`, and `/search?q=godfather` returned HTTP 200 on port 5174; source grep confirmed `SettingsView.vue` no longer uses `navigator.share` or `shareList` and its list action label is now `Copy link` / `Copied`.
- [x] Slice 72: closed the Sprint 7 color-state drift by moving generic `UiChip` hover/active states, Discover menu option hover/active states, content-type chips, and the rating slider/preset defaults off the red accent and onto teal/neutral selected styling; danger chips keep red as the explicit destructive state.
- [x] Verification: `npm run build` passed (Vite/PWA, 78 modules, 238.13 kB JS gzip 86.25 kB); route smoke `/discover`, `/search`, `/search?q=godfather`, `/settings`, `/settings/maturity`, and `/lists/bad-id` returned HTTP 200 on port 5176; source grep confirmed `UiChip.vue`, `FilterMenu.vue`, and Discover control-state CSS no longer use the red accent for chip/menu selected or hover states, leaving only the decorative hero ambience gradient in `HeroSection.vue`.

## Current CX vs Vision status
- Delivered: primary Discover/Search/Settings IA, route-backed tabs, bottom navigation, Search as vertical retrieval, reusable Search input primitive, Search landing recents, Settings deep links, native profile/list/maturity settings routes, custom maturity profile create/duplicate/rename/delete, Discover list integration, dedicated `/lists/:listId` poster-grid browsing, temporary vs permanent filter separation, compact mobile Discover hierarchy, persisted maturity profile selection/presets, clearer profile-aware suitability/availability/list signals in cards/details, movie-detail maturity hierarchy with raw parental-guide detail secondary, a narrowed shared-list invite modal instead of duplicate broad Settings modal UI, and `UiChip` support for semantic links plus buttons.
- Partial: manual mobile review is still needed for the new list grid, bottom-nav interaction, movie detail full-screen/close-button behavior, narrowed shared-list invite flow, lightweight structured Search sections/deep links/no-results state, the stacked mobile From your lists row actions, the Search no-mobile-autofocus/recent-chip/touch-card behavior, the flatter Settings subroutes, and the Discover hero after removing the redundant Settings shortcut.
- CEO feedback status: implemented locally: manage-list share behavior, Settings index two-line density, shorter **Available on …** row titles, duplicate movie-detail availability removal, cross-profile suitability glance, subtle row-title list selector, and Settings → Lists row-open navigation plus clipboard-first **Copied** share feedback. Implemented locally: source-level chip/dropdown color semantics now keep non-destructive selected/hover states teal or neutral, with red reserved for danger/destructive states. Still open: manual phone/touch verification of dropdown behavior and selected-state readability.
- PM/QA follow-up backlog: visible suitability reasoning for Adults/no-limit profiles, canonical Search ranking for obvious title intent (`godfather`), abstract availability annotations in Search/cards without provider-name clutter, profile-aware first-row labeling, one-language primary controls, Settings input labels, list/profile gate copy, and modal-specific QA coverage.
- Deferred: true backend-backed collection/person search, true Included/Free/Rent/Buy provider groups, list ownership/delete semantics, and backend/scraper data changes.

## Steering review — 2026-07-13 06:11
- Repo state shows a large uncommitted implementation stack spanning docs, routing, Discover/Search/Settings, modal cleanup, and reusable primitives. Do not broaden the sprint with new feature scope until that stack is manually reviewed, build/smoke verified, and either committed or intentionally split.
- Plan-vs-implementation alignment is good: current code has `/lists/:listId`, route-backed Settings, `SearchBox`, `UiChip`, a narrowed shared-list `ConfigModal`, query-backed Search, and reduced Discover chrome matching `VISION.md`/`DESIGN_GUIDELINES.md`.
- Main risk is polish debt, not missing product direction: duplicated See all affordance in `MovieRow` plus `FromYourLists` row actions should be checked visually, and mobile review must confirm the compact headers/actions do not crowd the row title.
- Next work should stay inside Sprint 6: phone-sized UX review, exact/related Search behavior checks, movie-detail suitability readability, and list-grid completeness. No backend/person search, provider grouping, list ownership/delete semantics, or persistence rewrites yet.

## Steering review — 2026-07-13 08:56
- Conflict check: no other Ohana cron jobs or active processes were visible; only this steering job is scheduled. It is safe to update docs, but the worktree still carries a large uncommitted implementation stack, so implementation agents should avoid broad new code and avoid rebasing/resetting over it.
- Plan-vs-implementation alignment remains solid: routes include `/discover`, `/search`, `/settings/:section`, `/lists/:listId`, and `/roadmap`; Search uses `SearchBox`, query-backed results, exact/related/more sections, recents, and a no-results state; Discover list integration uses the normal **From your lists** row plus selector/action slot; the saved-list page is a poster grid; Settings and movie detail have continued reusable-chip consolidation.
- Steering adjustment: Sprint 6 should now bias toward verification, visual QA, and stabilization rather than more primitive extraction. The next implementation slice should be a phone-sized manual review pass that records concrete findings before further code polish.
- Watch items for the next agent: confirm `/lists/:listId` intentionally shows complete list contents and does not silently inherit Discover filters; verify the full-screen mobile movie-detail close button and category reasoning with real catalog data.

## Steering review — 2026-07-13 09:51
- Conflict check: only the steering cron job is visible and no active processes are running, but the worktree is not clean (`HeroSection.vue`, `VISION_EXECUTION.md`, plus `reports/` and `temp/`). Treat the current uncommitted stack as an in-progress Sprint 6 verification/polish batch; do not start a separate broad implementation thread until it is reviewed and committed or deliberately split.
- The latest Slice 65 code change is aligned with the vision and design guidance: decorative Discover hero poster images are now presentational, while real poster/detail images already carry title/brand alt text. Do not overreact to stale automated alt reports without checking source semantics first.
- Plan-vs-code alignment remains good: the router has the intended Discover/Search/Settings/list/roadmap surfaces; Discover list previews respect active filters while `/lists/:listId` remains a complete saved-list grid; Search keeps retrieval separate from Discover filters; Settings is route-backed and compact.
- Key steering decision: Sprint 6 should now move from micro-polish to consolidation — verify mobile screenshots/manual phone behavior, resolve or archive the generated audit reports, run one build/route-smoke pass, then commit the batch. Next code should be only concrete QA findings, not more generic primitive extraction.

## Steering review — 2026-07-13 10:46
- Conflict check: only this steering cron job is scheduled and no active processes are running. The worktree is still dirty with app-code and doc changes, so preserve the current local stack and avoid concurrent broad implementation.
- Recent diffs show three local implementation themes already in flight: presentational Discover hero background images, defensive optional `/extra.json` loading in movie details, and CEO hotfixes for list Share plus two-line Settings rows. These are aligned with `VISION.md`/`DESIGN_GUIDELINES.md`, but the hotfix stack still needs build and route-smoke verification before commit.
- Plan-vs-code alignment remains strong for IA: routes include Discover/Search/Settings/list/roadmap; Search stays separate from Discover filters; list previews respect Discover filters while `/lists/:listId` remains complete; Settings remains route-backed.
- Key steering decision: keep the next engineering focus narrow. Finish verifying/committing the current stack, then address Sprint 7 control-state/dropdown/list-header fixes before Sprint 8 movie-detail hierarchy and Sprint 9 retrieval/trust follow-ups. Do not add backend availability groups, person search, ownership semantics, or persistence rewrites.

## Steering review — 2026-07-13 11:41
- Conflict check: only this steering cron job is scheduled, no active processes are running, and the worktree is clean at `d28200e` after Slice 69. Safe for documentation-only steering updates.
- Plan-vs-code alignment remains good: `/discover`, `/search`, `/settings/:section`, `/lists/:listId`, and `/roadmap` are present; Search is query-backed and separate from Discover filters; Settings is route-backed; saved-list preview rows respect active Discover filters while full `/lists/:listId` pages show complete attached-list contents.
- Latest implementation state has effectively completed the Sprint 8 movie-detail hierarchy slice: availability appears once under **Where to watch**, cross-profile suitability glance exists, and active-profile category reasoning is still present.
- Remaining drift is now more specific than “mobile polish”: Sprint 7 is only partially closed because the list selector is still a separate `<select>` in `FromYourLists.vue` rather than a subtle row-title control, and chip/dropdown states still deserve a focused source/phone pass. Sprint 9 should follow with trust/retrieval/accessibility fixes, especially mixed English/Spanish Discover controls and canonical Search ranking for `godfather`.
- Key steering decision: do not keep extending Sprint 6. Treat Sprints 1–8 as implemented/pending manual QA, close the remaining Sprint 7 control/header gaps next, then move to Sprint 9 PM/QA trust fixes. No backend provider grouping, person search, list ownership/delete semantics, or persistence rewrites.

## Steering review — 2026-07-13 11:54
- Conflict check: only this steering cron job is visible, no active processes are running, and `git status --short` is clean at `8a8c5d3` after Slice 70. Safe for documentation-only steering updates.
- Recent diff/state review confirms the row-title list selector requirement is now implemented: `FromYourLists.vue` uses `MovieRow` label actions plus `FilterMenu`/`UiChip`, no native `<select>`, and provider row labels use **Available on …** language.
- Remaining Sprint 7 risk is control-state semantics, not row-header structure: generic `UiChip` hover/active defaults and Discover menu active styles still use the red accent in non-destructive contexts. This conflicts with `DESIGN_GUIDELINES.md` color meaning and should be fixed before calling Sprint 7 fully done.
- Plan-vs-code alignment otherwise remains strong: Discover/Search/Settings/list routes are present, Search stays retrieval-only and query-backed, `/lists/:listId` is complete-list grid territory, Settings is route-backed, and movie details now avoid duplicate availability while showing cross-profile suitability plus active-profile category reasoning.
- Key steering decision: next implementation slice should close Sprint 7 with a small source-driven chip/menu color-state pass and touch dropdown verification, then move to Sprint 9 trust/retrieval/accessibility items. Do not reopen broad mobile polish or add backend/person/ownership work.

## Steering review — 2026-07-13 12:36
- Conflict check: only this steering cron job is visible, no active processes are running, and `git status --short` is clean at `740d36f` after Slice 71. Safe for documentation-only steering updates.
- Recent state review confirms the Settings → Lists CEO feedback is implemented and aligned: list rows navigate to `/lists/:listId`, secondary actions are isolated from row navigation, clipboard-first **Copied** feedback replaced normal raw URL exposure, and generic Settings button hover is no longer red except danger actions.
- Remaining Sprint 7 drift is concrete and source-visible: `UiChip.vue` generic hover/active states still use the red accent, and Discover `HeroSection.vue` menu-option hover/active plus default rating preset chips can still read as red selected controls. That violates `DESIGN_GUIDELINES.md` color semantics; fix these before calling Sprint 7 complete.
- Plan-vs-code alignment remains strong: the intended Discover/Search/Settings/list/roadmap routes exist; Search is query-backed and separated from Discover filters; saved-list previews remain filtered discovery support while `/lists/:listId` remains complete-list browsing; movie details show one **Where to watch** section plus cross-profile suitability.
- Key steering decision: next implementation slice should be a small Sprint 7 color-state/dropdown verification pass in `UiChip.vue`, `HeroSection.vue`, and related menu/chip CSS only. After that, move to Sprint 9 PM/QA trust items (`godfather` ranking, Adults/no-limit suitability explanation, control-language consistency, Settings input labels). Do not reopen broad mobile polish or backend/person/ownership work.

## Sprint plan

Current sprint: **Sprint 7 — CEO feedback: control states and row headers**. Row-header/list-selector work landed in Slice 70, Settings-list CEO feedback landed in Slice 71, and source-level chip/menu color-state cleanup landed in Slice 72. Finish with manual dropdown-touch verification, then move to Sprint 9 trust/retrieval/accessibility follow-ups. Sprint 8’s core movie-detail hierarchy changes are implemented in Slice 69.

### Sprint 1 — Finish list-first Discover integration
Goal: make lists support discovery without becoming a competing promo surface.

Scope:
- Remove any remaining “Start with what you already saved.” banner/headline from `FromYourLists.vue`.
- Make the first Discover list surface a normal content row headed exactly **From your lists**.
- Keep a lightweight selector for **All lists** plus individual lists.
- Apply the active temporary Discover filters to the list preview row.
- Keep **Manage lists** as a secondary Settings action.

Acceptance criteria:
- No extra list promo headline/banner appears above the row.
- **All lists** shows one deduped preview row, capped enough that recommendations still appear soon after on mobile.
- Selecting one list affects only the list preview section, not global Discover rows.
- The preview row respects active genre/rating/maturity/content-type/availability filters.
- Empty/no-match list states are compact and do not push recommendations far down the page.

Dependencies:
- Existing `FromYourLists.vue`, user list store, Discover filters, and movie row/card components.

Verification:
- `npm run build`.
- Manual mobile review of `/discover` with no lists, one list, multiple lists, and active filters.

### Sprint 2 — Add dedicated list route and poster-grid view
Goal: complete the `/lists/:listId` vision requirement for full saved-list browsing.

Scope:
- Add route `/lists/:listId`.
- Resolve the list by id from persisted user/profile data.
- Render all available movies in that list as a responsive poster grid, not a horizontal row.
- Add **See all** links from specific-list Discover rows to `/lists/:listId`.
- Add a compact invalid/missing-list state with a path back to Discover or Settings → My Lists.

Acceptance criteria:
- `/lists/:listId` shows the selected list title and all available poster items through vertical scrolling.
- The full list page prioritizes completeness; it must not use carousel curation or row slicing.
- Specific-list Discover rows expose **See all** and navigate to the correct id.
- Movie detail still opens from grid cards.
- Invalid list ids fail calmly without breaking the app shell.

Dependencies:
- Sprint 1 list selector/row behavior.
- Existing router, list store, poster card, and movie modal wiring.

Verification:
- `npm run build`.
- Route smoke tests: `/lists/<known-id>`, `/lists/bad-id`, `/discover`, `/settings/lists`.
- Manual mobile check for grid density, tap targets, and bottom-nav interaction.

### Sprint 3 — Consolidate reusable UI primitives
Goal: make repeated controls consistent without broad redesign.

Scope:
- Apply `UiChip` only to repeated chip/action surfaces where it removes duplicated behavior or CSS.
- Confirm repeated metadata badges use `UiBadge`.
- Confirm repeated section/action headings use `SectionHeader`.
- Keep Settings rows on `SettingsRow`.
- Remove duplicate CSS variants made obsolete by those primitives.

Acceptance criteria:
- Chip selected/disabled/focus/nowrap behavior is centralized for repeated chip surfaces.
- Chips never wrap to two lines; long labels truncate or move into menu/detail surfaces.
- Poster/search cards do not regain platform/provider badges.
- Component consolidation does not flatten distinct semantic controls into misleading generic UI.

Dependencies:
- Existing `UiChip`, `UiBadge`, `SectionHeader`, and `SettingsRow` work from slices 31–35.

Verification:
- `npm run build`.
- Spot-check `/discover`, `/search`, `/settings`, `/settings/streaming`, `/settings/maturity`, and movie detail modal.

### Sprint 4 — Audit and narrow legacy `ConfigModal.vue`
Goal: avoid stale duplicate settings flows while protecting persistence and onboarding paths.

Scope:
- Audit every remaining `ConfigModal.vue` entry point before changing behavior.
- Keep only genuinely needed flows, likely shared-list onboarding or temporary compatibility bridges.
- Move any remaining core profile/list/maturity behavior to route-backed Settings pages only if the path is safe and small.
- Delete dead modal UI/CSS only after confirming no route/query flow depends on it.

Acceptance criteria:
- Profile, streaming, maturity, and list management do not require the broad legacy modal.
- Any remaining modal use is narrow, named, and documented in this file.
- Shared-list invite/add flows and movie add-to-list query paths still work.
- KV/profile merge behavior is untouched unless explicitly scoped and verified.

Dependencies:
- Settings route functionality from slices 24, 25, 27, and 29.
- Careful inspection of `App.vue`, `user.js`, query params, and list/profile persistence.

Verification:
- `npm run build`.
- Smoke: create/restore profile, create/import/share/rename/remove list, change maturity profile, open movie with add-to-list action, and any shared-list invite/add query behavior.

### Sprint 5 — Prototype lightweight structured Search
Goal: improve intentional retrieval without inventing backend entities.

Scope:
- Add inferred collection grouping only when existing title data makes confidence high.
- Keep Search vertical; do not add carousels.
- Preserve exact-title priority for specific searches.
- Do not add person/studio search until backend data exists.

Acceptance criteria:
- Search still ignores Discover filters and annotates results instead.
- Queries like “The Godfather” prioritize exact title retrieval.
- Queries like “James Bond” or “Harry Potter” may show a collection-like grouped section only when multiple matching titles support it.
- Compatibility, availability, and list annotations remain visible.

Dependencies:
- Existing Fuse search and movie metadata only.

Verification:
- `npm run build`.
- Manual searches: `godfather`, `james bond`, `harry potter`, typo query, and empty query recents.

### Sprint 6 — Mobile CX review and polish
Status: current. Start here next; Sprints 1–5 have implementation slices recorded above.

Goal: verify the redesigned experience against `VISION.md`, `AGENTS.md`, and `CODING_STANDARDS.md` on a phone-sized viewport.

Scope:
- Review header height and visible **Ohana TV** brand.
- Review icon-only bottom tab clarity and consistent icon weight/tap targets.
- Review Discover first-screen density and list row weight.
- Review Search first-screen spacing.
- Review Settings list density.
- Review movie detail on mobile: full-screen presentation, fixed top close button, suitability details visible and understandable.
- Review lightweight structured Search sections: exact title first, related title grouping only when clearly supported, remaining fuzzy results still visible.
- Review `/lists/:listId` grid as a complete saved-list view; do not turn it back into a curated carousel or over-filtered discovery preview.
- Audit nested boxes, chip wrapping, card metadata noise, and selected states.

Acceptance criteria:
- Discover recommendations appear quickly after controls/list preview.
- Search starts with the search field and useful content immediately after.
- Settings feels like a compact index, not a form dump.
- Movie detail on mobile uses the available screen, keeps close reachable at top, and does not bury suitability reasoning behind a vague verdict.
- Structured Search improves retrieval clarity without pretending to have real collection/person backend entities.
- Full-list pages prioritize completeness and simple poster scanning.
- No screen relies on nested decorative boxes where spacing/type would work.
- No chips wrap; icon tabs remain label-free and non-emoji.

Dependencies:
- Ideally after Sprints 1–3.

Verification:
- `npm run build`.
- Manual mobile review on Tailscale (`http://100.85.92.106:5174/`).
- Manual searches: `godfather`, `james bond`, `harry potter`, typo query, and empty query recents.
- Record findings and any follow-up slices in this file before starting more implementation.

### Sprint 7 — CEO feedback: control states and row headers
Status: current / nearly closed. Availability row copy and row-title list selector are implemented; remaining focus is chip/dropdown state semantics and touch verification.

Goal: fix the visible control/state problems Alex flagged without broad redesign.

Scope:
- Fix chip dropdown interaction failures in Discover/list controls.
- Normalize chip selected/unselected/disabled/hover visuals so non-destructive chips and menu options never use red/accent treatment.
- Verify the list selector remains integrated into the row-title/header pattern: **From your lists — All lists ▼**.
- Keep availability row copy short: **Available on <service>** or **Available on your services**.

Acceptance criteria:
- Every dropdown chip opens and applies its selection on touch/mobile and desktop.
- Chips have clear selected and unselected states; disabled/unavailable is quiet, not red.
- The list selector reads as part of the **From your lists** row header, not as a separate loud toolbar.
- Availability row headers are short enough to scan on mobile.
- Source review confirms generic chip/menu selected and hover states use neutral/teal/blue interaction colors, reserving red for destructive/error states.

Verification:
- `npm run build`.
- Manual mobile check of `/discover` controls, list selector, and all chip states.
- Source/CSS grep or visual review confirms no generic chip/menu selected, hover, active, or disabled style uses red/destructive treatment.

### Sprint 8 — CEO feedback: movie-detail decision hierarchy
Status: implemented in Slice 69; pending manual phone/profile QA.

Goal: make movie details more decisive by removing duplication and adding cross-profile suitability.

Scope:
- Remove the duplicate/first movie-detail availability block that does not add information beyond the fuller provider section.
- Keep one clear availability section with provider detail/value.
- Add a compact suitability glance across configured/built-in profiles, e.g. **Adults ✔**, **Family ✔**, **Kids ❌**.
- Preserve detailed active-profile suitability reasoning and category scores.

Acceptance criteria:
- Movie detail shows availability once.
- The user can scan which profiles a title suits without changing the active profile.
- Active-profile reasoning remains visible and understandable.
- No new backend availability/profile model is required; use existing local profile/provider data.

Verification:
- `npm run build`.
- Manual movie-detail checks for permissive Adults profile, restrictive kids/family profile, and custom profile when available.
- Confirm no duplicate availability copy remains in the modal/page.

### Sprint 9 — PM/QA trust, retrieval, and accessibility follow-ups
Goal: cover the remaining product-vision and QA findings that are not generic chrome polish.

Scope:
- Make movie-detail suitability reasoning visible for every active profile, including Adults/no-limit profiles where rows should show **No limit set** instead of disappearing.
- Tune Search exact/near-exact ranking so canonical/high-confidence user intent wins over weak exact-title noise, starting with `godfather`.
- Add abstract availability annotations to Search results first; evaluate poster cards only if it stays visually calm and never reintroduces provider names on cards.
- Rename the first Discover row with active profile context, e.g. **Recommended for Adults**.
- Normalize primary Discover control language to one locale; default to English until real i18n is planned.
- Add real labels/accessibility names to Settings text inputs flagged by QA.
- Improve no-profile vs wrong-profile copy for list-gated surfaces.
- Extend QA/modal coverage so future reports inspect the movie-detail dialog content, close control, focus/scroll state, suitability, and availability rows.

Acceptance criteria:
- Movie details always explain suitability without requiring users to open raw parental-guide details.
- `/search?q=godfather` puts `The Godfather` 1972 first or clearly first among canonical suggestions; `harry potter` and `james bond` still behave sensibly.
- Search results annotate availability without filtering intentional retrieval and without provider-name clutter.
- Discover first row communicates the active maturity profile.
- Primary controls do not mix English and Spanish chrome.
- Settings-route input probes find no unlabeled visible inputs.
- `/settings/lists` and `/lists/:bad` explain profile/list state accurately and tersely.

Verification:
- `npm run build`.
- Manual checks: `/discover`, `/search?q=godfather`, `/search?q=harry%20potter`, `/search?q=james%20bond`, typo query, `/settings/profile`, `/settings/maturity`, `/settings/lists`, `/lists/bad-id`, and a movie-detail deep link.

### Sprint 10 — CEO feedback: Settings list navigation and copy-share behavior
Status: implemented and build/route-smoke verified in Slice 71.

Goal: make Settings → Lists behave like a useful list hub, not an admin table or raw-link copier.

Scope:
- Make each list row/title in `/settings/lists` open the dedicated `/lists/:listId` poster-grid view.
- Keep Rename, Share/Copy, and Remove as secondary actions; their clicks must not accidentally navigate to the list page.
- Change list sharing on this surface to clipboard-first behavior: generate the existing share URL, copy it immediately, and show local **Copied** feedback for about 1 second.
- Keep manual copy prompt only as a clipboard-failure fallback.
- Preserve current token/share URL generation and profile/list persistence semantics.

Acceptance criteria:
- Tapping/clicking a list row in Settings shows the movies in that list.
- `/lists/:listId` remains a complete poster-grid view, not a filtered discovery preview.
- Pressing Share/Copy does not show a raw URL in the happy path.
- Feedback says **Copied** rather than **Shared**, clears after roughly 1 second, and does not interrupt the list-management flow.
- Secondary list actions do not trigger row navigation.

Verification:
- `npm run build`.
- Route smoke: `/settings/lists`, `/lists/bad-id`, and a real `/lists/:listId` where local profile/list data exists.
- Manual check: row navigation, Rename, Share/Copy, Remove, and clipboard fallback behavior where possible.

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
- Latest Alex feedback remaining priority: broken chip dropdowns and chip state semantics first; then row-header/list-selector and availability-title cleanup; then movie-detail duplicate availability removal plus cross-profile suitability glance.
