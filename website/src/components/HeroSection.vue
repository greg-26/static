<template>
  <header class="hero">
    <div class="hero-poster-bg" aria-hidden="true">
      <div v-for="(col, ci) in HERO_POSTER_COLS" :key="ci" class="poster-col">
        <img v-for="(url, i) in col" :key="i" :src="url" loading="lazy" class="poster-bg-img" />
      </div>
    </div>
    <div class="hero-bg-overlay"></div>

    <div class="hero-content">
      <div class="hero-brand">
        <div>
          <span class="hero-kicker">Ohana TV</span>
          <h1 class="hero-title">Find something safe to watch.</h1>
        </div>
        <button class="settings-link" type="button" @click="emit('open-settings')">Settings</button>
      </div>

      <div class="search-panel">
        <div class="hero-search">
          <svg class="search-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.5"/>
            <path d="M13.5 13.5L17 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <input
            v-model="localSearch"
            type="search"
            placeholder="Search movies, shows, Spanish titles…"
            class="search-input"
            spellcheck="false"
            aria-label="Search movies"
          />
          <span v-if="store.searchQuery" class="search-results-count">{{ store.filteredMovies.length }} results</span>
        </div>

        <div class="quick-row">
          <button
            class="browse-toggle"
            type="button"
            :class="{ active: browseOpen || browseFilterCount }"
            :aria-expanded="browseOpen"
            @click="browseOpen = !browseOpen"
          >
            Browse filters<span v-if="browseFilterCount"> · {{ browseFilterCount }}</span>
          </button>

          <div v-if="activeMaturitySummary" class="family-pill">
            <span>{{ activeMaturitySummary }}</span>
            <button type="button" @click="emit('open-settings')">Edit</button>
          </div>

          <button v-if="hasFilters" class="clear-btn" type="button" @click="store.clearFilters">Clear</button>
        </div>

        <div v-if="browseOpen" class="browse-panel">
          <section class="filter-section">
            <div class="filter-heading">
              <p class="filter-label">Genre</p>
              <span>{{ store.selectedGenres.size || 'Any' }}</span>
            </div>
            <div class="filter-chips">
              <button
                v-for="genre in GENRE_LABELS"
                :key="genre"
                class="chip"
                :class="{ active: store.selectedGenres.has(genre) }"
                type="button"
                @click="store.toggleGenre(genre)"
              >{{ genre }}</button>
            </div>
          </section>

          <section v-if="store.availableProviders.length" class="filter-section">
            <div class="filter-heading">
              <p class="filter-label">Streaming on</p>
              <span>{{ selectedProviderNames || 'Any service' }}</span>
            </div>
            <div class="filter-chips">
              <button
                v-for="p in store.availableProviders"
                :key="p.id"
                class="chip chip--provider"
                :class="{ active: store.selectedProviders & p.bit }"
                type="button"
                @click="store.toggleProvider(p.bit)"
              >{{ p.name }}</button>
            </div>
          </section>

          <section class="filter-section filter-section--rating">
            <div class="filter-heading">
              <p class="filter-label">Minimum IMDb rating</p>
              <span>{{ store.minRating ? `${store.minRating}+` : 'Any rating' }}</span>
            </div>
            <div class="rating-slider-wrap">
              <input v-model.number="store.minRating" type="range" min="0" max="10" step="0.5" class="rating-slider" />
              <span class="rating-value">{{ store.minRating ? `${store.minRating}+` : 'All' }}</span>
            </div>
          </section>
        </div>
      </div>

      <p v-if="hasFilters" class="filter-summary">
        Showing {{ store.filteredMovies.length }} of {{ store.allMovies.length }} titles
      </p>
    </div>
  </header>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useMovieStore, GENRE_LABELS } from "@/stores/movies.js";
import { MATURITY_CATEGORIES, SEVERITY_LABELS } from "@/maturity.js";

const emit = defineEmits(["open-settings"]);
const store = useMovieStore();
const browseOpen = ref(false);

const localSearch = ref(store.searchQuery);
let debounceTimer = null;
watch(localSearch, val => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => { store.searchQuery = val; }, 120);
});
watch(() => store.searchQuery, val => { if (val !== localSearch.value) localSearch.value = val; });

const BASE = "https://image.tmdb.org/t/p/w342/";
const HERO_POSTER_COLS = [
  ["qJ2tW6WMUDux911r6m7haRef0WH","aabwWZWx6z1aYP4PX2ADvbDKktd","8FHOtUpNIk5ZPEay2N2EY5lrxkv","4GIeI5K5YdDUkR3mNQBoScpSFEf"],
  ["yihdXomYb5kTeSivtFndMy5iDmf","3Qud19bBUrrJAzy0Ilm8gRJlJXP","oJ7g2CifqpStmoYQyaLQgEU32qO","pHpq9yNUIo6aDoCXEBzjSolywgz"],
  ["aOIuZAjPaRIE6CMzbazvcHuHXDc","rCzpDGLbOoPwLjy3OAm5NUPOTrC","9cqNxx0GxF0bflZmeSMuL5tnGzr","7WsyChQLEftFiDOVTGkv3hFpyyt"],
  ["ybrX94xQm8lXYpZAPRmwD9iIbWP","eTp7gSPkSF3Aw79mNx1NkBP1PZT","yQvGrMoipbRoddT0ZR8tPoR7NfX","RYMX2wcKCBAr24UyPD7xwmjaTn"],
  ["iB64vpL3dIObOtMZgX3RqdVdQDc","fWVSwgjpT2D78VUh6X8UBd2rorW","cWsBscZzwu5brg9YjNkGewRUvJX","cRY25Q32kDNPFDkFkxAs6bgCq3L"],
].map(col => col.map(hash => BASE + hash + ".jpg"));

const activeMaturitySummary = computed(() => {
  const active = store.maxMaturityCat
    .map((level, i) => ({ level, category: MATURITY_CATEGORIES[i] }))
    .filter(({ level }) => level >= 0);
  if (!active.length) return "";
  return active.map(({ level, category }) => `${category.label} ≤ ${SEVERITY_LABELS[level]}`).join(" · ");
});

const browseFilterCount = computed(() =>
  store.selectedGenres.size +
  store.availableProviders.filter(p => store.selectedProviders & p.bit).length +
  (store.minRating > 0 ? 1 : 0)
);

const selectedProviderNames = computed(() =>
  store.availableProviders
    .filter(p => store.selectedProviders & p.bit)
    .map(p => p.name)
    .join(", ")
);

const hasFilters = computed(() =>
  store.searchQuery ||
  browseFilterCount.value > 0 ||
  store.maxMaturityCat.some(v => v >= 0)
);
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 360px;
  padding: 54px 48px 32px;
  overflow: hidden;
  border-bottom: 1px solid var(--border);
  margin-bottom: 22px;
  contain: layout paint;
}

.hero-poster-bg {
  position: absolute;
  inset: 0;
  display: flex;
  gap: 8px;
  padding: 0 4px;
  overflow: hidden;
  z-index: 0;
  opacity: 0.75;
}

.poster-col { display: flex; flex-direction: column; gap: 8px; flex: 1; }
.poster-col:nth-child(even) { margin-top: -52px; }
.poster-col:nth-child(odd) { margin-top: 22px; }
.poster-bg-img { width: 100%; aspect-ratio: 2/3; object-fit: cover; border-radius: 5px; opacity: 0.45; display: block; }

.hero-bg-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(90deg, rgba(8,8,16,0.96) 0%, rgba(8,8,16,0.8) 48%, rgba(8,8,16,0.38) 100%),
    linear-gradient(to bottom, rgba(8,8,16,0.2) 0%, var(--black) 100%),
    radial-gradient(circle at 20% 0%, rgba(232,54,93,0.34), transparent 36%);
  pointer-events: none;
}

.hero-content { position: relative; z-index: 2; max-width: 1180px; margin: 0 auto; width: 100%; }
.hero-brand { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; margin-bottom: 22px; }
.hero-kicker { font-family: var(--font-display); font-size: 28px; letter-spacing: 0.14em; color: #34d399; text-shadow: 0 0 35px rgba(52,211,153,0.34); }
.hero-title { max-width: 780px; margin-top: 4px; font-family: var(--font-display); font-size: clamp(42px, 7vw, 78px); letter-spacing: 0.045em; line-height: 0.95; color: var(--white); }

.settings-link,
.browse-toggle,
.clear-btn,
.family-pill button,
.chip {
  font-family: var(--font-body);
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background 0.15s, opacity 0.15s;
}
.settings-link { padding: 8px 14px; border: 1px solid rgba(255,255,255,0.16); border-radius: 99px; background: rgba(22,22,31,0.72); color: var(--white); }
.settings-link:hover { border-color: var(--accent); color: var(--accent); }

.search-panel { max-width: 920px; padding: 14px; border: 1px solid rgba(255,255,255,0.11); border-radius: 20px; background: rgba(15,15,26,0.78); box-shadow: 0 24px 70px rgba(0,0,0,0.28); backdrop-filter: blur(12px); }
.hero-search { position: relative; display: flex; align-items: center; }
.search-icon { position: absolute; left: 18px; width: 20px; height: 20px; color: var(--muted); pointer-events: none; }
.search-input { width: 100%; min-width: 0; padding: 17px 112px 17px 52px; background: rgba(8,8,16,0.92); border: 1px solid rgba(255,255,255,0.14); border-radius: 14px; color: var(--white); font-family: var(--font-body); font-size: 17px; outline: none; }
.search-input::placeholder { color: rgba(240,238,232,0.46); }
.search-input:focus { border-color: rgba(232,54,93,0.72); background: rgba(12,12,21,0.98); }
.search-input::-webkit-search-cancel-button { display: none; }
.search-results-count { position: absolute; right: 16px; font-size: 12px; color: var(--muted); pointer-events: none; }

.quick-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 12px; }
.browse-toggle, .clear-btn { padding: 7px 12px; border: 1px solid rgba(255,255,255,0.13); border-radius: 99px; background: rgba(255,255,255,0.04); color: var(--muted); font-size: 13px; }
.browse-toggle:hover, .clear-btn:hover, .browse-toggle.active { border-color: var(--accent); color: var(--white); background: rgba(232,54,93,0.14); }
.clear-btn { margin-left: auto; }

.family-pill { display: inline-flex; align-items: center; gap: 8px; max-width: 100%; padding: 6px 8px 6px 12px; border: 1px solid rgba(45,212,191,0.32); border-radius: 99px; background: rgba(45,212,191,0.1); color: rgba(255,255,255,0.84); font-size: 12px; }
.family-pill span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.family-pill button { border: 0; border-radius: 99px; padding: 3px 8px; background: rgba(45,212,191,0.18); color: var(--teal); font-size: 12px; }

.browse-panel { display: grid; gap: 16px; max-height: 50dvh; margin-top: 14px; padding-top: 14px; overflow-y: auto; border-top: 1px solid rgba(255,255,255,0.08); overscroll-behavior: contain; }
.filter-section { display: grid; gap: 8px; }
.filter-heading { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; color: var(--muted); font-size: 12px; }
.filter-heading span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.filter-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: rgba(255,255,255,0.68); }
.filter-chips { display: flex; flex-wrap: nowrap; gap: 7px; overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch; padding-bottom: 2px; }
.filter-chips::-webkit-scrollbar { display: none; }
.chip { flex: 0 0 auto; padding: 6px 11px; background: rgba(30,30,42,0.86); border: 1px solid rgba(255,255,255,0.16); border-radius: 99px; color: rgba(255,255,255,0.78); font-size: 12px; white-space: nowrap; }
.chip:hover { border-color: rgba(232,54,93,0.42); color: var(--white); }
.chip.active { background: var(--accent); border-color: var(--accent); color: var(--white); }
.chip--provider.active { background: rgba(45,212,191,0.15); border-color: var(--teal); color: var(--teal); }

.rating-slider-wrap { display: flex; align-items: center; gap: 12px; }
.rating-slider { -webkit-appearance: none; width: min(280px, 100%); height: 4px; background: var(--surface3); border-radius: 99px; outline: none; cursor: pointer; }
.rating-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 17px; height: 17px; border-radius: 50%; background: var(--accent); cursor: pointer; }
.rating-value { font-size: 13px; font-weight: 600; color: var(--white); min-width: 34px; }
.filter-summary { margin-top: 12px; font-size: 13px; color: var(--muted); }

@media (max-width: 640px) {
  .hero { min-height: 330px; padding: 42px 16px 24px; margin-bottom: 14px; }
  .hero-brand { gap: 14px; margin-bottom: 18px; }
  .settings-link { display: none; }
  .hero-title { font-size: clamp(40px, 15vw, 62px); }
  .search-panel { padding: 10px; border-radius: 16px; }
  .search-input { padding: 15px 16px 15px 46px; font-size: 15px; }
  .search-results-count { display: none; }
  .clear-btn { margin-left: 0; }
  .poster-col:nth-child(n+4) { display: none; }
}
</style>
