<template>
  <section v-if="rows.length" class="from-lists">
    <div class="from-lists-header">
      <div>
        <p class="eyebrow">From your lists</p>
        <h2>Start with what you already saved.</h2>
      </div>
      <div class="list-tools">
        <select v-model="selectedList" aria-label="Choose list">
          <option value="all">All lists</option>
          <option v-for="row in rows" :key="row.id" :value="row.id">{{ cleanLabel(row.label) }}</option>
        </select>
        <button type="button" @click="$emit('manage')">Manage lists</button>
      </div>
    </div>

    <MovieRow
      v-for="row in visibleRows"
      :key="row.id"
      :row="row"
      @selectMovie="$emit('selectMovie', $event)"
    />
  </section>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import MovieRow from "@/components/MovieRow.vue";

const props = defineProps({ rows: { type: Array, default: () => [] } });
defineEmits(["selectMovie", "manage"]);

const selectedList = ref("all");
watch(() => props.rows.map(r => r.id).join("|"), () => {
  if (selectedList.value !== "all" && !props.rows.some(row => row.id === selectedList.value)) selectedList.value = "all";
});

const visibleRows = computed(() => selectedList.value === "all" ? props.rows : props.rows.filter(row => row.id === selectedList.value));
function cleanLabel(label) { return label.replace(/^My list ·\s*/, ""); }
</script>

<style scoped>
.from-lists { margin-bottom: 24px; padding-top: 4px; }
.from-lists-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 18px; margin: 0 48px 10px; padding: 18px; border: 1px solid rgba(245,200,66,0.18); border-radius: 18px; background: linear-gradient(135deg, rgba(245,200,66,0.11), rgba(255,255,255,0.03)); }
.eyebrow { font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gold); font-weight: 800; }
h2 { margin-top: 2px; font-size: 20px; color: var(--white); }
.list-tools { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; justify-content: flex-end; }
select, button { min-height: 38px; border: 1px solid rgba(255,255,255,0.14); border-radius: 999px; background: rgba(8,8,16,0.66); color: var(--white); font: inherit; font-size: 13px; padding: 0 12px; }
button { cursor: pointer; color: var(--gold); }
button:hover { border-color: rgba(245,200,66,0.44); }
@media (max-width: 640px) { .from-lists-header { margin: 0 16px 8px; align-items: stretch; flex-direction: column; padding: 14px; } .list-tools { justify-content: flex-start; } select { max-width: 100%; } }
</style>
