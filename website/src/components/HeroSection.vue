<template>
  <header class="hero">
    <div class="hero-poster-bg" aria-hidden="true">
      <div v-for="(col, ci) in HERO_POSTER_COLS" :key="ci" class="poster-col">
        <img v-for="(url, i) in col" :key="i" :src="url" loading="lazy" class="poster-bg-img" />
      </div>
    </div>
    <div class="hero-bg-overlay"></div>

    <div class="hero-content">
      <div class="hero-topbar">
        <div class="hero-brand">
          <span class="hero-logo">Ohana TV</span>
          <span class="hero-tagline">Find something good for the whole family.</span>
        </div>
        <button class="settings-link" type="button" @click="emit('open-settings')">Settings</button>
      </div>

      <div class="hero-search-row">
        <div class="hero-search">
          <svg class="search-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.5"/>
            <path d="M13.5 13.5L17 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <input
            v-model="localSearch"
            type="search"
            placeholder="Search movies…"
            class="search-input"
            spellcheck="false"
          />
          <button v-if="store.searchQuery" class="search-clear" type="button" @click="clearSearch" aria-label="Clear search">×</button>
        </div>
      </div>

      <div class="browse-toolbar" aria-label="Catalog controls">
        <button
          class="toolbar-chip toolbar-chip--primary"
          type="button"
          :class="{ active: filtersOpen || browsingFilterCount > 0 }"
          :aria-expanded="filtersOpen"
          @click="filtersOpen = !filtersOpen"
        >
          Filters<span v-if="browsingFilterCount"> · {{ browsingFilterCount }}</span>
        </button>

        <button
          v-if="activeMaturitySummary"
          class="toolbar-chip toolbar-chip--quiet"
          type="button"
          @click="emit('open-settings')"
        >
          {{ activeMaturitySummary }}
        </button>

        <span v-if="store.searchQuery" class="toolbar-count">{{ store.filteredMovies.length }} results</span>
        <span v-else-if="hasFilters" class="toolbar-count">{{ store.filteredMovies.length }} of {{ store.allMovies.length }}</span>

        <button v-if="hasFilters" class="toolbar-clear" type="button" @click="clearAllFilters">Clear</button>
      </div>

      <transition name="filter-panel">
        <section v-if="filtersOpen && !store.searchQuery" class="filter-panel" aria-label="Filters">
          <div class="filter-section">
            <p class="filter-label">Genre</p>
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
          </div>

          <div class="filter-section" v-if="store.availableProviders.length">
            <p class="filter-label">Streaming on</p>
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
          </div>

          <div class="filter-section filter-section--rating">
            <p class="filter-label">Minimum IMDb rating</p>
            <div class="rating-slider-wrap">
              <input
                type="range"
                min="0" max="10" step="0.5"
                v-model.number="store.minRating"
                class="rating-slider"
              />
              <span class="rating-value">{{ store.minRating === 0 ? 'All' : `${store.minRating}+` }}</span>
            </div>
          </div>

          <div class="filter-section filter-section--preference">
            <p class="preference-copy">
              Family maturity limits are saved as a viewing preference.
              <button type="button" @click="emit('open-settings')">Edit in settings</button>
            </p>
          </div>
        </section>
      </transition>
    </div>
  </header>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useMovieStore, GENRE_LABELS } from "@/stores/movies.js";
import { MATURITY_CATEGORIES, SEVERITY_LABELS } from "@/maturity.js";

const emit = defineEmits(["open-settings"]);
const store = useMovieStore();
const filtersOpen = ref(false);

const localSearch = ref(store.searchQuery);
let debounceTimer = null;
watch(localSearch, val => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => { store.searchQuery = val; }, 150);
});
watch(() => store.searchQuery, val => {
  if (val !== localSearch.value) localSearch.value = val;
  if (val) filtersOpen.value = false;
});

const BASE = "https://image.tmdb.org/t/p/w342/";
const HERO_POSTER_COLS = [
  ["qJ2tW6WMUDux911r6m7haRef0WH","aabwWZWx6z1aYP4PX2ADvbDKktd","8FHOtUpNIk5ZPEay2N2EY5lrxkv","4GIeI5K5YdDUkR3mNQBoScpSFEf","mjkS2iAgWj3ik1DTjvI15nHZ7yl","rCzpDGLbOoPwLjy3OAm5NUPOTrC"],
  ["yihdXomYb5kTeSivtFndMy5iDmf","3Qud19bBUrrJAzy0Ilm8gRJlJXP","oJ7g2CifqpStmoYQyaLQgEU32qO","pHpq9yNUIo6aDoCXEBzjSolywgz","3bhkrj58Vtu7enYsRolD1fZdja1","byWgphT74ClOVa8EOGzYDkl8DVL"],
  ["aOIuZAjPaRIE6CMzbazvcHuHXDc","rCzpDGLbOoPwLjy3OAm5NUPOTrC","9cqNxx0GxF0bflZmeSMuL5tnGzr","7WsyChQLEftFiDOVTGkv3hFpyyt","qJ2tW6WMUDux911r6m7haRef0WH","9xjZS2rlVxm8SFx8kPC3aIGCOYQ"],
  ["ybrX94xQm8lXYpZAPRmwD9iIbWP","eTp7gSPkSF3Aw79mNx1NkBP1PZT","yQvGrMoipbRoddT0ZR8tPoR7NfX","RYMX2wcKCBAr24UyPD7xwmjaTn","tVvpFIoteRHNnoZMhdnwIVwJpCA","1g0dhYtq4irTY1GPXvft6k4YLjm"],
  ["iB64vpL3dIObOtMZgX3RqdVdQDc","fWVSwgjpT2D78VUh6X8UBd2rorW","cWsBscZzwu5brg9YjNkGewRUvJX","cRY25Q32kDNPFDkFkxAs6bgCq3L","ril8yx5SOmj0KjNlftsdfIp00fr","vqBmyAj0Xm9LnS1xe1MSlMAJyHq"],
].map(col => col.map(hash => BASE + hash + ".jpg"));

const activeMaturitySummary = computed(() => {
  const active = store.maxMaturityCat
    .map((level, i) => ({ level, category: MATURITY_CATEGORIES[i] }))
    .filter(({ level }) => level >= 0);
  if (!active.length) return "";
  if (active.length === MATURITY_CATEGORIES.length) return "Family limits on";
  return `Family limits: ${active.length}`;
});

const browsingFilterCount = computed(() =>
  store.selectedGenres.size +
  store.availableProviders.filter(p => store.selectedProviders & p.bit).length +
  (store.minRating > 0 ? 1 : 0)
);

const hasFilters = computed(() =>
  store.searchQuery ||
  browsingFilterCount.value > 0 ||
  store.maxMaturityCat.some(v => v >= 0)
);

function clearSearch() {
  localSearch.value = "";
  store.searchQuery = "";
}

function clearAllFilters() {
  store.clearFilters();
  localSearch.value = "";
}
</script>

<style scoped>
.hero {
  position: relative;
  padding: 56px 48px 28px;
  overflow: hidden;
  border-bottom: 1px solid var(--border);
  margin-bottom: 28px;
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
  transform: translateZ(0);
}

.poster-col { display: flex; flex-direction: column; gap: 8px; flex: 1; }
.poster-col:nth-child(even) { margin-top: -48px; }
.poster-col:nth-child(odd) { margin-top: 24px; }

.poster-bg-img {
  width: 100%;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  border-radius: 4px;
  opacity: 0.36;
  display: block;
  flex-shrink: 0;
}

.hero-bg-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(135deg, rgba(232,54,93,0.24) 0%, transparent 46%),
    linear-gradient(225deg, rgba(45,212,191,0.14) 0%, transparent 42%),
    linear-gradient(to bottom, rgba(8,8,16,0.42) 0%, rgba(8,8,16,0.86) 64%, var(--black) 100%);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 1120px;
  margin: 0 auto;
  width: 100%;
}

.hero-topbar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;
}

.hero-brand { display: flex; flex-direction: column; gap: 4px; }

.hero-logo {
  font-family: var(--font-display);
  font-size: clamp(46px, 8vw, 84px);
  letter-spacing: 0.1em;
  line-height: 0.9;
  color: #2ecc5a;
  text-shadow: 0 2px 40px rgba(52,211,153,0.45), 0 0 80px rgba(52,211,153,0.16);
}

.hero-tagline { font-size: 15px; color: rgba(255,255,255,0.8); }

.settings-link,
.toolbar-chip,
.toolbar-clear,
.search-clear,
.chip,
.preference-copy button {
  font-family: var(--font-body);
  cursor: pointer;
}

.settings-link {
  padding: 8px 13px;
  border: 1px solid rgba(255,255,255,0.22);
  border-radius: 99px;
  background: rgba(15,15,26,0.72);
  color: rgba(255,255,255,0.82);
  font-size: 13px;
}
.settings-link:hover { border-color: var(--accent); color: var(--white); }

.hero-search-row { max-width: 720px; }
.hero-search { position: relative; display: flex; align-items: center; }

.search-icon {
  position: absolute;
  left: 16px;
  width: 18px;
  height: 18px;
  color: var(--muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 15px 46px 15px 48px;
  background: rgba(18,18,28,0.96);
  border: 1px solid rgba(255,255,255,0.16);
  border-radius: 14px;
  color: var(--white);
  font-family: var(--font-body);
  font-size: 17px;
  outline: none;
  box-shadow: 0 18px 60px rgba(0,0,0,0.22);
  transition: border-color 0.15s, background 0.15s;
}
.search-input::placeholder { color: var(--muted); }
.search-input:focus { border-color: rgba(232,54,93,0.58); background: rgba(22,22,31,0.98); }
.search-input::-webkit-search-cancel-button { display: none; }

.search-clear {
  position: absolute;
  right: 10px;
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 50%;
  background: rgba(255,255,255,0.08);
  color: var(--muted);
  font-size: 20px;
  line-height: 1;
}

.browse-toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.toolbar-chip,
.toolbar-clear {
  padding: 7px 12px;
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 99px;
  background: rgba(15,15,26,0.68);
  color: rgba(255,255,255,0.82);
  font-size: 13px;
}
.toolbar-chip.active,
.toolbar-chip--primary:hover { border-color: var(--accent); color: var(--white); }
.toolbar-chip--quiet { color: var(--teal); border-color: rgba(45,212,191,0.32); }
.toolbar-count { font-size: 13px; color: var(--muted); }
.toolbar-clear { color: var(--muted); background: transparent; }
.toolbar-clear:hover { border-color: var(--accent); color: var(--accent); }

.filter-panel {
  margin-top: 14px;
  padding: 16px;
  background: rgba(15,15,26,0.78);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  display: grid;
  gap: 16px;
  max-width: 920px;
}

.filter-section { display: grid; gap: 9px; }
.filter-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.66);
}

.filter-chips {
  display: flex;
  gap: 7px;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 2px;
}
.filter-chips::-webkit-scrollbar { display: none; }

.chip {
  flex: 0 0 auto;
  padding: 6px 12px;
  background: rgba(30,30,42,0.94);
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 99px;
  color: rgba(255,255,255,0.78);
  font-size: 12px;
  white-space: nowrap;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}
.chip:hover { border-color: rgba(232,54,93,0.4); color: var(--white); }
.chip.active { background: var(--accent); border-color: var(--accent); color: var(--white); }
.chip--provider.active { background: rgba(45,212,191,0.15); border-color: var(--teal); color: var(--teal); }

.rating-slider-wrap { display: flex; align-items: center; gap: 12px; }
.rating-slider {
  -webkit-appearance: none;
  width: min(260px, 100%);
  height: 4px;
  background: var(--surface3);
  border-radius: 99px;
  outline: none;
  cursor: pointer;
}
.rating-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--accent);
}
.rating-value { font-size: 13px; font-weight: 600; color: var(--white); min-width: 34px; }

.preference-copy { font-size: 13px; color: var(--muted); line-height: 1.45; }
.preference-copy button { border: 0; background: none; color: var(--teal); padding: 0; font-size: inherit; }

.filter-panel-enter-active,
.filter-panel-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.filter-panel-enter-from,
.filter-panel-leave-to { opacity: 0; transform: translateY(-6px); }

@media (min-width: 760px) {
  .filter-panel { grid-template-columns: 1fr 1fr; }
  .filter-section:first-child,
  .filter-section--preference { grid-column: 1 / -1; }
}

@media (max-width: 640px) {
  .hero {
    padding: 42px 16px 22px;
    margin-bottom: 22px;
  }
  .hero-topbar { margin-bottom: 18px; }
  .hero-logo { font-size: 48px; }
  .hero-tagline { font-size: 14px; max-width: 260px; }
  .settings-link { padding: 7px 11px; font-size: 12px; }
  .search-input { font-size: 16px; border-radius: 12px; }
  .poster-col:nth-child(n+4) { display: none; }
  .filter-panel { margin-left: -2px; margin-right: -2px; padding: 14px; }
}
</style>
