# Vision sprint plan

Current planning surface only. Completed sprint detail is archived in [`archive/sprint-plan-2026-07-13-full.md`](archive/sprint-plan-2026-07-13-full.md).

## Current sprint — Sprint 9: PM/QA trust, retrieval, and accessibility follow-ups

Goal: cover remaining product-vision and QA findings that are not generic chrome polish.

Already landed:

- Discover dropdown menu options restored after CEO feedback; remaining dropdown work is manual phone/touch verification, not another implementation pass.
- Exact/near-exact Search ranking: `godfather` now surfaces **The Godfather** (1972) first.
- Discover first-row active-profile naming.
- English primary Discover controls.
- Movie-detail suitability reasoning for every active profile, including Adults/no-limit profiles with explicit **No limit set** rows.
- Search result cards annotate abstract availability from existing provider bitmasks only, and Search result hover/active borders use teal/neutral states rather than red.

Open scope:

- Real labels/accessibility names for Settings text inputs flagged by QA; current visible Settings inputs appear label-wrapped, so verify before changing UI. If verified clean, keep scope useful by replacing non-destructive red focus indicators with teal/neutral states in `SearchBox`, Settings form inputs, and Settings row focus/chevron; do not rewrite Settings forms just to create work.
- Better no-profile vs wrong-profile copy for `/settings/lists`, `/lists/:listId`, and invalid-list states.
- QA/modal coverage for movie-detail dialog content, close control, focus/scroll state, suitability, and availability rows.

Acceptance criteria:

- Movie details always explain suitability without requiring users to open raw parental-guide details.
- `/search?q=godfather` puts **The Godfather** (1972) first or clearly first among canonical suggestions; `harry potter` and `james bond` still behave sensibly.
- Search results annotate availability calmly from current data, do not filter retrieval, do not show provider-name clutter on cards, and use teal/neutral interactive states rather than red for hover/active feedback.
- Settings-route input probes find no unlabeled visible inputs; if the probe is clean, record verification and only adjust focus color semantics, not form structure.
- `/settings/lists` and `/lists/:bad` explain profile/list state accurately and tersely.

Verification:

- `npm run build`.
- Manual checks: `/discover`, `/search?q=godfather`, `/search?q=harry%20potter`, `/search?q=james%20bond`, typo query, `/settings/profile`, `/settings/maturity`, `/settings/lists`, `/lists/bad-id`, and a movie-detail deep link.

## Closed or manual-QA-only sprints

- Sprint 1: list-first Discover integration — implemented.
- Sprint 2: `/lists/:listId` poster-grid view — implemented.
- Sprint 3: reusable UI primitives — implemented enough; continue only when a concrete duplicate pattern appears.
- Sprint 4: legacy `ConfigModal.vue` narrowing — implemented.
- Sprint 5: lightweight structured Search — implemented.
- Sprint 6: mobile CX review/polish — implementation landed; remaining work should come from concrete phone QA findings, not generic polish.
- Sprint 7: control states and row headers — implemented through chip/menu color semantics and row-title list selector; manual touch verification may still be useful.
- Sprint 8: movie-detail decision hierarchy — implemented; manual phone/profile QA may still be useful.
- Sprint 10: Settings list navigation and copy-share behavior — implemented in Slice 71.

## Explicitly deferred

- True Included/Free/Rent/Buy provider grouping until backend/scraper data supports it.
- Real person/studio search without backend data.
- List ownership/delete semantics beyond current rename/remove-from-profile language.
- Profile/list persistence or KV merge rewrites as part of UI cleanup.
- External deployment unless Alex asks.
