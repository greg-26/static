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
- Settings-route visible inputs were verified as label-wrapped; non-destructive focus indicators in `SearchBox`, Settings form inputs, and Settings row focus/chevron now use teal/neutral states rather than red.
- No-profile vs wrong-profile list-gate copy now distinguishes setup needs from missing/list-not-attached states on Settings → Lists and `/lists/:listId`.

Open scope:

- QA/modal coverage for movie-detail dialog content, close control, focus/scroll state, suitability, and availability rows.
- Manual phone/touch verification for the new list/profile gate copy and existing dropdown selected-state readability.

Acceptance criteria:

- Movie details always explain suitability without requiring users to open raw parental-guide details.
- `/search?q=godfather` puts **The Godfather** (1972) first or clearly first among canonical suggestions; `harry potter` and `james bond` still behave sensibly.
- Search results annotate availability calmly from current data, do not filter retrieval, do not show provider-name clutter on cards, and use teal/neutral interactive states rather than red for hover/active feedback.
- Settings-route input probes find no unlabeled visible inputs, and non-destructive focus color semantics stay teal/neutral rather than red.
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
