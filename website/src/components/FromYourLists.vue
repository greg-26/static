<template>
  <section v-if="rows.length" class="from-lists" aria-label="From your lists">
    <MovieRow
      v-for="row in visibleRows"
      :key="row.id"
      :row="row"
      @selectMovie="$emit('selectMovie', $event)"
    >
      <template #label-actions>
        <FilterMenu
          :open="listMenuOpen"
          :active="selectedList !== 'all'"
          menu-class="filter-menu--picker"
          button-class="list-selector-chip"
          @toggle="toggleListMenu"
          @close="closeListMenu"
        >
          <template #label>
            <span class="selector-label">
              <span>{{ selectedListLabel }}</span>
              <span class="selector-chevron" aria-hidden="true">⌄</span>
            </span>
          </template>
          <div class="list-menu-options" role="none">
            <button
              class="list-menu-option"
              :class="{ active: selectedList === 'all' }"
              type="button"
              role="menuitemradio"
              :aria-checked="selectedList === 'all'"
              @click="selectList('all')"
            >
              <span class="list-menu-label">All lists</span>
              <span class="list-menu-previews" aria-hidden="true">
                <span
                  v-for="movie in allListPreview"
                  :key="movie.id"
                  class="list-menu-preview"
                  :title="movie.t"
                >
                  <img v-if="movie.p" :src="movie.p" :alt="movie.t" loading="lazy" />
                  <span v-else class="list-menu-preview-fallback">{{ movieInitial(movie) }}</span>
                </span>
              </span>
            </button>
            <button
              v-for="optionRow in rows"
              :key="optionRow.id"
              class="list-menu-option"
              :class="{ active: selectedList === optionRow.id }"
              type="button"
              role="menuitemradio"
              :aria-checked="selectedList === optionRow.id"
              @click="selectList(optionRow.id)"
            >
              <span class="list-menu-label">{{ cleanLabel(optionRow.label) }}</span>
              <span class="list-menu-previews" aria-hidden="true">
                <span
                  v-for="movie in previewMovies(optionRow)"
                  :key="movie.id"
                  class="list-menu-preview"
                  :title="movie.t"
                >
                  <img v-if="movie.p" :src="movie.p" :alt="movie.t" loading="lazy" />
                  <span v-else class="list-menu-preview-fallback">{{ movieInitial(movie) }}</span>
                </span>
              </span>
            </button>
            <button
              class="list-menu-option list-menu-option--manage"
              type="button"
              role="menuitem"
              @click="manageLists"
            >
              <span class="list-menu-label">Manage lists</span>
              <span class="list-menu-action-icon" aria-hidden="true">›</span>
            </button>
          </div>
        </FilterMenu>
      </template>
      <template #actions="{ row: visibleRow }">
        <div v-if="visibleRow.seeAllTo" class="list-tools">
          <UiChip :to="visibleRow.seeAllTo" size="sm" tone="safe">See all</UiChip>
        </div>
      </template>
    </MovieRow>
  </section>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import FilterMenu from "@/components/FilterMenu.vue";
import MovieRow from "@/components/MovieRow.vue";
import UiChip from "@/components/UiChip.vue";

const props = defineProps({
  rows: { type: Array, default: () => [] },
  activeMenu: { type: String, default: null },
});
const emit = defineEmits(["selectMovie", "manage", "set-active-menu"]);

const PREVIEW_LIMIT = 24;
const MENU_PREVIEW_LIMIT = 3;
const selectedList = ref("all");
const listMenuOpen = ref(false);
const LIST_MENU_ID = "from-lists:chooser";

watch(() => props.rows.map(r => r.id).join("|"), () => {
  if (selectedList.value !== "all" && !props.rows.some(row => row.id === selectedList.value)) selectedList.value = "all";
});

watch(() => props.activeMenu, menu => {
  if (menu !== LIST_MENU_ID) listMenuOpen.value = false;
});

const selectedListLabel = computed(() => {
  if (selectedList.value === "all") return "All lists";
  const row = props.rows.find(candidate => candidate.id === selectedList.value);
  return row ? cleanLabel(row.label) : "All lists";
});

const allListPreview = computed(() => {
  const seen = new Set();
  const movies = [];
  for (const row of props.rows) {
    for (const movie of previewMovies(row, MENU_PREVIEW_LIMIT)) {
      if (seen.has(movie.id)) continue;
      seen.add(movie.id);
      movies.push(movie);
      if (movies.length >= MENU_PREVIEW_LIMIT) return movies;
    }
  }
  return movies;
});

function toggleListMenu() {
  listMenuOpen.value = !listMenuOpen.value;
  emit("set-active-menu", listMenuOpen.value ? LIST_MENU_ID : null);
}

function closeListMenu() {
  if (!listMenuOpen.value) return;
  listMenuOpen.value = false;
  emit("set-active-menu", null);
}

function selectList(id) {
  selectedList.value = id;
  closeListMenu();
}

function manageLists() {
  closeListMenu();
  emit("manage");
}

function previewMovies(row, limit = MENU_PREVIEW_LIMIT) {
  return (row.movies ?? []).slice(0, limit);
}

function movieInitial(movie) {
  return (movie.t ?? "?").trim().charAt(0).toUpperCase() || "?";
}

const visibleRows = computed(() => {
  if (selectedList.value !== "all") {
    const row = props.rows.find(candidate => candidate.id === selectedList.value);
    return row ? [{ ...row, label: "From your lists", movies: row.movies.slice(0, PREVIEW_LIMIT), seeAllTo: row.seeAllTo }] : [];
  }

  const seen = new Set();
  const movies = [];
  for (const row of props.rows) {
    for (const movie of row.movies) {
      if (seen.has(movie.id)) continue;
      seen.add(movie.id);
      movies.push(movie);
      if (movies.length >= PREVIEW_LIMIT) break;
    }
    if (movies.length >= PREVIEW_LIMIT) break;
  }
  return movies.length ? [{ id: "all-lists", label: "From your lists", movies }] : [];
});
function cleanLabel(label) { return label.replace(/^My list ·\s*/, ""); }
</script>

<style scoped>
.from-lists { margin-bottom: 6px; padding-top: 2px; }
.list-tools {
  min-width: 0;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
}
.selector-label {
  min-width: 0;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.selector-chevron { font-size: 11px; opacity: 0.75; }
:deep(.list-selector-chip) {
  min-height: 24px;
  padding: 0 8px;
  border-color: transparent;
  background: transparent;
  color: rgba(240,238,232,0.58);
  font-size: 12px;
  font-weight: 600;
}
:deep(.list-selector-chip:hover),
:deep(.list-selector-chip:focus-visible),
:deep(.list-selector-chip.is-active) {
  border-color: rgba(255,255,255,0.2);
  background: rgba(255,255,255,0.07);
  color: var(--white);
}
.list-menu-options { display: grid; gap: 8px; min-width: 190px; max-width: min(286px, calc(100vw - 56px)); }
.list-menu-option {
  min-height: 36px;
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 11px;
  background: rgba(30,30,42,0.86);
  color: rgba(255,255,255,0.78);
  font: inherit;
  font-size: 12px;
  line-height: 1.2;
  text-align: left;
  overflow: hidden;
  cursor: pointer;
  padding: 6px 8px 6px 10px;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.list-menu-option:hover,
.list-menu-option:focus-visible {
  border-color: rgba(45,212,191,0.36);
  color: var(--white);
  outline: none;
}
.list-menu-option.active {
  border-color: rgba(45,212,191,0.42);
  background: rgba(45,212,191,0.12);
  color: var(--teal);
}
.list-menu-option--manage {
  margin-top: 2px;
  border-color: rgba(255,255,255,0.1);
  background: transparent;
  color: rgba(240,238,232,0.68);
}
.list-menu-option--manage:hover,
.list-menu-option--manage:focus-visible {
  border-color: rgba(255,255,255,0.2);
  background: rgba(255,255,255,0.06);
  color: var(--white);
}
.list-menu-label {
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.list-menu-previews {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  width: 58px;
  height: 28px;
}
.list-menu-preview {
  width: 18px;
  height: 27px;
  flex: 0 0 18px;
  border-radius: 4px;
  overflow: hidden;
  background: rgba(255,255,255,0.08);
  box-shadow: 0 0 0 1px rgba(255,255,255,0.1), 0 3px 8px rgba(0,0,0,0.28);
}
.list-menu-preview + .list-menu-preview { margin-left: -5px; }
.list-menu-action-icon {
  color: rgba(255,255,255,0.4);
  font-size: 16px;
  line-height: 1;
}
.list-menu-preview img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}
.list-menu-preview-fallback {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  color: rgba(255,255,255,0.48);
  font-size: 10px;
  font-weight: 700;
}
.list-tools :deep(.ui-chip) { flex: 0 0 auto; }
@media (max-width: 640px) {
  .from-lists { margin-bottom: 2px; }
  .list-tools {
    justify-content: flex-start;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .list-tools::-webkit-scrollbar { display: none; }
  :deep(.list-selector-chip) { max-width: min(180px, calc(100vw - 190px)); }
}
</style>
