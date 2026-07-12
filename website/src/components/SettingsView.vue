<template>
  <section class="settings-view">
    <RouterLink v-if="activeSection" class="back-link" to="/settings">← Settings</RouterLink>

    <div class="settings-head">
      <p class="eyebrow">Settings</p>
      <h1>{{ pageTitle }}</h1>
      <p>{{ pageIntro }}</p>
    </div>

    <div v-if="!activeSection" class="settings-grid">
      <RouterLink class="settings-card settings-card--primary" to="/settings/profile">
        <div>
          <p class="section-label">Profile</p>
          <h2>{{ userStore.isLoggedIn ? (userStore.userData?.name || 'Your profile') : 'No profile yet' }}</h2>
          <p>{{ userStore.isLoggedIn ? 'Recovery token configured.' : 'Create or restore a lightweight profile to save lists and viewing preferences.' }}</p>
        </div>
        <span class="card-action">Open profile</span>
      </RouterLink>

      <RouterLink class="settings-card settings-card--wide" to="/settings/streaming">
        <p class="section-label">Streaming services</p>
        <h2>{{ selectedProviderSummary }}</h2>
        <p>Pick the services you normally have. Discover uses these as “Included with my services”.</p>
        <span class="card-action">Manage services</span>
      </RouterLink>

      <RouterLink class="settings-card" to="/settings/maturity">
        <p class="section-label">Maturity profiles</p>
        <h2>{{ maturitySummary }}</h2>
        <p>Choose active presets now; full editable profiles can build on this route without touching Discover.</p>
        <span class="card-action">Manage profiles</span>
      </RouterLink>

      <RouterLink class="settings-card" to="/settings/lists">
        <p class="section-label">My Lists</p>
        <h2>{{ userStore.lists.length }} {{ userStore.lists.length === 1 ? 'list' : 'lists' }}</h2>
        <p>Lists are managed here and consumed from Discover’s “From your lists” section.</p>
        <span class="card-action">Manage lists</span>
      </RouterLink>

      <RouterLink class="settings-card settings-card--muted" to="/settings/about">
        <p class="section-label">General</p>
        <h2>About Ohana</h2>
        <p>Ohana helps people choose what to watch by combining interest, appropriateness, and availability.</p>
        <span class="card-action">Read more</span>
      </RouterLink>
    </div>

    <div v-else class="section-panel">
      <template v-if="activeSection === 'profile'">
        <article class="settings-card settings-card--primary">
          <p class="section-label">Profile</p>
          <h2>{{ userStore.isLoggedIn ? (userStore.userData?.name || 'Your profile') : 'No profile yet' }}</h2>
          <p>{{ userStore.isLoggedIn ? `Recovery token: ${userStore.userToken}` : 'Create or restore a profile to sync lists, watched titles, services, and limits.' }}</p>
          <button type="button" @click="$emit('openConfig')">{{ userStore.isLoggedIn ? 'Manage legacy profile tools' : 'Create / restore profile' }}</button>
        </article>
      </template>

      <template v-else-if="activeSection === 'streaming'">
        <article class="settings-card settings-card--wide">
          <p class="section-label">Streaming services</p>
          <h2>{{ selectedProviderSummary }}</h2>
          <p>These are permanent subscriptions. Discover can temporarily switch to “Any availability” without deleting them.</p>
          <div class="provider-grid" aria-label="Streaming services">
            <button
              v-for="provider in movieStore.availableProviders"
              :key="provider.id"
              type="button"
              class="provider-toggle"
              :class="{ active: movieStore.selectedProviders & provider.bit }"
              :aria-pressed="Boolean(movieStore.selectedProviders & provider.bit)"
              @click="movieStore.toggleProvider(provider.bit)"
            >{{ provider.name }}</button>
          </div>
        </article>
      </template>

      <template v-else-if="activeSection === 'maturity'">
        <article class="settings-card settings-card--wide">
          <p class="section-label">Maturity profiles</p>
          <h2>Active profile: {{ activeProfileLabel }}</h2>
          <p>Preset profiles are wired through Discover and movie details. Editable saved profiles are the next persistence migration.</p>
          <div class="profile-grid">
            <button
              v-for="profile in maturityProfiles"
              :key="profile.id"
              type="button"
              class="profile-option"
              :class="{ active: activeProfileId === profile.id }"
              @click="selectMaturityProfile(profile)"
            >
              <strong>{{ profile.label }}</strong>
              <span>{{ profile.description }}</span>
            </button>
          </div>
          <button type="button" @click="$emit('openConfig')">Edit detailed limits</button>
        </article>
      </template>

      <template v-else-if="activeSection === 'lists'">
        <article class="settings-card settings-card--wide">
          <p class="section-label">My Lists</p>
          <h2>{{ userStore.lists.length }} {{ userStore.lists.length === 1 ? 'list' : 'lists' }}</h2>
          <p>Create, rename, share, and remove lists here. Ownership/delete semantics remain a dedicated follow-up.</p>
          <div v-if="userStore.isLoggedIn" class="list-stack">
            <div v-for="list in userStore.lists" :key="list.token" class="list-row">
              <div>
                <strong>{{ list.name }}</strong>
                <span>{{ list.movies.length }} titles</span>
              </div>
              <button type="button" @click="renameList(list)">Rename</button>
              <button type="button" @click="copyShareUrl(list.token)">{{ copiedToken === list.token ? 'Copied' : 'Share' }}</button>
              <button type="button" class="danger" @click="userStore.removeList(list.token)">Remove from profile</button>
            </div>
            <button type="button" @click="$emit('openConfig')">Create / import list</button>
          </div>
          <button v-else type="button" @click="$emit('openConfig')">Create profile to use lists</button>
        </article>
      </template>

      <template v-else>
        <article class="settings-card settings-card--muted">
          <p class="section-label">About</p>
          <h2>Ohana</h2>
          <p>Discovery first. Search separate. Settings permanent. Lists support choosing what to watch instead of becoming another destination.</p>
        </article>
      </template>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useMovieStore } from "@/stores/movies.js";
import { useUserStore } from "@/stores/user.js";
import { MATURITY_CATEGORIES, SEVERITY_LABELS } from "@/maturity.js";
import { MATURITY_PROFILES, activeMaturityProfileId, activeMaturityProfileLabel } from "@/lib/maturityProfiles.js";

defineEmits(["openConfig"]);

const route = useRoute();
const movieStore = useMovieStore();
const userStore = useUserStore();
const copiedToken = ref(null);

const activeSection = computed(() => route.params.section || null);
const pageTitle = computed(() => ({
  profile: "Profile",
  streaming: "Streaming services",
  maturity: "Maturity profiles",
  lists: "My Lists",
  about: "About Ohana",
}[activeSection.value] || "Configure once, use everywhere."));
const pageIntro = computed(() => activeSection.value
  ? "Permanent choices belong here; Discover stays focused on the current viewing moment."
  : "Permanent preferences live here. Discover stays focused on the current viewing moment."
);

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
  if (!active.length) return "Adults · no active limits";
  if (active.length === 1) return `${active[0].category.label} ≤ ${SEVERITY_LABELS[active[0].level]}`;
  return `${activeProfileLabel.value} · ${active.length} active limits`;
});
const maturityProfiles = MATURITY_PROFILES;
const activeProfileId = computed(() => activeMaturityProfileId(movieStore.maxMaturityCat));
const activeProfileLabel = computed(() => activeMaturityProfileLabel(movieStore.maxMaturityCat));

function selectMaturityProfile(profile) {
  if (profile.values) movieStore.setMaxMaturityCats(profile.values);
}

async function renameList(list) {
  const nextName = window.prompt("Rename list", list.name)?.trim();
  if (!nextName) return;
  await userStore.renameList(list.token, nextName);
}

async function copyShareUrl(token) {
  try {
    await navigator.clipboard.writeText(userStore.getShareUrl(token));
    copiedToken.value = token;
    setTimeout(() => { if (copiedToken.value === token) copiedToken.value = null; }, 1800);
  } catch (e) {
    console.warn("Could not copy share URL", e);
  }
}
</script>

<style scoped>
.settings-view { padding: 36px 48px 64px; max-width: 1120px; margin: 0 auto; width: 100%; }
.back-link { display: inline-flex; margin-bottom: 18px; color: var(--teal); text-decoration: none; font-size: 13px; }
.settings-head { margin-bottom: 22px; }
.eyebrow, .section-label { font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--teal); font-weight: 800; }
h1 { margin-top: 4px; font-family: var(--font-display); font-size: clamp(40px, 7vw, 70px); line-height: 0.96; letter-spacing: 0.04em; }
.settings-head > p:not(.eyebrow) { max-width: 640px; margin-top: 8px; color: rgba(240,238,232,0.68); }
.settings-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.section-panel { display: grid; gap: 14px; }
.settings-card { min-height: 190px; display: flex; flex-direction: column; justify-content: space-between; gap: 18px; padding: 20px; border: 1px solid rgba(255,255,255,0.09); border-radius: 20px; background: rgba(15,15,26,0.82); color: inherit; text-decoration: none; }
.settings-card--primary,
.settings-card--wide { grid-column: 1 / -1; }
.settings-card--primary { background: radial-gradient(circle at 15% 0%, rgba(232,54,93,0.2), transparent 36%), rgba(15,15,26,0.86); }
.settings-card--muted { opacity: 0.82; }
h2 { margin-top: 5px; color: var(--white); font-size: 22px; }
.settings-card p:not(.section-label) { color: rgba(240,238,232,0.66); }
button, .card-action { align-self: flex-start; min-height: 38px; border: 1px solid rgba(255,255,255,0.14); border-radius: 999px; background: rgba(255,255,255,0.05); color: var(--white); font: inherit; font-size: 13px; padding: 0 14px; cursor: pointer; display: inline-flex; align-items: center; }
button:hover, .settings-card:hover .card-action { border-color: rgba(232,54,93,0.54); color: var(--accent); }
.provider-grid, .profile-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.provider-toggle { align-self: auto; color: rgba(240,238,232,0.66); }
.provider-toggle.active, .profile-option.active { border-color: rgba(45,212,191,0.42); background: rgba(45,212,191,0.12); color: var(--teal); }
.profile-option { flex-direction: column; align-items: flex-start; gap: 3px; min-height: 76px; border-radius: 14px; }
.profile-option span { color: rgba(240,238,232,0.58); font-size: 12px; }
.list-stack { display: grid; gap: 10px; }
.list-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 12px; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; background: rgba(255,255,255,0.035); }
.list-row > div { margin-right: auto; display: grid; gap: 2px; }
.list-row span { color: var(--muted); font-size: 12px; }
.danger:hover { border-color: rgba(248,113,113,0.45); color: #fca5a5; }
@media (max-width: 720px) { .settings-view { padding: 20px 14px 48px; } .settings-grid { grid-template-columns: 1fr; } .settings-card--primary, .settings-card--wide { grid-column: auto; } }
</style>
