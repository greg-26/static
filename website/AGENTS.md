# AGENTS.md — Ohana TV Website

Scope: this file is for the `website/` project only inside the Ohana static repo.

## Project shape

- Before implementation or CX review, read `README.md` for current project/product context, then use this `AGENTS.md` for agent-specific workflow and guardrails.
- Vue 3 + Composition API, Pinia, Fuse.js, Vite.
- Entry: `src/main.js` mounts `src/App.vue` with Pinia.
- No Vue Router currently. Lightweight path handling lives in `App.vue`; `/roadmap` is handled by checking `window.location.pathname`.
- Vite alias: `@` → `src` from `vite.config.js`.
- Static data is loaded from `public/movies.json` at runtime via `fetch("movies.json")` in `src/stores/movies.js`.
- The real `movies.json` file is required for meaningful local CX review. If it is missing after cloning the repo, download the canonical copy from `https://ohana.tv/movies.json` into `public/movies.json`.
- Even when `public/movies.json` exists, re-download it every now and then before product/UX review because the canonical catalog may have changed.
- If `movies.json` is missing/unreadable, the store falls back to generated mock movies, but that fallback is only for development smoke tests — not real review.

## Key files

- `src/App.vue` — top-level layout, modal state, URL query handling for `?movie=` and `?add=`, profile filter persistence.
- `src/stores/movies.js` — catalog loading, Fuse search, filtering, row generation, provider/genre constants.
- `src/stores/user.js` — local profile token, KV-backed profile/list data, watched/list/provider-ish profile persistence, filter preferences.
- `src/components/HeroSection.vue` — hero/search/filter UI. Current provider filters live here.
- `src/components/ConfigModal.vue` — profile, list management, maturity limits. This is getting too broad and should be split later.
- `src/components/MovieRow.vue` — horizontal lazy-rendered movie rows with desktop scroll arrows.
- `src/maturity.js` — maturity category definitions and score helpers.
- `ROADMAP.md` — product/UX ideas to review before implementation.

## Current product model

- Search currently ignores genre/provider/rating/maturity filters once query length is ≥2.
- Normal browsing hides titles without posters and hides very explicit sex/nudity by default.
- Maturity limits are stored as `maxMaturityCat` array with one threshold per maturity category; `-1` means off.
- Provider filter is currently a bitmask (`selectedProviders`) using the fixed `PROVIDERS` array in `movies.js`.
- User profile data supports `filterPrefs`; current app saves maturity limits and selected provider bitmask there.
- Current roadmap direction: browsing type defaults to `Both`; search can ignore browse filters for now; providers should be a compact optional filter chip (`Any provider`, one provider name, or `3 providers`) rather than forced onboarding; maturity should live in a `Safe` filter chip; genres should use one chip (`Genres`, one genre name, or `3 genres`) that opens the picker.

## Local development

```bash
cd website
npm install
npm run dev -- --host 0.0.0.0
```

Tailscale/dev URL on this Pi has been `http://100.85.92.106:5173/` when Vite uses port 5173.

Keep the Vite dev server running during active work/review so Alex can check the dev version from his phone over Tailscale. If it is stopped or stale, restart it with `npm run dev -- --host 0.0.0.0` and mention the reachable Tailscale URL.

Real data should be downloaded/refreshed with:

```bash
curl -fL --compressed https://ohana.tv/movies.json -o public/movies.json
```

## Guardrails

- Be very frugal with main-session tokens. Keep summaries tight and avoid dumping large file/context blocks into the main thread.
- For deep dives, broad searches, or concrete implementation tasks, prefer spinning sub-agents with optimized, task-specific context so the main agent stays lean.
- Ask sub-agents for concise findings, exact file references, and verification results instead of raw exploratory logs.
- Keep roadmap ideas documented first; do not implement roadmap items unless Alex asks.
- Prefer small UX changes with mobile verification because this app is being reviewed on a phone.
- Once there are relevant, contained improvements, prepare a PR back to the original repo with a focused scope and clear verification notes.
- Do not move profile/list persistence casually; `user.js` uses 3-way merge logic for KV data.
- If adding real routing later, account for static hosting fallback behavior.
