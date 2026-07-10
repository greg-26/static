# CineVault — Movie Discovery Website

Netflix-style movie browser with fuzzy search, compact browse filters, and bitmask-encoded data.

## Project notes

- [ROADMAP.md](./ROADMAP.md) tracks product/UX ideas. It is also visible in the app at `/roadmap`.
- [AGENTS.md](./AGENTS.md) captures project-specific implementation notes for future agent work.
- Current roadmap direction: keep search and posters most prominent; move browse controls toward compact chips with rich menus/bottom sheets.

## Stack

- **Vue 3** + Composition API
- **Pinia** for state management
- **Fuse.js** for fuzzy title search
- **Vite** for dev/build

## Setup

```bash
cd website
npm install
npm run dev
```

## With real data

1. Run the scraper to generate `public/movies.json`
2. `npm run dev` — the app loads it automatically

Without `movies.json`, the app uses 500 mock movies for development.

## Architecture

```
src/
  stores/movies.js      ← Pinia store, filtering logic, Fuse.js
  components/
    HeroSection.vue     ← Search and browse filters/chips
    MovieRow.vue        ← Horizontal scrollable row with arrows
    MovieCard.vue       ← Poster card with hover overlay
    MovieModal.vue      ← Detail popup
  App.vue               ← Layout: loading → hero → rows/grid → modal
  components/RoadmapPage.vue ← Simple `/roadmap` page rendering ROADMAP.md
  assets/global.css     ← CSS variables, reset
```

## Filter logic

All filtering is computed in the Pinia store. Current roadmap direction keeps search broad for now: once title search is active, it may ignore browse filters like the existing behavior.

```
allMovies (20k)
  → genre bitmask filter     O(n), ~0.2ms
  → provider bitmask filter  O(n), ~1ms
  → rating range             O(n), ~0.1ms
  → Fuse.js title search     O(k), ~5ms on subset
  = filteredMovies
    → split into rows by genre/provider/ranking
```

## Data format

```json
{
  "movies": [{ "id": "tt...", "t": "Title", "y": 1994, "r": 9.3,
               "g": 4, "pop": 85.4, "p": "https://...poster.jpg", "prov": 18,
               "s": 1 }],
  "providers": { "8": "Netflix", "15": "Hulu" },
  "genres": { "Action": 1, "Comedy": 2, ... }
}
```
