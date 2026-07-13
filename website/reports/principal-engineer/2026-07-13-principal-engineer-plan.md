# Principal engineer plan — CEO feedback, PM/QA gaps, and vision alignment

Date: 2026-07-13 10:44 Europe/Madrid
Scope: `VISION.md`, `DESIGN_GUIDELINES.md`, `CODING_STANDARDS.md`, `VISION_EXECUTION.md`, `agents/principal-engineer.md`, CEO reports in `reports/ceo/`, PM report in `reports/pmt/`, QA deep-dive in `reports/qa-deep-dive/`, latest CX review in `reports/cx-review/`, current `git status --short`, and targeted source refs.

## Executive verdict

The execution plan now captures the main CEO feedback and the core product vision, but it still needed one principal-engineering pass to separate what is already in the worktree from what remains. The plan should not start another broad polish sprint. Next engineering should be narrow trust/retrieval/accessibility slices: finish CEO control/detail issues, then address PM/QA findings that directly support confidence in choosing a title.

Current worktree changes must be preserved. I did not implement app code.

## Source findings

- `VISION_EXECUTION.md` already links the QA deep-dive, PM-tech report, and the latest manage-list/settings-density CEO report in the top implementation plan, and already added Sprint 7/Sprint 8 for the first CEO report.
- `src/components/SettingsView.vue:149` and `src/components/SettingsView.vue:352` show the manage-list **Share** action has already been changed in the current worktree to use `navigator.share`, clipboard fallback, and prompt fallback.
- `src/components/SettingsRow.vue:9` no longer renders the third summary line, and `summary` is now optional, matching the two-line Settings index feedback.
- `src/components/MovieModal.vue:385` already has defensive optional `/extra.json` loading, resolving the QA/PM P0 enrichment noise.
- `src/components/MovieModal.vue:78` still renders a shallow availability summary while the provider section remains later in the same detail surface, so the CEO duplicate-availability feedback is still open.
- `src/components/MovieModal.vue:94` and `src/components/MovieModal.vue:317` still hide the active-profile compatibility table when all limits are `-1`; Adults/no-limit users do not get visible suitability reasoning by default.
- `src/components/MovieModal.vue` does not yet show the cross-profile suitability glance requested in `VISION.md`.
- `src/components/SearchView.vue:151` preserves visible Fuse order for exact title matches; PM/QA evidence says `/search?q=godfather` ranks weaker exact-title noise above `The Godfather` 1972.
- `src/stores/movies.js:211` still labels the first row `Recommended for this profile`, not `Recommended for Adults/Family/...`.
- `src/components/HeroSection.vue:106`, `:115`, `:133`, and `:236` still mix English and Spanish chrome: `Series`, `Películas`, `Categorías`, `Rating`.
- `src/components/SettingsView.vue` still relies on some placeholder text inside labeled wrappers; QA wants an accessibility pass on visible Settings inputs.

## Recommended slice order

### Slice 67 — Record the hotfix stack before more work

**Goal**
Make the tracker reflect the current worktree: manage-list share fallback and Settings two-line rows are already implemented locally.

**Files likely touched**
- `VISION_EXECUTION.md`

**Implementation notes**
- Add a progress entry for the local manage-list share / Settings row density work.
- Mark these as implemented locally/pending verification instead of leaving them as undifferentiated backlog.
- Do not edit app code in this slice.

**Risks**
- If the code is not built after this stack, the tracker may overstate verification.

**Verification**
- Lightweight source inspection now.
- Later implementation owner should run `npm run build` and route smoke checks before commit.

### Slice 68 — CEO control states and row-header correction

**Goal**
Fix the visible control trust issues Alex flagged without redesigning Discover.

**Files likely touched**
- `src/components/UiChip.vue`
- `src/components/FilterMenu.vue`
- `src/components/FromYourLists.vue`
- `src/components/MovieRow.vue`
- `src/stores/movies.js`

**Implementation notes**
- Verify every dropdown chip opens and selects on touch and desktop before changing styling.
- Remove any disabled/unselected red chip treatment; reserve red for destructive/error actions.
- Integrate the list selector into the row-header/title treatment as `From your lists — All lists ▼`.
- Shorten provider row labels to `Available on <service>` or `Available on your services`.

**Risks**
- Row-header actions can crowd mobile if selector/action chips stay too wide.
- Fixing state colors in `UiChip` can unintentionally affect destructive list/remove controls if tones are overloaded.

**Verification**
- `npm run build`
- Manual `/discover` mobile and desktop check for availability/profile/genre/rating dropdowns, list selector, selected/unselected/disabled chip states.
- Source/CSS grep for red/destructive chip styling outside true destructive/error states.

### Slice 69 — CEO movie-detail decision hierarchy

**Goal**
Make movie detail decisive: one availability section, cross-profile suitability glance, and visible active-profile reasoning.

**Files likely touched**
- `src/components/MovieModal.vue`
- `src/maturity.js` or `src/lib/maturityProfiles.js` only if existing helpers are insufficient

**Implementation notes**
- Remove or merge the shallow availability item in the top watch summary so availability appears once.
- Add compact profile-fit labels for built-in/configured profiles using existing maturity limits; do not invent backend taxonomy.
- Change compatibility rows so Adults/no-limit profiles show category rows as `No limit set` instead of hiding reasoning entirely.
- Preserve the secondary collapsed parental-guide detail grid.

**Risks**
- Profile-glance computation can become noisy if custom profiles are numerous; cap or wrap deliberately.
- Avoid changing persistence or profile merge behavior.

**Verification**
- `npm run build`
- Manual movie-detail checks for Adults/no-limit, restrictive family/kids profile, and a custom profile if present.
- Confirm exactly one availability section remains.

### Slice 70 — Retrieval and first-screen trust fixes

**Goal**
Address PM/QA findings that directly affect the core promise: finding the intended title and understanding the active context.

**Files likely touched**
- `src/components/SearchView.vue`
- `src/stores/movies.js`
- `src/components/HeroSection.vue`
- `src/components/SearchResultCard.vue`
- `src/components/MovieCard.vue` only if abstract availability stays calm

**Implementation notes**
- Rank exact/near-exact search matches article-insensitively and bias canonical/high-rating/popular matches above weak exact-title noise.
- Make first Discover row profile-aware, e.g. `Recommended for Adults`.
- Normalize primary UI chrome to one language; recommendation is English now.
- Add abstract availability annotations to Search results first; avoid provider names on poster cards.

**Risks**
- Over-tuning `godfather` can break broader retrieval; add regression searches for `harry potter`, `james bond`, typo query, and empty recents.
- Availability annotations can reintroduce card noise if applied too broadly.

**Verification**
- `npm run build`
- Manual `/search?q=godfather`, `/search?q=harry%20potter`, `/search?q=james%20bond`, typo query, `/discover` mobile.

### Slice 71 — Accessibility/copy stabilization

**Goal**
Close the QA accessibility/copy tail without expanding product scope.

**Files likely touched**
- `src/components/SettingsView.vue`
- `src/views/ListView.vue`
- QA harness/report scripts if available in repo

**Implementation notes**
- Add visible or visually-hidden labels for Settings profile/recovery/custom-profile inputs where placeholder text is doing naming work.
- Improve no-profile vs wrong-profile copy for `/settings/lists` and `/lists/:listId`.
- Extend QA modal detection so future reports inspect `.modal[role="dialog"]` instead of only background page text.

**Risks**
- Adding too much explanatory copy can violate the two-line Settings/index direction; keep help text inside dedicated routes/states only.

**Verification**
- `npm run build`
- Accessibility probe for Settings input labels.
- Manual `/settings/profile`, `/settings/maturity`, `/settings/lists`, `/lists/bad-id`, and movie-detail deep link.

## Do not do

- Do not rewrite `src/stores/user.js` profile/list persistence or KV merge behavior.
- Do not fake Included/Free/Rent/Buy provider groups until catalog/backend data supports them.
- Do not add person/studio search entities without backend/catalog data.
- Do not re-add provider/platform names to poster cards.
- Do not make `/lists/:listId` inherit Discover filters by default; completeness is the point of that route.
- Do not continue generic primitive extraction unless it fixes a visible bug in the feedback above.
