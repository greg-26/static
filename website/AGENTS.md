# AGENTS.md — Ohana TV Website

Scope: this file is for the `website/` project only inside the Ohana static repo.

## Project shape

- Before implementation or CX review, read `README.md` for current project/product context, then use this `AGENTS.md` for agent-specific workflow and guardrails.
- Also read `VISION.md` and `CODING_STANDARDS.md` before product/CX or UI implementation work; the “Specific product and UX requirements” section in `VISION.md` is acceptance criteria.
- Vue 3 + Composition API, Pinia, Fuse.js, Vite.
- Entry: `src/main.js` mounts `src/App.vue` with Pinia and Vue Router.
- Routes live in `src/router/index.js`; main routes include `/discover`, `/search`, `/settings`, settings subroutes, and `/roadmap`.
- Vite alias: `@` → `src` from `vite.config.js`.
- Static data is loaded from `public/movies.json` at runtime via `fetch("movies.json")` in `src/stores/movies.js`.
- The real `movies.json` file is required for meaningful local CX review. If it is missing after cloning the repo, download the canonical copy from `https://ohana.tv/movies.json` into `public/movies.json`.
- Even when `public/movies.json` exists, re-download it every now and then before product/UX review because the canonical catalog may have changed.
- If `movies.json` is missing/unreadable, the store falls back to generated mock movies, but that fallback is only for development smoke tests — not real review.

## Key files

- `src/App.vue` — app shell, modal state, URL query handling for `?movie=` and `?add=`, profile filter persistence.
- `src/router/index.js` — route definitions and static-friendly route handling.
- `src/views/DiscoverView.vue` — Discover route layout.
- `src/components/SearchView.vue` — Search route layout.
- `src/components/SettingsView.vue` — Settings index/subroute layouts.
- `src/stores/movies.js` — catalog loading, Fuse search, filtering, row generation, provider/genre constants.
- `src/stores/user.js` — local profile token, KV-backed profile/list data, watched/list/provider-ish profile persistence, filter preferences.
- `src/components/HeroSection.vue` — hero/search/filter UI. Current provider filters live here.
- `src/components/ConfigModal.vue` — profile, list management, maturity limits. This is getting too broad and should be split later.
- `src/components/MovieRow.vue` — horizontal lazy-rendered movie rows with desktop scroll arrows.
- `src/maturity.js` — maturity category definitions and score helpers.
- `VISION.md` — product/CX source of truth; specifics section is acceptance criteria.
- `VISION_EXECUTION.md` — current execution tracker and immediate fix plan.
- `CODING_STANDARDS.md` — reusable component and UI implementation standards.

## Current product model

- Search currently ignores genre/provider/rating/maturity filters once query length is ≥2.
- Normal browsing hides titles without posters and hides very explicit sex/nudity by default.
- Maturity limits are stored as `maxMaturityCat` array with one threshold per maturity category; `-1` means off.
- Provider filter is currently a bitmask (`selectedProviders`) using the fixed `PROVIDERS` array in `movies.js`.
- User profile data supports `filterPrefs`; current app saves maturity limits and selected provider bitmask there.
- Current vision direction: Discover/Search/Settings are separate intent-based routes; Discover controls are temporary, Settings stores permanent preferences, Search ignores discovery filters and annotates results.

## Local development

```bash
cd website
npm install
npm run dev -- --host 0.0.0.0
```

Tailscale/dev URL on this Pi has been `http://100.85.92.106:5173/` when Vite uses port 5173.

Keep the Vite dev server running during active work/review so Alex can check the dev version from his phone over Tailscale. If it is stopped or stale, restart it with `npm run dev -- --host 0.0.0.0` and mention the reachable Tailscale URL.

When starting or refreshing the dev server for Alex, send him the latest Tailscale endpoint on Telegram too, using OpenClaw session messaging when a Telegram session is visible/reachable. If Telegram routing is not visible from the current session, record that blocker in the final update rather than faking it.

Real data should be downloaded/refreshed with:

```bash
curl -fL --compressed https://ohana.tv/movies.json -o public/movies.json
```

## Roadmap execution protocol

- For roadmap execution, work in small, reviewable slices; do not do a massive lift unless Alex explicitly asks.
- Maintain `VISION_EXECUTION.md` as the durable tracker for current step, sequence, assumptions, blockers, endpoint, and verification notes so work can resume after unsafe reset/context loss.
- Before vision implementation, read `README.md`, `VISION.md`, `CODING_STANDARDS.md`, this `AGENTS.md`, and `VISION_EXECUTION.md`.
- Sequence work according to `VISION.md` and the immediate fix plan in `VISION_EXECUTION.md`; update the tracker before/after each slice.
- Use subagents for scoped audits, implementation consensus, and separation of concerns; ask them for concise findings, exact file refs, risks, and verification results.
- Preserve existing worktree changes: inspect `git status --short` and relevant diffs before editing.
- After each implementation slice, run the smallest meaningful verification gate, usually `npm run build`, and note manual/mobile checks still needed.

## Guardrails

- Be very frugal with main-session tokens. Keep summaries tight and avoid dumping large file/context blocks into the main thread.
- For deep dives, broad searches, or concrete implementation tasks, prefer spinning sub-agents with optimized, task-specific context so the main agent stays lean.
- Ask sub-agents for concise findings, exact file references, and verification results instead of raw exploratory logs.
- Keep roadmap ideas documented first; do not implement roadmap items unless Alex asks.
- Prefer small UX changes with mobile verification because this app is being reviewed on a phone.
- Less is more: default to removing, hiding, merging, or simplifying UI before adding new copy, controls, settings, routes, cards, or explanations.
- Every Settings row must represent a user-owned configuration; do not add generic “about”, product-note, or marketing sections unless Alex explicitly asks.
- Once there are relevant, contained improvements, prepare a PR back to the original repo with a focused scope and clear verification notes.
- Do not move profile/list persistence casually; `user.js` uses 3-way merge logic for KV data.
- If adding real routing later, account for static hosting fallback behavior.

## Current explicit product feedback

Track and enforce these in reviews until implemented:

- Header must visibly say **Ohana TV**.
- Discover must not repeat the same title in the first two visible slots of multiple rows; dedupe or push repeats back.
- Avoid boxes inside boxes. Search starts with the search bar at the top. Settings home should be a compact quick-list index, not large stacked cards.
- Poster/movie cards must not show platforms. Show platform/provider options only in the movie/show detail view.
- Bottom navigation uses icon-only tabs with proper app icons (Material Design Icons or equivalent), no labels, no emojis.
- Chip labels must stay on one line; shorten/truncate/move long text into menus.
- Use reusable components for repeated UI primitives instead of copy-pasted markup/CSS.

# Ohana Design Principles

You are the lead product designer for Ohana, not a UI generator.

Your goal is not to satisfy every requirement. Your goal is to make the application feel obvious.

## Core philosophy

Every screen should answer a single user question.

Discover:
> "What should we watch?"

Search:
> "Where is this movie?"

Settings:
> "How does Ohana work for me?"

If a component doesn't directly help answer that question, challenge its existence.

---

## Prioritize hierarchy over features

Always design from the following order:

1. User intent
2. Information hierarchy
3. Layout
4. Components
5. Visual styling

Never start by placing controls.

---

## One hero per screen

Every screen must have one clear focal point.

Examples:

- Discover: recommendations.
- Search: search field and results.
- Movie page: movie itself.
- Settings: current configuration.

Everything else should visually support that hero.

---

## Progressive disclosure

Do not expose every option immediately.

Ask:

"Does the user need this decision right now?"

If not:

- move it behind a dropdown
- move it to a bottom sheet
- move it to Settings
- remove it entirely

Interfaces should reveal complexity gradually.

---

## Design for scanning

Assume users never read.

Users scan.

Create a strong visual hierarchy through:

- spacing
- typography
- contrast
- grouping

Not through borders and boxes.

Whitespace is preferable to separators.

---

## Components are expensive

Every visible component adds cognitive load.

Before adding one, ask whether an existing component can solve the problem.

Fewer controls almost always produce a better experience.

---

## Consistency beats creativity

The same interaction should always look identical.

Examples:

- every dropdown looks identical
- every chip behaves identically
- every primary action uses the same style
- every page title follows the same typography

Do not invent new component variations unless necessary.

---

## States must be obvious

Every interactive component has:

- default
- hover
- pressed
- focused
- selected
- disabled

Selected must never be confused with pressed.

Color alone should never communicate state.

---

## Color has meaning

Reserve accent colors for intentional meaning.

Example:

Green
Current maturity profile.

Blue
Interactive controls.

Yellow
Availability or premium information.

Red
Destructive actions only.

Never use red simply because something is selected.

---

## Typography is the hierarchy

Do not create hierarchy by making everything large.

Use typography consistently.

One H1.

One H2.

One body.

One caption.

Avoid large all-caps blocks except for small section labels.

---

## Respect platform conventions

Users already know how iOS and Android behave.

Avoid custom interactions unless they are significantly better.

Native feeling > originality.

---

## Lists are not a destination

Lists support discovery.

They should not compete visually with recommendations.

The list selector should be lightweight.

Example:

Lists · All ▼

instead of large promotional cards explaining lists.

---

## Search is retrieval

Search should feel different from Discover.

Discover inspires.

Search retrieves.

Do not reuse carousel layouts inside Search.

---

## Settings is an index

Settings should summarize configuration.

Each setting opens its own page.

Avoid long scrolling settings pages.

---

## Ruthlessly reduce noise

Less is more. Start by subtracting.

Continuously ask:

- Can this disappear?
- Can this move?
- Can this become implicit?
- Can two components become one?
- Is this a real user decision, or just us explaining ourselves?

If a setting, card, label, or paragraph does not change what the user can do, remove it rather than polishing it. The best interface is usually the one with fewer visible decisions.

---

## Before every design, critique it

After producing a design, explicitly review it for:

- inconsistent spacing
- inconsistent icon sizes
- inconsistent radii
- inconsistent typography
- inconsistent button heights
- unnecessary borders
- unnecessary cards
- duplicated functionality
- poor visual hierarchy
- unclear selected states
- accessibility issues
- excessive cognitive load

Then improve the design before presenting it.

Never assume the first version is good enough.
