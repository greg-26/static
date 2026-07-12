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
      <span class="app-tab-icon" aria-hidden="true">{{ tab.icon }}</span>
      <span class="app-tab-label">{{ tab.label }}</span>
    </button>
  </nav>
</template>

<script setup>
defineProps({ activeTab: { type: String, required: true } });
defineEmits(["select"]);

const tabs = [
  { id: "discover", label: "Discover", icon: "⌂" },
  { id: "search", label: "Search", icon: "⌕" },
  { id: "settings", label: "Settings", icon: "⚙" },
];
</script>

<style scoped>
.app-tabs {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 70;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  padding: 7px max(12px, env(safe-area-inset-left)) calc(7px + env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-right));
  background: rgba(8, 8, 16, 0.82);
  border-top: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 -18px 50px rgba(0,0,0,0.34);
  backdrop-filter: blur(20px) saturate(1.25);
  -webkit-backdrop-filter: blur(20px) saturate(1.25);
}

.app-tab {
  appearance: none;
  min-width: 0;
  min-height: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  border: 0;
  border-radius: 14px;
  background: transparent;
  color: rgba(240,238,232,0.52);
  font: inherit;
  text-align: center;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.15s, color 0.15s, transform 0.15s;
}

.app-tab:hover,
.app-tab:focus-visible {
  background: rgba(255,255,255,0.05);
  color: rgba(240,238,232,0.78);
  outline: none;
}

.app-tab.active {
  color: var(--accent);
}

.app-tab.active .app-tab-icon {
  background: rgba(232,54,93,0.14);
  box-shadow: inset 0 0 0 1px rgba(232,54,93,0.24);
}

.app-tab:active {
  transform: scale(0.96);
}

.app-tab-icon {
  width: 30px;
  height: 24px;
  display: inline-grid;
  place-items: center;
  border-radius: 999px;
  font-size: 20px;
  line-height: 1;
}

.app-tab-label {
  display: block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 800;
  font-size: 11px;
  line-height: 1.15;
}

@media (min-width: 800px) {
  .app-tabs {
    left: 50%;
    right: auto;
    bottom: 18px;
    width: min(420px, calc(100vw - 32px));
    transform: translateX(-50%);
    padding: 8px;
    border: 1px solid rgba(255,255,255,0.11);
    border-radius: 24px;
  }
}
</style>
