<template>
  <nav class="app-tabs" aria-label="Primary navigation">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      class="app-tab"
      :class="{ active: activeTab === tab.id }"
      :aria-current="activeTab === tab.id ? 'page' : undefined"
      @click="$emit('select', tab.id)"
    >
      <span class="app-tab-label">{{ tab.label }}</span>
      <span class="app-tab-helper">{{ tab.helper }}</span>
    </button>
  </nav>
</template>

<script setup>
defineProps({ activeTab: { type: String, required: true } });
defineEmits(["select"]);

const tabs = [
  { id: "discover", label: "Discover", helper: "Choose tonight" },
  { id: "search", label: "Search", helper: "Find a title" },
  { id: "settings", label: "Settings", helper: "Configure once" },
];
</script>

<style scoped>
.app-tabs {
  position: sticky;
  top: 0;
  z-index: 60;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  padding: 10px 48px;
  background: rgba(8, 8, 16, 0.86);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(16px);
}

.app-tab {
  appearance: none;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 14px;
  background: rgba(255,255,255,0.035);
  color: var(--muted);
  padding: 9px 12px;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}

.app-tab:hover,
.app-tab.active {
  border-color: rgba(232,54,93,0.5);
  background: rgba(232,54,93,0.13);
  color: var(--white);
}

.app-tab-label {
  display: block;
  font-weight: 800;
  font-size: 14px;
}

.app-tab-helper {
  display: block;
  margin-top: 1px;
  font-size: 11px;
  color: rgba(240,238,232,0.54);
}

@media (max-width: 640px) {
  .app-tabs { padding: 8px 12px; gap: 6px; }
  .app-tab { padding: 8px 9px; border-radius: 12px; text-align: center; }
  .app-tab-helper { display: none; }
}
</style>
