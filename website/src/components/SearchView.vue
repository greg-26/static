<template>
  <section class="search-view">
    <div class="search-hero">
      <p class="eyebrow">Search</p>
      <h1>Find a specific title.</h1>
      <p>Search ignores Discover filters, then annotates each result with suitability, availability, and list status.</p>
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
        />
        <button v-if="localSearch" type="button" aria-label="Clear search" @click="clearSearch">×</button>
      </div>
    </div>

    <div v-if="!queryActive" class="search-empty">
      <h2>What do you have in mind?</h2>
      <p>Try a title, alternate Spanish title, collection name, actor, or director. Collections and people are still future work; title retrieval is ready now.</p>
    </div>

    <div v-else class="results-wrap">
      <div class="results-header">
        <h2>Results for “{{ store.searchQuery }}”</h2>
        <span>{{ store.filteredMovies.length }} titles</span>
      </div>
      <div class="results-list">
        <SearchResultCard
          v-for="movie in store.filteredMovies.slice(0, 80)"
          :key="movie.id"
          :movie="movie"
          @select="$emit('selectMovie', $event)"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useMovieStore } from "@/stores/movies.js";
import SearchResultCard from "@/components/SearchResultCard.vue";

defineEmits(["selectMovie"]);

const store = useMovieStore();
const inputEl = ref(null);
const localSearch = ref(store.searchQuery);
let debounceTimer = null;

watch(localSearch, val => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => { store.searchQuery = val; }, 100);
});
watch(() => store.searchQuery, val => { if (val !== localSearch.value) localSearch.value = val; });

const queryActive = computed(() => store.searchQuery.trim().length >= 2);

function clearSearch() {
  clearTimeout(debounceTimer);
  localSearch.value = "";
  store.searchQuery = "";
  inputEl.value?.focus();
}

onMounted(() => inputEl.value?.focus({ preventScroll: true }));
</script>

<style scoped>
.search-view { padding: 36px 48px 64px; max-width: 1060px; margin: 0 auto; width: 100%; }
.search-hero { padding: 26px; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; background: radial-gradient(circle at 15% 0%, rgba(232,54,93,0.22), transparent 34%), rgba(15,15,26,0.82); }
.eyebrow { font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--teal); font-weight: 800; }
h1 { margin-top: 4px; font-family: var(--font-display); font-size: clamp(40px, 7vw, 70px); line-height: 0.96; letter-spacing: 0.04em; }
.search-hero p:not(.eyebrow) { max-width: 650px; margin-top: 8px; color: rgba(240,238,232,0.68); }
.search-box { position: relative; margin-top: 22px; display: flex; align-items: center; }
.search-icon { position: absolute; left: 18px; width: 20px; height: 20px; color: var(--muted); pointer-events: none; }
.search-box input { width: 100%; min-width: 0; padding: 17px 56px 17px 52px; border: 1px solid rgba(255,255,255,0.14); border-radius: 15px; background: rgba(8,8,16,0.94); color: var(--white); font: inherit; font-size: 17px; outline: none; }
.search-box input:focus { border-color: rgba(232,54,93,0.72); }
.search-box button { position: absolute; right: 12px; width: 32px; height: 32px; border: 1px solid rgba(255,255,255,0.14); border-radius: 50%; background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.74); font-size: 22px; cursor: pointer; }
.search-empty { margin-top: 22px; padding: 22px; border: 1px dashed rgba(255,255,255,0.12); border-radius: 18px; color: var(--muted); }
.search-empty h2, .results-header h2 { color: var(--white); font-size: 20px; }
.results-wrap { margin-top: 26px; }
.results-header { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin-bottom: 12px; }
.results-header span { color: var(--muted); font-size: 13px; }
.results-list { display: grid; gap: 10px; }
@media (max-width: 640px) { .search-view { padding: 18px 14px 48px; } .search-hero { padding: 18px; border-radius: 18px; } .results-header { align-items: flex-start; flex-direction: column; gap: 2px; } }
</style>
