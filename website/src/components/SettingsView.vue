<template>
  <section class="settings-view">
    <div class="settings-head">
      <p class="eyebrow">Settings</p>
      <h1>Configure once, use everywhere.</h1>
      <p>Permanent preferences live here. Discover stays focused on the current viewing moment.</p>
    </div>

    <div class="settings-grid">
      <article class="settings-card settings-card--primary">
        <div>
          <p class="section-label">Profile</p>
          <h2>{{ userStore.isLoggedIn ? (userStore.userData?.name || 'Your profile') : 'No profile yet' }}</h2>
          <p>{{ userStore.isLoggedIn ? 'Recovery token configured.' : 'Create or restore a lightweight profile to save lists and viewing preferences.' }}</p>
        </div>
        <button type="button" @click="$emit('openConfig')">{{ userStore.isLoggedIn ? 'Manage profile' : 'Create / restore' }}</button>
      </article>

      <article class="settings-card">
        <p class="section-label">Streaming services</p>
        <h2>{{ selectedProviderSummary }}</h2>
        <p>These should become permanent service subscriptions; today they still use the existing provider filter model.</p>
        <button type="button" @click="$emit('openConfig')">Configure services</button>
      </article>

      <article class="settings-card">
        <p class="section-label">Maturity profiles</p>
        <h2>{{ maturitySummary }}</h2>
        <p>Current limits act as the first active profile until full Me / Family / Kids profiles are migrated.</p>
        <button type="button" @click="$emit('openConfig')">Edit maturity limits</button>
      </article>

      <article class="settings-card">
        <p class="section-label">My Lists</p>
        <h2>{{ userStore.lists.length }} {{ userStore.lists.length === 1 ? 'list' : 'lists' }}</h2>
        <p>Lists are managed here and consumed from Discover’s “From your lists” section.</p>
        <button type="button" @click="$emit('openConfig')">Manage lists</button>
      </article>

      <article class="settings-card settings-card--muted">
        <p class="section-label">General</p>
        <h2>About Ohana</h2>
        <p>Ohana helps people choose what to watch by combining interest, appropriateness, and availability.</p>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useMovieStore } from "@/stores/movies.js";
import { useUserStore } from "@/stores/user.js";
import { MATURITY_CATEGORIES, SEVERITY_LABELS } from "@/maturity.js";

defineEmits(["openConfig"]);

const movieStore = useMovieStore();
const userStore = useUserStore();

const selectedProviderSummary = computed(() => {
  const selected = movieStore.availableProviders.filter(p => movieStore.selectedProviders & p.bit).map(p => p.name);
  if (!selected.length) return "Any service";
  if (selected.length <= 3) return selected.join(" • ");
  return `${selected.slice(0, 3).join(" • ")} +${selected.length - 3}`;
});

const maturitySummary = computed(() => {
  const active = movieStore.maxMaturityCat
    .map((level, i) => ({ level, category: MATURITY_CATEGORIES[i] }))
    .filter(({ level }) => level >= 0);
  if (!active.length) return "No active limits";
  if (active.length === 1) return `${active[0].category.label} ≤ ${SEVERITY_LABELS[active[0].level]}`;
  return `${active.length} active limits`;
});
</script>

<style scoped>
.settings-view { padding: 36px 48px 64px; max-width: 1120px; margin: 0 auto; width: 100%; }
.settings-head { margin-bottom: 22px; }
.eyebrow, .section-label { font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--teal); font-weight: 800; }
h1 { margin-top: 4px; font-family: var(--font-display); font-size: clamp(40px, 7vw, 70px); line-height: 0.96; letter-spacing: 0.04em; }
.settings-head > p:not(.eyebrow) { max-width: 640px; margin-top: 8px; color: rgba(240,238,232,0.68); }
.settings-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.settings-card { min-height: 190px; display: flex; flex-direction: column; justify-content: space-between; gap: 18px; padding: 20px; border: 1px solid rgba(255,255,255,0.09); border-radius: 20px; background: rgba(15,15,26,0.82); }
.settings-card--primary { grid-column: 1 / -1; background: radial-gradient(circle at 15% 0%, rgba(232,54,93,0.2), transparent 36%), rgba(15,15,26,0.86); }
.settings-card--muted { opacity: 0.82; }
h2 { margin-top: 5px; color: var(--white); font-size: 22px; }
.settings-card p:not(.section-label) { color: rgba(240,238,232,0.66); }
button { align-self: flex-start; min-height: 38px; border: 1px solid rgba(255,255,255,0.14); border-radius: 999px; background: rgba(255,255,255,0.05); color: var(--white); font: inherit; font-size: 13px; padding: 0 14px; cursor: pointer; }
button:hover { border-color: rgba(232,54,93,0.54); color: var(--accent); }
@media (max-width: 720px) { .settings-view { padding: 20px 14px 48px; } .settings-grid { grid-template-columns: 1fr; } .settings-card--primary { grid-column: auto; } }
</style>
