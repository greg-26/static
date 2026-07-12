<template>
  <RouterView
    v-slot="{ Component }"
    @selectMovie="openMovie"
    @openSettings="openSettings"
    @openConfig="showConfig = true"
  >
    <div class="app" :class="{ 'app--with-tabs': activeTab }">
      <component
        :is="Component"
        @selectMovie="openMovie"
        @openSettings="openSettings"
        @openConfig="showConfig = true"
      />

      <footer class="footer" v-if="activeTab && !store.loading">
        <p><RouterLink to="/roadmap">Vision</RouterLink> · Data from <a href="https://www.imdb.com" target="_blank" rel="noopener">IMDb</a> &amp; <a href="https://www.themoviedb.org" target="_blank" rel="noopener">TMDB</a>. Not affiliated with either.</p>
      </footer>

      <AppTabs v-if="activeTab" :active-tab="activeTab" @select="goToTab" />

      <div
        v-if="pendingMovieId && !selectedMovie"
        class="movie-loading-backdrop"
        role="status"
        aria-live="polite"
        aria-label="Loading movie details"
      >
        <div class="movie-loading-card">
          <div class="movie-loading-spinner" aria-hidden="true"></div>
          <p class="movie-loading-title">Loading movie details…</p>
        </div>
      </div>

      <MovieModal
        :movie="selectedMovie"
        @close="closeMovie"
      />

      <ConfigModal
        v-if="showConfig"
        :pending-list-token="pendingListToken"
        @close="showConfig = false"
      />
    </div>
  </RouterView>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMovieStore } from "@/stores/movies.js";
import { useUserStore } from "@/stores/user.js";
import AppTabs from "@/components/AppTabs.vue";
import MovieModal from "@/components/MovieModal.vue";
import ConfigModal from "@/components/ConfigModal.vue";

const router = useRouter();
const route = useRoute();
const store = useMovieStore();
const userStore = useUserStore();

const selectedMovie = ref(null);
const pendingMovieId = ref(null);
const showConfig = ref(false);
const pendingListToken = ref(null);

const activeTab = computed(() => route.meta?.tab || null);

const movieById = computed(() => {
  const map = new Map();
  for (const movie of store.allMovies) map.set(movie.id, movie);
  return map;
});

function goToTab(tab) {
  if (route.name !== tab) router.push({ name: tab });
}

function openSettings() {
  router.push({ name: "settings" });
}

function openMovie(movie) {
  if (!movie) return;
  pendingMovieId.value = movie.id;
  selectedMovie.value = movie;
  router.push({ query: { ...route.query, movie: movie.id } });
}

function closeMovie() {
  const { movie, ...query } = route.query;
  selectedMovie.value = null;
  pendingMovieId.value = null;
  if (movie) router.replace({ query });
}

watch(() => route.name, (name) => {
  if (name !== "search") store.searchQuery = "";
});

watch([() => route.query.movie, movieById], ([movieId]) => {
  if (!movieId) {
    selectedMovie.value = null;
    pendingMovieId.value = null;
    return;
  }

  const id = Array.isArray(movieId) ? movieId[0] : movieId;
  pendingMovieId.value = id;
  const movie = movieById.value.get(id);
  if (movie) selectedMovie.value = movie;
}, { immediate: true });

// ── Filter persistence ────────────────────────────────────────────────────────
watch(() => userStore.isLoggedIn, (loggedIn) => {
  if (!loggedIn) return;
  const prefs = userStore.userData?.filterPrefs;
  if (!prefs) return;
  if (Array.isArray(prefs.maxMaturityCat)) {
    store.setMaxMaturityCats(prefs.maxMaturityCat);
  }
  if (prefs.selectedProviders !== undefined) {
    store.selectedProviders = prefs.selectedProviders;
  }
  if (["both", "movies", "tv"].includes(prefs.titleType)) {
    store.titleType = prefs.titleType;
  }
}, { immediate: true });

let filterSaveTimer = null;
watch([() => [...store.maxMaturityCat], () => store.selectedProviders, () => store.titleType], () => {
  if (!userStore.isLoggedIn) return;
  clearTimeout(filterSaveTimer);
  filterSaveTimer = setTimeout(() => {
    userStore.saveFilterPrefs({
      maxMaturityCat: [...store.maxMaturityCat],
      selectedProviders: store.selectedProviders,
      titleType: store.titleType,
    });
  }, 800);
}, { deep: true });

onMounted(async () => {
  const addToken = route.query.add;

  await store.loadMovies();
  await userStore.init();

  if (addToken) {
    const token = Array.isArray(addToken) ? addToken[0] : addToken;
    if (userStore.isLoggedIn) {
      try { await userStore.addListByToken(token); }
      catch (e) { console.warn("Could not add shared list:", e.message); }
    } else {
      pendingListToken.value = token;
      showConfig.value = true;
    }

    const { add, ...query } = route.query;
    router.replace({ query });
  }
});
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app--with-tabs {
  padding-bottom: calc(76px + env(safe-area-inset-bottom));
}

.movie-loading-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(8, 8, 16, 0.72);
  backdrop-filter: blur(6px);
}

.movie-loading-card {
  width: min(260px, 100%);
  padding: 24px;
  border-radius: var(--radius-lg);
  background: var(--surface);
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
}

.movie-loading-spinner {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 3px solid var(--surface3);
  border-top-color: var(--accent);
  animation: spin 0.8s linear infinite;
}

.movie-loading-title {
  color: var(--muted);
  font-size: 14px;
}

@keyframes spin { to { transform: rotate(360deg); } }

.footer {
  padding: 24px 48px;
  border-top: 1px solid var(--border);
  text-align: center;
  font-size: 12px;
  color: var(--muted);
}

.footer a {
  color: var(--muted);
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.15s;
}
.footer a:hover { color: var(--white); }

@media (max-width: 640px) {
  .footer { padding: 24px 16px; }
}
</style>
