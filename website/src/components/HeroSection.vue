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
            ref="searchInputEl"
            v-model="localSearch"
            type="search"
            placeholder="Search movies, shows, Spanish titles…"
            class="search-input"
            spellcheck="false"
            aria-label="Search movies"
            @focus="selectSearchText"
            @pointerup="selectSearchText"
          />
          <div v-if="localSearch || store.searchQuery" class="search-actions">
            <button class="search-clear-btn" type="button" aria-label="Clear search" @click="clearSearch">
              <span aria-hidden="true">×</span>
            </button>
            <span v-if="store.searchQuery" class="search-results-count">{{ store.filteredMovies.length }} results</span>
          </div>
        </div>

        <div ref="chipRowEl" class="chip-row" role="toolbar" aria-label="Browse controls">
          <FilterMenu
            :open="activePanel === 'titleType'"
            :active="store.titleType !== 'both'"
            :label="titleTypeLabel"
            menu-class="filter-menu--title-type"
            @toggle="togglePanel('titleType')"
          >
              <div class="filter-heading">
                <p class="filter-label">Title type</p>
              </div>
              <div class="menu-options menu-options--single">
                <button
                  v-for="option in titleTypeOptions"
                  :key="option.value"
                  class="menu-option"
                  :class="{ active: store.titleType === option.value }"
                  type="button"
                  role="menuitemradio"
                  :aria-checked="store.titleType === option.value"
                  @click="selectTitleType(option.value)"
                >{{ option.label }}</button>
              </div>
          </FilterMenu>

          <FilterMenu
            :open="activePanel === 'genres'"
            :active="Boolean(store.selectedGenres.size)"
            :label="genreChipLabel"
            menu-class="filter-menu--picker"
            @toggle="togglePanel('genres')"
          >
              <div class="filter-heading">
                <p class="filter-label">Genres</p>
                <span>{{ store.selectedGenres.size || 'Any' }}</span>
              </div>
              <div class="menu-options menu-options--grid">
                <button
                  v-for="genre in GENRE_LABELS"
                  :key="genre"
                  class="menu-option"
                  :class="{ active: store.selectedGenres.has(genre) }"
                  type="button"
                  role="menuitemcheckbox"
                  :aria-checked="store.selectedGenres.has(genre)"
                  @click="store.toggleGenre(genre)"
                >{{ genre }}</button>
              </div>
          </FilterMenu>

          <FilterMenu
            v-if="store.availableProviders.length"
            :open="activePanel === 'providers'"
            :active="Boolean(selectedProviderCount)"
            :label="providerChipLabel"
            menu-class="filter-menu--picker"
            @toggle="togglePanel('providers')"
          >
              <div class="filter-heading">
                <p class="filter-label">Streaming on</p>
                <span>{{ selectedProviderNames || 'Any service' }}</span>
              </div>
              <div class="menu-options menu-options--grid">
                <button
                  v-for="p in store.availableProviders"
                  :key="p.id"
                  class="menu-option menu-option--provider"
                  :class="{ active: store.selectedProviders & p.bit }"
                  type="button"
                  role="menuitemcheckbox"
                  :aria-checked="Boolean(store.selectedProviders & p.bit)"
                  @click="store.toggleProvider(p.bit)"
                >{{ p.name }}</button>
              </div>
          </FilterMenu>

          <FilterMenu
            :open="activePanel === 'rating'"
            :active="store.minRating > 0"
            :label="ratingChipLabel"
            menu-class="filter-menu--rating"
            @toggle="togglePanel('rating')"
          >
              <div class="filter-heading">
                <p class="filter-label">Min rating</p>
              </div>
              <div class="rating-slider-wrap">
                <div class="rating-scale" aria-hidden="true">
                  <span>10</span>
                  <span>5</span>
                  <span>0</span>
                </div>
                <input
                  v-model.number="store.minRating"
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  class="rating-slider"
                  orient="vertical"
                  aria-orientation="vertical"
                  :aria-valuetext="store.minRating ? `${store.minRating}+` : 'Any rating'"
                  aria-label="Minimum rating"
                />
                <span class="rating-value">{{ store.minRating ? `${store.minRating}+` : 'All' }}</span>
              </div>
          </FilterMenu>

          <button
            class="control-chip control-chip--safe"
            type="button"
            :class="{ active: store.safeBrowsingEnabled }"
            :aria-pressed="store.safeBrowsingEnabled"
            @click="store.safeBrowsingEnabled = !store.safeBrowsingEnabled"
          >
            Safe {{ store.safeBrowsingEnabled ? 'on' : 'off' }}
          </button>

          <button v-if="hasFilters" class="clear-btn" type="button" @click="store.clearFilters">Clear</button>
        </div>
      </div>

      <p v-if="hasFilters" class="filter-summary">
        Showing {{ store.filteredMovies.length }} of {{ store.allMovies.length }} titles
      </p>
    </div>
  </header>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import FilterMenu from "@/components/FilterMenu.vue";
import { useMovieStore, GENRE_LABELS } from "@/stores/movies.js";

const emit = defineEmits(["open-settings"]);
const store = useMovieStore();
const activePanel = ref(null);
const chipRowEl = ref(null);
const searchInputEl = ref(null);

const titleTypeOptions = [
  { value: "both", label: "Both" },
  { value: "movies", label: "Movies" },
  { value: "tv", label: "TV Shows" },
];

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

const selectedProviderCount = computed(() =>
  store.availableProviders.filter(p => store.selectedProviders & p.bit).length
);

const browseFilterCount = computed(() =>
  store.selectedGenres.size +
  selectedProviderCount.value +
  (store.titleType !== "both" ? 1 : 0) +
  (store.minRating > 0 ? 1 : 0)
);

const selectedProviderNames = computed(() =>
  store.availableProviders
    .filter(p => store.selectedProviders & p.bit)
    .map(p => p.name)
    .join(", ")
);

const genreChipLabel = computed(() => {
  const count = store.selectedGenres.size;
  if (count === 0) return "Genres";
  if (count === 1) return [...store.selectedGenres][0];
  return `${count} genres`;
});

const providerChipLabel = computed(() => {
  const names = selectedProviderNames.value.split(", ").filter(Boolean);
  if (names.length === 0) return "Any provider";
  if (names.length === 1) return names[0];
  return `${names.length} providers`;
});

const ratingChipLabel = computed(() => store.minRating ? `Rating ${store.minRating}+` : "Rating");
const titleTypeLabel = computed(() => titleTypeOptions.find(option => option.value === store.titleType)?.label ?? "Both");

function selectTitleType(value) {
  store.titleType = value;
  activePanel.value = null;
}

function togglePanel(panel) {
  activePanel.value = activePanel.value === panel ? null : panel;
}

function selectSearchText() {
  if (!localSearch.value) return;
  requestAnimationFrame(() => searchInputEl.value?.select());
}

function clearSearch() {
  clearTimeout(debounceTimer);
  localSearch.value = "";
  store.searchQuery = "";
  searchInputEl.value?.focus();
}

function onDocumentPointerDown(event) {
  if (!activePanel.value) return;
  if (chipRowEl.value?.contains(event.target)) return;
  activePanel.value = null;
}

onMounted(() => document.addEventListener("pointerdown", onDocumentPointerDown));
onUnmounted(() => document.removeEventListener("pointerdown", onDocumentPointerDown));

const hasFilters = computed(() =>
  store.searchQuery ||
  browseFilterCount.value > 0 ||
  store.maxMaturityCat.some(v => v >= 0) ||
  !store.safeBrowsingEnabled
);
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 360px;
  padding: 54px 48px 32px;
  overflow: visible;
  border-bottom: 1px solid var(--border);
  margin-bottom: 22px;
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

.hero-content { position: relative; z-index: 5; max-width: 1180px; margin: 0 auto; width: 100%; }
.hero-brand { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; margin-bottom: 22px; }
.hero-kicker { font-family: var(--font-display); font-size: 28px; letter-spacing: 0.14em; color: #34d399; text-shadow: 0 0 35px rgba(52,211,153,0.34); }
.hero-title { max-width: 780px; margin-top: 4px; font-family: var(--font-display); font-size: clamp(42px, 7vw, 78px); letter-spacing: 0.045em; line-height: 0.95; color: var(--white); }

.settings-link,
.control-chip,
.clear-btn,
.family-pill button,
.menu-option {
  font-family: var(--font-body);
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background 0.15s, opacity 0.15s;
}
.settings-link { padding: 8px 14px; border: 1px solid rgba(255,255,255,0.16); border-radius: 99px; background: rgba(22,22,31,0.72); color: var(--white); }
.settings-link:hover { border-color: var(--accent); color: var(--accent); }

.search-panel { position: relative; overflow: visible; max-width: 920px; padding: 14px; border: 1px solid rgba(255,255,255,0.11); border-radius: 20px; background: rgba(15,15,26,0.78); box-shadow: 0 24px 70px rgba(0,0,0,0.28); backdrop-filter: blur(12px); }
.hero-search { position: relative; display: flex; align-items: center; }
.search-icon { position: absolute; left: 18px; width: 20px; height: 20px; color: var(--muted); pointer-events: none; }
.search-input { width: 100%; min-width: 0; padding: 17px 184px 17px 52px; background: rgba(8,8,16,0.92); border: 1px solid rgba(255,255,255,0.14); border-radius: 14px; color: var(--white); font-family: var(--font-body); font-size: 17px; outline: none; }
.search-input::placeholder { color: rgba(240,238,232,0.46); }
.search-input:focus { border-color: rgba(232,54,93,0.72); background: rgba(12,12,21,0.98); }
.search-input::-webkit-search-cancel-button { display: none; }
.search-actions { position: absolute; right: 12px; display: inline-flex; align-items: center; gap: 10px; }
.search-clear-btn { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: 1px solid rgba(255,255,255,0.14); border-radius: 50%; background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.72); font-size: 22px; line-height: 1; cursor: pointer; transition: border-color 0.15s, color 0.15s, background 0.15s; }
.search-clear-btn:hover, .search-clear-btn:focus-visible { border-color: rgba(232,54,93,0.62); background: rgba(232,54,93,0.14); color: var(--white); outline: none; }
.search-results-count { font-size: 12px; color: var(--muted); pointer-events: none; white-space: nowrap; }

.chip-row { position: relative; z-index: 30; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-top: 12px; }
.control-chip, .clear-btn { padding: 7px 12px; border: 1px solid rgba(255,255,255,0.13); border-radius: 99px; background: rgba(255,255,255,0.04); color: var(--muted); font-size: 13px; }
.control-chip:hover, .clear-btn:hover, .control-chip.active { border-color: var(--accent); color: var(--white); background: rgba(232,54,93,0.14); }
.control-chip--safe.active { border-color: rgba(45,212,191,0.42); background: rgba(45,212,191,0.12); color: var(--teal); }
.clear-btn { margin-left: auto; }

.family-pill { display: inline-flex; align-items: center; gap: 8px; max-width: 100%; padding: 6px 8px 6px 12px; border: 1px solid rgba(45,212,191,0.32); border-radius: 99px; background: rgba(45,212,191,0.1); color: rgba(255,255,255,0.84); font-size: 12px; }
.family-pill span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.family-pill button { border: 0; border-radius: 99px; padding: 3px 8px; background: rgba(45,212,191,0.18); color: var(--teal); font-size: 12px; }

.filter-heading { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; color: var(--muted); font-size: 12px; }
.filter-heading span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.filter-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: rgba(255,255,255,0.68); }
.menu-options { display: grid; align-content: start; gap: 8px; width: max-content; max-width: calc(100vw - 56px); max-height: min(420px, 62vh); overflow: auto; padding-right: 2px; }
.menu-options--grid { grid-template-columns: repeat(2, minmax(max-content, 1fr)); }
.menu-options--single { grid-template-columns: minmax(128px, 1fr); width: 100%; }
.menu-option { display: flex; align-items: center; width: 100%; min-width: 112px; min-height: 40px; max-width: 180px; padding: 9px 11px; background: rgba(30,30,42,0.86); border: 1px solid rgba(255,255,255,0.16); border-radius: 11px; color: rgba(255,255,255,0.78); font: inherit; font-size: 12px; line-height: 1.2; text-align: left; white-space: normal; overflow-wrap: anywhere; cursor: pointer; transition: border-color 0.15s, color 0.15s, background 0.15s; }
.menu-option:hover { border-color: rgba(232,54,93,0.42); color: var(--white); }
.menu-option.active { background: var(--accent); border-color: var(--accent); color: var(--white); }
.menu-option--provider.active { background: rgba(45,212,191,0.15); border-color: var(--teal); color: var(--teal); }

.rating-slider-wrap { display: grid; grid-template-columns: auto 48px auto; align-items: center; justify-items: center; gap: 10px; padding: 2px 1px 4px; }
.rating-scale { height: 178px; display: flex; flex-direction: column; justify-content: space-between; color: var(--muted); font-size: 11px; line-height: 1; }
.rating-slider { -webkit-appearance: slider-vertical; appearance: slider-vertical; writing-mode: vertical-lr; direction: rtl; width: 48px; height: 184px; min-height: 184px; margin: 0; padding: 0 14px; background: transparent; outline: none; cursor: pointer; accent-color: var(--accent); touch-action: none; }
.rating-slider::-webkit-slider-runnable-track { width: 8px; border-radius: 99px; background: var(--surface3); }
.rating-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 28px; height: 28px; border-radius: 50%; background: var(--accent); cursor: pointer; box-shadow: 0 0 0 7px rgba(232,54,93,0.18); }
.rating-slider::-moz-range-track { width: 8px; background: var(--surface3); border-radius: 99px; }
.rating-slider::-moz-range-thumb { width: 28px; height: 28px; border: 0; border-radius: 50%; background: var(--accent); cursor: pointer; box-shadow: 0 0 0 7px rgba(232,54,93,0.18); }
.rating-value { font-size: 13px; font-weight: 700; color: var(--white); min-width: 36px; text-align: center; }
.filter-summary { margin-top: 12px; font-size: 13px; color: var(--muted); }

@media (max-width: 640px) {
  .hero { min-height: 330px; padding: 42px 16px 24px; margin-bottom: 14px; }
  .hero-brand { gap: 14px; margin-bottom: 18px; }
  .settings-link { display: none; }
  .hero-title { font-size: clamp(40px, 15vw, 62px); }
  .search-panel { padding: 10px; border-radius: 16px; }
  .search-input { padding: 15px 52px 15px 46px; font-size: 15px; }
  .search-actions { right: 10px; }
  .search-clear-btn { width: 30px; height: 30px; font-size: 20px; }
  .search-results-count { display: none; }
  .clear-btn { margin-left: 0; }
  .poster-col:nth-child(n+4) { display: none; }
  .menu-options { max-width: calc(100vw - 48px); }
  .menu-options--grid { grid-template-columns: minmax(0, 1fr); }
  .menu-option { max-width: min(260px, calc(100vw - 72px)); }
}
</style>
