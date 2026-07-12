<template>
  <button type="button" class="search-card" @click="$emit('select', movie)">
    <div class="poster">
      <img v-if="movie.p" :src="movie.p" :alt="movie.t" loading="lazy" />
      <span v-else>{{ movie.t }}</span>
    </div>

    <div class="search-card-body">
      <div class="search-card-topline">
        <span>{{ movie.s ? 'TV show' : 'Movie' }}</span>
        <span v-if="movie.y">{{ movie.y }}</span>
        <span v-if="movie.r">★ {{ movie.r.toFixed(1) }}</span>
      </div>
      <h3>{{ movie.t }}</h3>
      <p class="overview">{{ synopsis }}</p>
      <div class="chips">
        <span class="chip" :class="compatClass">{{ compatibilityLabel }}</span>
        <span v-if="providerLabel" class="chip">{{ providerLabel }}</span>
        <span v-if="listLabel" class="chip chip--list">{{ listLabel }}</span>
      </div>
    </div>
  </button>
</template>

<script setup>
import { computed } from "vue";
import { GENRES, PROVIDERS, useMovieStore } from "@/stores/movies.js";
import { useUserStore } from "@/stores/user.js";
import { MATURITY_CATEGORIES, SEVERITY_LABELS, getScore } from "@/maturity.js";

const props = defineProps({ movie: { type: Object, required: true } });
defineEmits(["select"]);

const store = useMovieStore();
const userStore = useUserStore();

const synopsis = computed(() => {
  const text = props.movie.overviewEs || props.movie.overviewEn;
  if (text) return text;
  const genres = Object.entries(GENRES)
    .filter(([, mask]) => props.movie.g & mask)
    .map(([name]) => name)
    .slice(0, 3)
    .join(" · ");
  return genres || "Open details for maturity, availability, and list actions.";
});

const activeLimits = computed(() => store.maxMaturityCat
  .map((level, i) => ({ level, category: MATURITY_CATEGORIES[i] }))
  .filter(({ level }) => level >= 0)
);

const compatibilityLabel = computed(() => {
  if (!activeLimits.value.length) return "Compatibility: not configured";
  if (props.movie.mat === undefined) return "Compatibility: unknown";
  const exceeded = activeLimits.value.find(({ level, category }) => {
    const score = getScore(props.movie.mat, category.shift);
    return (Number.isFinite(score) ? Math.round(score) : 6) > level;
  });
  if (!exceeded) return "Compatible with active limits";
  return `Exceeds ${exceeded.category.label} (${SEVERITY_LABELS[exceeded.level]})`;
});

const compatClass = computed(() => {
  if (!activeLimits.value.length || props.movie.mat === undefined) return "";
  return compatibilityLabel.value.startsWith("Compatible") ? "chip--ok" : "chip--warn";
});

const providerLabel = computed(() => {
  const names = PROVIDERS.filter(p => props.movie.prov & p.bit).map(p => p.name);
  if (!names.length) return "Availability unknown";
  return names.slice(0, 2).join(" · ") + (names.length > 2 ? ` +${names.length - 2}` : "");
});

const listLabel = computed(() => {
  if (!userStore.isLoggedIn) return "";
  const lists = userStore.lists.filter(list => list.movies.includes(props.movie.id)).map(list => list.name);
  if (userStore.isWatched(props.movie.id)) lists.unshift("Watched");
  return lists.slice(0, 2).join(" · ");
});
</script>

<style scoped>
.search-card {
  width: 100%;
  display: grid;
  grid-template-columns: 86px minmax(0, 1fr);
  gap: 14px;
  padding: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  background: rgba(15,15,26,0.78);
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, transform 0.15s;
}
.search-card:hover,
.search-card:focus-visible {
  border-color: rgba(232,54,93,0.55);
  background: rgba(22,22,31,0.92);
  outline: none;
  transform: translateY(-1px);
}
.poster {
  width: 86px;
  aspect-ratio: 2 / 3;
  border-radius: 10px;
  overflow: hidden;
  background: var(--surface3);
  display: grid;
  place-items: end start;
  padding: 8px;
  color: rgba(255,255,255,0.66);
  font-size: 12px;
}
.poster img { width: 100%; height: 100%; object-fit: cover; display: block; margin: -8px; width: calc(100% + 16px); height: calc(100% + 16px); }
.search-card-body { min-width: 0; display: flex; flex-direction: column; gap: 7px; }
.search-card-topline { display: flex; flex-wrap: wrap; gap: 8px; font-size: 12px; color: var(--muted); }
h3 { font-size: 18px; line-height: 1.1; color: var(--white); }
.overview { color: rgba(240,238,232,0.68); font-size: 13px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.chips { display: flex; flex-wrap: wrap; gap: 6px; }
.chip { padding: 4px 8px; border-radius: 99px; background: rgba(255,255,255,0.06); color: rgba(240,238,232,0.72); font-size: 11px; }
.chip--ok { background: rgba(45,212,191,0.12); color: var(--teal); }
.chip--warn { background: rgba(248,113,113,0.13); color: #fca5a5; }
.chip--list { background: rgba(245,200,66,0.12); color: var(--gold); }
@media (max-width: 640px) { .search-card { grid-template-columns: 72px minmax(0, 1fr); gap: 11px; padding: 10px; } .poster { width: 72px; } h3 { font-size: 16px; } }
</style>
