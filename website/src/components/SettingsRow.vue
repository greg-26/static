<template>
  <RouterLink class="settings-row" :to="to">
    <span class="settings-row-icon" aria-hidden="true">{{ icon }}</span>
    <span class="settings-row-main">
      <span class="settings-row-label">{{ label }}</span>
      <strong>{{ title }}</strong>
      <small>{{ summary }}</small>
    </span>
    <span class="settings-row-chevron" aria-hidden="true">›</span>
  </RouterLink>
</template>

<script setup>
defineProps({
  to: { type: String, required: true },
  icon: { type: String, default: "" },
  label: { type: String, required: true },
  title: { type: String, required: true },
  summary: { type: String, required: true },
});
</script>

<style scoped>
.settings-row {
  min-width: 0;
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  padding: 13px 0;
  color: inherit;
  text-decoration: none;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.settings-row:hover .settings-row-chevron,
.settings-row:focus-visible .settings-row-chevron {
  color: var(--accent);
  transform: translateX(2px);
}

.settings-row:focus-visible {
  outline: 2px solid rgba(232,54,93,0.6);
  outline-offset: 4px;
  border-radius: 10px;
}

.settings-row-icon {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: rgba(255,255,255,0.055);
  color: rgba(240,238,232,0.78);
  font-size: 18px;
}

.settings-row-main {
  min-width: 0;
  display: grid;
  gap: 2px;
}

.settings-row-label {
  font-size: 10px;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  color: var(--teal);
  font-weight: 800;
}

.settings-row strong {
  min-width: 0;
  color: var(--white);
  font-size: 16px;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.settings-row small {
  min-width: 0;
  color: rgba(240,238,232,0.58);
  font-size: 13px;
  line-height: 1.25;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.settings-row-chevron {
  color: rgba(240,238,232,0.42);
  font-size: 28px;
  line-height: 1;
  transition: transform 0.15s, color 0.15s;
}
</style>
