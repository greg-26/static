<template>
  <section v-if="rows.length" class="from-lists" aria-label="From your lists">
    <MovieRow
      v-for="row in visibleRows"
      :key="row.id"
      :row="row"
      @selectMovie="$emit('selectMovie', $event)"
    >
      <template #actions="{ row: visibleRow }">
        <div class="list-tools">
          <select v-model="selectedList" aria-label="Choose list">
            <option value="all">All lists</option>
            <option v-for="optionRow in rows" :key="optionRow.id" :value="optionRow.id">{{ cleanLabel(optionRow.label) }}</option>
          </select>
          <UiChip v-if="visibleRow.seeAllTo" :to="visibleRow.seeAllTo" size="sm" tone="safe">See all</UiChip>
          <UiChip size="sm" tone="safe" @click="$emit('manage')">Manage lists</UiChip>
        </div>
      </template>
    </MovieRow>
  </section>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import MovieRow from "@/components/MovieRow.vue";
import UiChip from "@/components/UiChip.vue";

const props = defineProps({ rows: { type: Array, default: () => [] } });
defineEmits(["selectMovie", "manage"]);

const PREVIEW_LIMIT = 24;
const selectedList = ref("all");

watch(() => props.rows.map(r => r.id).join("|"), () => {
  if (selectedList.value !== "all" && !props.rows.some(row => row.id === selectedList.value)) selectedList.value = "all";
});

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
select {
  flex: 0 0 auto;
  min-height: 32px;
  max-width: 100%;
  min-width: 126px;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 999px;
  background: rgba(8,8,16,0.5);
  color: var(--white);
  font: inherit;
  font-size: 12px;
  padding: 0 11px;
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
  select { min-width: 112px; }
}
</style>
