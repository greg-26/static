<template>
  <section class="search-view">
    <div class="search-hero">
      <div class="search-box">
        <svg class="search-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.5"/>
          <path d="M13.5 13.5L17 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <input
          ref="inputEl"
          v-model="localSearch"
          type="search"
          placeholder="Search movies, shows, Spanish titles…"
          aria-label="Search movies and TV shows"
          spellcheck="false"
          @keydown.enter="commitSearch"
        />
        <button v-if="localSearch" type="button" aria-label="Clear search" @click="clearSearch">×</button>
      </div>
    </div>

    <div v-if="!queryActive" class="search-empty">
      <section v-if="recentSearches.length" class="recent-section">
        <SectionHeader title="Recent searches" compact level="h3">
          <template #actions>
            <button type="button" @click="clearRecentSearchesList">Clear</button>
          </template>
        </SectionHeader>
        <div class="recent-chips">
          <button v-for="query in recentSearches" :key="query" type="button" @click="runRecentSearch(query)">{{ query }}</button>
        </div>
      </section>

      <section v-if="recentViewedMovies.length" class="recent-section">
        <SectionHeader title="Recently viewed" compact level="h3" />
        <div class="recent-viewed-list">
          <SearchResultCard
            v-for="movie in recentViewedMovies"
            :key="movie.id"
            :movie="movie"
            @select="$emit('selectMovie', $event)"
          />
        </div>
      </section>
    </div>

    <div v-else class="results-wrap">
      <SectionHeader :title="`Results for “${store.searchQuery}”`" compact>
        <template #actions>
          <span class="result-count">{{ store.filteredMovies.length }} titles</span>
        </template>
      </SectionHeader>
      <div class="results-list">
        <SearchResultCard
          v-for="movie in store.filteredMovies.slice(0, 80)"
          :key="movie.id"
          :movie="movie"
          @select="selectResult"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useMovieStore } from "@/stores/movies.js";
import { addRecentSearch, clearRecentSearches, getRecentSearches, getRecentViewedIds } from "@/lib/recentActivity.js";
import SearchResultCard from "@/components/SearchResultCard.vue";
import SectionHeader from "@/components/SectionHeader.vue";

const emit = defineEmits(["selectMovie"]);

const store = useMovieStore();
const inputEl = ref(null);
const localSearch = ref(store.searchQuery);
const activityTick = ref(0);
let debounceTimer = null;

watch(localSearch, val => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    store.searchQuery = val;
    if (val.trim().length >= 2) addRecentSearch(val);
  }, 180);
});
watch(() => store.searchQuery, val => { if (val !== localSearch.value) localSearch.value = val; });

const queryActive = computed(() => store.searchQuery.trim().length >= 2);
const recentSearches = computed(() => {
  activityTick.value;
  return getRecentSearches();
});
const movieById = computed(() => {
  const map = new Map();
  for (const movie of store.allMovies) map.set(movie.id, movie);
  return map;
});
const recentViewedMovies = computed(() => {
  activityTick.value;
  return getRecentViewedIds().map(id => movieById.value.get(id)).filter(Boolean).slice(0, 6);
});

function clearSearch() {
  clearTimeout(debounceTimer);
  localSearch.value = "";
  store.searchQuery = "";
  inputEl.value?.focus();
}

function commitSearch() {
  if (store.searchQuery.trim().length >= 2) addRecentSearch(store.searchQuery);
  activityTick.value++;
}

function runRecentSearch(query) {
  clearTimeout(debounceTimer);
  localSearch.value = query;
  store.searchQuery = query;
  addRecentSearch(query);
  activityTick.value++;
  inputEl.value?.focus({ preventScroll: true });
}

function clearRecentSearchesList() {
  clearRecentSearches();
  activityTick.value++;
}

function selectResult(movie) {
  commitSearch();
  emit("selectMovie", movie);
}

function refreshRecentActivity() {
  activityTick.value++;
}

onMounted(() => {
  inputEl.value?.focus({ preventScroll: true });
  window.addEventListener("ohana:recent-activity", refreshRecentActivity);
});
onUnmounted(() => window.removeEventListener("ohana:recent-activity", refreshRecentActivity));
</script>

<style scoped>
.search-view { padding: 18px 48px 64px; max-width: 1060px; margin: 0 auto; width: 100%; }
.search-hero { display: grid; gap: 10px; }
.search-box { position: relative; display: flex; align-items: center; }
.search-icon { position: absolute; left: 18px; width: 20px; height: 20px; color: var(--muted); pointer-events: none; }
.search-box input { width: 100%; min-width: 0; padding: 17px 56px 17px 52px; border: 1px solid rgba(255,255,255,0.14); border-radius: 15px; background: rgba(8,8,16,0.94); color: var(--white); font: inherit; font-size: 17px; outline: none; }
.search-box input:focus { border-color: rgba(232,54,93,0.72); }
.search-box button { position: absolute; right: 12px; width: 32px; height: 32px; border: 1px solid rgba(255,255,255,0.14); border-radius: 50%; background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.74); font-size: 22px; cursor: pointer; }
.search-empty { margin-top: 16px; display: grid; gap: 18px; }
.recent-section { padding: 16px 0; color: var(--muted); }
.recent-section { border-top: 1px solid rgba(255,255,255,0.08); }
.recent-section h3 { color: var(--white); font-size: 16px; }
.recent-section button, .recent-chips button { border: 1px solid rgba(255,255,255,0.12); border-radius: 999px; background: rgba(255,255,255,0.05); color: rgba(240,238,232,0.72); font: inherit; font-size: 12px; min-height: 32px; padding: 0 12px; cursor: pointer; }
.recent-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
.recent-chips button:hover, .recent-section button:hover { border-color: rgba(45,212,191,0.42); color: var(--teal); }
.recent-viewed-list { display: grid; gap: 10px; }
.results-wrap { margin-top: 16px; }
.result-count { color: var(--muted); font-size: 13px; }
.results-list { display: grid; gap: 10px; }
@media (max-width: 640px) { .search-view { padding: 10px 14px 48px; } }
</style>
