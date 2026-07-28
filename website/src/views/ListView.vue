<template>
  <main class="list-page">
    <template v-if="store.loading || userStore.loading">
      <div class="list-header list-header--loading">
        <div class="title-skeleton"></div>
        <div class="meta-skeleton"></div>
      </div>
      <div class="poster-grid" aria-label="Loading list">
        <div v-for="n in 12" :key="n" class="poster-skeleton"></div>
      </div>
    </template>

    <template v-else-if="list">
      <header class="list-header" @keydown.escape.stop="closeListMenu">
        <div class="list-header__copy">
          <p class="eyebrow">Saved list</p>
          <h1>{{ list.name }}</h1>
          <p class="summary">{{ movies.length }} available {{ movies.length === 1 ? "title" : "titles" }}</p>
        </div>
        <div v-if="userStore.isLoggedIn" class="list-header__actions" @click.stop @keydown.stop>
          <button
            type="button"
            class="list-menu-button"
            aria-haspopup="menu"
            :aria-expanded="listMenuOpen"
            :aria-label="`Manage ${list.name}`"
            @click="toggleListMenu"
          >⋯</button>
          <div v-if="listMenuOpen" class="list-menu" role="menu">
            <button type="button" role="menuitem" @click="renameListFromMenu">Rename</button>
            <button type="button" role="menuitem" @click="copyListShareLink">{{ copied ? "Copied" : "Copy link" }}</button>
            <button type="button" role="menuitem" class="danger" @click="removeListFromMenu">Remove</button>
          </div>
        </div>
      </header>

      <div v-if="movies.length" class="poster-grid" :aria-label="list.name">
        <MovieCard
          v-for="movie in movies"
          :key="movie.id"
          :movie="movie"
          @select="$emit('selectMovie', $event)"
        />
      </div>

      <section v-else class="empty-state">
        <p class="empty-title">No available titles in this list</p>
        <p class="empty-copy">Some saved items may no longer be in the current catalog.</p>
        <UiChip to="/settings/lists" size="sm" tone="safe">Manage lists</UiChip>
      </section>
    </template>

    <section v-else class="empty-state">
      <p class="empty-title">{{ missingListTitle }}</p>
      <p class="empty-copy">{{ missingListCopy }}</p>
      <div class="empty-actions">
        <UiChip to="/discover" size="sm">Back to Discover</UiChip>
        <UiChip :to="missingListActionTo" size="sm" tone="safe">{{ missingListActionLabel }}</UiChip>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMovieStore } from "@/stores/movies.js";
import { useUserStore } from "@/stores/user.js";
import MovieCard from "@/components/MovieCard.vue";
import UiChip from "@/components/UiChip.vue";

defineEmits(["selectMovie"]);

const route = useRoute();
const router = useRouter();
const store = useMovieStore();
const userStore = useUserStore();
const listMenuOpen = ref(false);
const copied = ref(false);

const movieById = computed(() => {
  const map = new Map();
  for (const movie of store.allMovies) map.set(movie.id, movie);
  return map;
});

const listId = computed(() => {
  const id = route.params.listId;
  return Array.isArray(id) ? id[0] : id;
});

const list = computed(() => userStore.lists.find(candidate => candidate.token === listId.value) || null);

const missingListTitle = computed(() => userStore.isLoggedIn ? "List not in this profile" : "Profile needed");
const missingListCopy = computed(() => {
  if (!userStore.isLoggedIn) return "Lists are attached to profiles. Create or restore a profile to open saved or shared lists.";
  const profileName = userStore.userData?.name || "this profile";
  return `This list is not attached to ${profileName}. Switch profiles, or import a shared-list link in Settings.`;
});
const missingListActionTo = computed(() => userStore.isLoggedIn ? "/settings/lists" : "/settings/profile");
const missingListActionLabel = computed(() => userStore.isLoggedIn ? "Manage lists" : "Go to Profile");

const movies = computed(() => {
  if (!list.value) return [];
  return list.value.movies.map(id => movieById.value.get(id)).filter(Boolean);
});

watch(listId, () => {
  closeListMenu();
  copied.value = false;
});

function toggleListMenu() {
  listMenuOpen.value = !listMenuOpen.value;
}

function closeListMenu() {
  listMenuOpen.value = false;
}

async function renameListFromMenu() {
  const currentList = list.value;
  if (!currentList) return;
  closeListMenu();
  const nextName = window.prompt("Rename list", currentList.name)?.trim();
  if (!nextName || nextName === currentList.name) return;
  await userStore.renameList(currentList.token, nextName);
}

async function copyListShareLink() {
  const currentList = list.value;
  if (!currentList) return;
  const url = userStore.getShareUrl(currentList.token);
  try {
    await navigator.clipboard.writeText(url);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 1000);
  } catch (e) {
    window.prompt("Copy share link", url);
    console.warn("Could not copy list share link", e);
  }
}

async function removeListFromMenu() {
  const currentList = list.value;
  if (!currentList) return;
  closeListMenu();
  await userStore.removeList(currentList.token);
  router.push({ path: "/settings/lists" });
}
</script>

<style scoped>
.list-page {
  flex: 1;
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  padding: 24px 48px 64px;
}

.list-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  position: relative;
  margin-bottom: 20px;
}

.list-header__copy { min-width: 0; }
.list-header__actions { position: relative; flex: 0 0 auto; }

.list-menu-button,
.list-menu button {
  min-height: 38px;
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 999px;
  background: rgba(255,255,255,0.05);
  color: var(--white);
  font: inherit;
  font-size: 13px;
  padding: 0 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
}

.list-menu-button:hover,
.list-menu-button:focus-visible,
.list-menu button:hover,
.list-menu button:focus-visible {
  border-color: rgba(107,226,214,0.45);
  color: var(--teal);
  outline: none;
}

.list-menu-button {
  width: 38px;
  min-width: 38px;
  justify-content: center;
  padding: 0;
  font-size: 20px;
  line-height: 1;
}

.list-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 20;
  display: grid;
  gap: 6px;
  min-width: 144px;
  padding: 8px;
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 14px;
  background: rgba(15,15,26,0.98);
  box-shadow: 0 18px 48px rgba(0,0,0,0.36);
}

.list-menu button {
  width: 100%;
  justify-content: flex-start;
  border-color: transparent;
  background: transparent;
}

.list-menu button:hover,
.list-menu button:focus-visible { background: rgba(255,255,255,0.08); }
.danger:hover { border-color: rgba(248,113,113,0.45); color: #fca5a5; }

.eyebrow {
  margin-bottom: 6px;
  color: var(--muted);
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(28px, 5vw, 44px);
  letter-spacing: 0.04em;
}

.summary {
  margin-top: 8px;
  color: var(--muted);
  font-size: 15px;
}

.poster-grid {
  --grid-card-w: var(--card-w);
  display: grid;
  grid-template-columns: repeat(auto-fill, var(--grid-card-w));
  gap: 22px var(--gap);
  align-items: start;
  justify-content: start;
}

.poster-grid :deep(.card) {
  width: 100%;
  max-width: var(--card-w);
}

.poster-grid :deep(.card-poster) {
  width: 100%;
  height: auto;
  aspect-ratio: 2 / 3;
}

.empty-state {
  min-height: 42vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
  color: var(--muted);
}

.empty-title {
  color: var(--white);
  font-size: 20px;
  font-weight: 650;
}

.empty-copy { max-width: 320px; }
.empty-actions { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; }

.title-skeleton,
.meta-skeleton,
.poster-skeleton {
  background: var(--surface2);
  border-radius: var(--radius);
  animation: pulse 1.8s ease-in-out infinite;
}

.title-skeleton { width: min(360px, 70vw); height: 42px; margin-bottom: 10px; }
.meta-skeleton { width: 140px; height: 18px; }
.poster-skeleton { height: var(--card-h); }

@keyframes pulse {
  0%, 100% { opacity: 0.35; }
  50% { opacity: 0.6; }
}

@media (max-width: 640px) {
  .list-page { padding: 18px 16px 44px; }
  .list-header { gap: 12px; margin-bottom: 16px; }
  .poster-grid {
    --grid-card-w: 132px;
    gap: 18px 10px;
  }
  .poster-grid :deep(.card:hover),
  .poster-grid :deep(.card:focus-visible) { transform: none; }
}
</style>
