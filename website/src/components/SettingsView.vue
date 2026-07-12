<template>
  <section class="settings-view">
    <RouterLink v-if="activeSection" class="back-link" to="/settings">← Settings</RouterLink>

    <div v-if="!activeSection" class="settings-list" aria-label="Settings sections">
      <SettingsRow
        to="/settings/profile"
        icon="P"
        label="Profile"
        :title="userStore.isLoggedIn ? (userStore.userData?.name || 'Your profile') : 'No profile yet'"
        :summary="userStore.isLoggedIn ? 'Recovery token configured' : 'Create or restore profile'"
      />
      <SettingsRow
        to="/settings/streaming"
        icon="▶"
        label="Streaming services"
        :title="selectedProviderSummary"
        summary="Used by Discover availability"
      />
      <SettingsRow
        to="/settings/maturity"
        icon="M"
        label="Maturity profiles"
        :title="maturitySummary"
        summary="Active viewing context"
      />
      <SettingsRow
        to="/settings/lists"
        icon="L"
        label="My Lists"
        :title="`${userStore.lists.length} ${userStore.lists.length === 1 ? 'list' : 'lists'}`"
        summary="Managed here, used in Discover"
      />
    </div>

    <div v-else class="section-panel">
      <template v-if="activeSection === 'profile'">
        <article class="settings-card settings-card--primary">
          <p class="section-label">Profile</p>
          <h2>{{ userStore.isLoggedIn ? (userStore.userData?.name || 'Your profile') : 'No profile yet' }}</h2>
          <p>{{ userStore.isLoggedIn ? 'Your recovery token lets you restore this profile on another device.' : 'Create or restore a profile to sync lists, watched titles, services, and limits.' }}</p>

          <div v-if="userStore.isLoggedIn" class="settings-form">
            <label>
              <span>Display name</span>
              <input v-model="editName" type="text" maxlength="40" placeholder="Your name" @keydown.enter="saveName" />
            </label>
            <button type="button" :disabled="!canSaveName || userStore.saving" @click="saveName">Save name</button>
            <label>
              <span>Recovery token</span>
              <input :value="userStore.userToken" readonly class="mono" />
            </label>
            <div class="action-row">
              <button type="button" @click="copyProfileToken">{{ tokenCopied ? 'Copied' : 'Copy token' }}</button>
              <button type="button" class="danger" @click="userStore.logout">Log out</button>
            </div>
          </div>

          <div v-else class="settings-form">
            <label>
              <span>Create profile</span>
              <input v-model="newName" type="text" maxlength="40" placeholder="Your name" @keydown.enter="createProfile" />
            </label>
            <button type="button" :disabled="creatingProfile || !newName.trim()" @click="createProfile">{{ creatingProfile ? 'Creating…' : 'Create profile' }}</button>
            <label>
              <span>Restore profile</span>
              <input v-model="importToken" class="mono" placeholder="Paste recovery token" @keydown.enter="importProfile" />
            </label>
            <button type="button" :disabled="importingProfile || !importToken.trim()" @click="importProfile">{{ importingProfile ? 'Restoring…' : 'Restore profile' }}</button>
            <p v-if="profileError" class="form-error">{{ profileError }}</p>
          </div>
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
          <p>Choose the active viewing context, or edit the detailed limits for your personal profile.</p>
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
          <div class="profile-actions-panel">
            <div class="settings-form settings-form--inline">
              <label>
                <span>Create profile</span>
                <input v-model="newMaturityProfileName" maxlength="40" placeholder="Movie night, grandparents…" @keydown.enter="createMaturityProfile" />
              </label>
              <button type="button" :disabled="!newMaturityProfileName.trim()" @click="createMaturityProfile">Create</button>
            </div>
            <div class="action-row">
              <button type="button" @click="duplicateMaturityProfile">Duplicate active</button>
              <button type="button" :disabled="activeMaturityProfile?.builtIn" @click="renameMaturityProfile">Rename active</button>
              <button type="button" class="danger" :disabled="activeMaturityProfile?.builtIn" @click="deleteMaturityProfile">Delete active</button>
            </div>
            <p v-if="maturityProfileError" class="form-error">{{ maturityProfileError }}</p>
          </div>
          <div class="maturity-editor">
            <div v-for="(cat, catIdx) in maturityCategories" :key="cat.key" class="maturity-row">
              <div>
                <strong>{{ cat.label }}</strong>
                <span>{{ categorySummary(catIdx) }}</span>
              </div>
              <div class="maturity-chips">
                <button type="button" :class="{ active: movieStore.maxMaturityCat[catIdx] === -1 }" @click="movieStore.setMaxMaturityCat(catIdx, -1)">Any</button>
                <button
                  v-for="(label, level) in severityLabels"
                  :key="level"
                  type="button"
                  :class="{ active: movieStore.maxMaturityCat[catIdx] === level }"
                  @click="movieStore.setMaxMaturityCat(catIdx, level)"
                >{{ label }}</button>
              </div>
            </div>
          </div>
        </article>
      </template>

      <template v-else-if="activeSection === 'lists'">
        <div v-if="userStore.isLoggedIn" class="list-stack">
          <div v-for="list in userStore.lists" :key="list.token" class="list-row">
            <div>
              <strong>{{ list.name }}</strong>
              <span>{{ list.movies.length }} titles</span>
            </div>
            <button type="button" @click="renameList(list)">Rename</button>
            <button type="button" @click="copyShareUrl(list.token)">{{ copiedToken === list.token ? 'Copied' : 'Share' }}</button>
            <button type="button" class="danger" @click="userStore.removeList(list.token)">Remove</button>
          </div>
          <p v-if="!userStore.lists.length" class="empty-note">No lists yet.</p>
          <div class="settings-form settings-form--inline list-action-row">
            <label>
              <span>Create list</span>
              <input v-model="newListName" maxlength="40" placeholder="Family night, classics…" @keydown.enter="createList" />
            </label>
            <button type="button" :disabled="creatingList || !newListName.trim()" @click="createList">{{ creatingList ? 'Creating…' : 'Create' }}</button>
          </div>
          <div class="settings-form settings-form--inline list-action-row">
            <label>
              <span>Import shared list</span>
              <input v-model="addListToken" class="mono" placeholder="Paste list token or share URL" @keydown.enter="addSharedList" />
            </label>
            <button type="button" :disabled="addingList || !addListToken.trim()" @click="addSharedList">{{ addingList ? 'Adding…' : 'Add' }}</button>
            <p v-if="listError" class="form-error">{{ listError }}</p>
          </div>
        </div>
        <RouterLink v-else class="card-action" to="/settings/profile">Create profile to use lists</RouterLink>
      </template>

    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useMovieStore } from "@/stores/movies.js";
import { useUserStore } from "@/stores/user.js";
import { MATURITY_CATEGORIES, SEVERITY_LABELS } from "@/maturity.js";
import { profileLabel } from "@/lib/maturityProfiles.js";
import SettingsRow from "@/components/SettingsRow.vue";

defineEmits(["openConfig"]);

const route = useRoute();
const movieStore = useMovieStore();
const userStore = useUserStore();
const copiedToken = ref(null);
const tokenCopied = ref(false);
const newName = ref("");
const editName = ref(userStore.userData?.name ?? "");
const importToken = ref("");
const profileError = ref("");
const creatingProfile = ref(false);
const importingProfile = ref(false);
const newListName = ref("");
const addListToken = ref("");
const listError = ref("");
const creatingList = ref(false);
const addingList = ref(false);
const newMaturityProfileName = ref("");
const maturityProfileError = ref("");

const settingsSections = new Set(["profile", "streaming", "maturity", "lists"]);
const activeSection = computed(() => {
  const section = route.params.section;
  return settingsSections.has(section) ? section : null;
});
const canSaveName = computed(() => {
  const name = editName.value.trim();
  return Boolean(name) && name !== userStore.userData?.name;
});
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
const maturityProfiles = computed(() => movieStore.maturityProfiles);
const maturityCategories = MATURITY_CATEGORIES;
const severityLabels = SEVERITY_LABELS;
const activeProfileId = computed(() => movieStore.activeMaturityProfileId);
const activeProfileLabel = computed(() => profileLabel(movieStore.maturityProfiles, movieStore.activeMaturityProfileId));
const activeMaturityProfile = computed(() => movieStore.maturityProfiles.find(profile => profile.id === movieStore.activeMaturityProfileId));

watch(() => userStore.userData?.name, (name) => {
  editName.value = name ?? "";
}, { immediate: true });

function selectMaturityProfile(profile) {
  movieStore.selectMaturityProfile(profile.id);
}

function categorySummary(catIdx) {
  const level = movieStore.maxMaturityCat[catIdx];
  return level >= 0 ? `Up to ${SEVERITY_LABELS[level]}` : "Any intensity";
}

function makeProfileId(label) {
  const base = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 32) || "profile";
  const existing = new Set(movieStore.maturityProfiles.map(profile => profile.id));
  let id = base;
  let i = 2;
  while (existing.has(id)) id = `${base}-${i++}`;
  return id;
}

function createMaturityProfile() {
  const label = newMaturityProfileName.value.trim();
  if (!label) return;
  maturityProfileError.value = "";
  movieStore.addMaturityProfile({
    id: makeProfileId(label),
    label,
    description: "Custom viewing limits",
    values: [...movieStore.maxMaturityCat],
  });
  newMaturityProfileName.value = "";
}

function duplicateMaturityProfile() {
  const source = activeMaturityProfile.value;
  if (!source) return;
  const label = `${source.label} copy`;
  maturityProfileError.value = "";
  movieStore.addMaturityProfile({
    id: makeProfileId(label),
    label,
    description: `Based on ${source.label}`,
    values: [...movieStore.maxMaturityCat],
  });
}

function renameMaturityProfile() {
  const profile = activeMaturityProfile.value;
  if (!profile || profile.builtIn) return;
  const label = window.prompt("Rename maturity profile", profile.label)?.trim();
  if (!label) return;
  maturityProfileError.value = "";
  movieStore.updateMaturityProfile(profile.id, { label });
}

function deleteMaturityProfile() {
  const profile = activeMaturityProfile.value;
  if (!profile || profile.builtIn) return;
  if (!window.confirm(`Delete “${profile.label}”?`)) return;
  maturityProfileError.value = "";
  movieStore.removeMaturityProfile(profile.id);
}

async function createProfile() {
  if (!newName.value.trim() || creatingProfile.value) return;
  creatingProfile.value = true;
  profileError.value = "";
  try {
    await userStore.createUser(newName.value.trim());
    editName.value = userStore.userData?.name ?? "";
    newName.value = "";
  } catch (e) {
    profileError.value = e.message;
  } finally {
    creatingProfile.value = false;
  }
}

async function importProfile() {
  if (!importToken.value.trim() || importingProfile.value) return;
  importingProfile.value = true;
  profileError.value = "";
  try {
    await userStore.importUser(importToken.value.trim());
    editName.value = userStore.userData?.name ?? "";
    importToken.value = "";
  } catch (e) {
    profileError.value = e.message;
  } finally {
    importingProfile.value = false;
  }
}

async function saveName() {
  if (!canSaveName.value) return;
  await userStore.setName(editName.value.trim());
}

async function copyProfileToken() {
  try {
    await navigator.clipboard.writeText(userStore.userToken);
    tokenCopied.value = true;
    setTimeout(() => { tokenCopied.value = false; }, 1800);
  } catch (e) {
    console.warn("Could not copy profile token", e);
  }
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

async function createList() {
  if (!newListName.value.trim() || creatingList.value) return;
  creatingList.value = true;
  listError.value = "";
  try {
    await userStore.createList(newListName.value.trim());
    newListName.value = "";
  } catch (e) {
    listError.value = e.message;
  } finally {
    creatingList.value = false;
  }
}

async function addSharedList() {
  if (!addListToken.value.trim() || addingList.value) return;
  addingList.value = true;
  listError.value = "";
  try {
    let token = addListToken.value.trim();
    const urlParam = new URL(token, window.location.href).searchParams.get("add");
    if (urlParam) token = urlParam;
    await userStore.addListByToken(token);
    addListToken.value = "";
  } catch (e) {
    listError.value = e.message;
  } finally {
    addingList.value = false;
  }
}
</script>

<style scoped>
.settings-view { padding: 36px 48px 64px; max-width: 1120px; margin: 0 auto; width: 100%; }
.back-link { display: inline-flex; margin-bottom: 18px; color: var(--teal); text-decoration: none; font-size: 13px; }
.section-label { font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--teal); font-weight: 800; }
.settings-list { display: grid; }
.section-panel { display: grid; gap: 14px; }
.settings-card { min-height: 190px; display: flex; flex-direction: column; justify-content: space-between; gap: 18px; padding: 20px; border: 1px solid rgba(255,255,255,0.09); border-radius: 20px; background: rgba(15,15,26,0.82); color: inherit; text-decoration: none; }
.settings-card--primary,
.settings-card--wide { grid-column: 1 / -1; }
.settings-card--primary { background: radial-gradient(circle at 15% 0%, rgba(232,54,93,0.2), transparent 36%), rgba(15,15,26,0.86); }
.settings-card--muted { opacity: 0.82; }
h2 { margin-top: 5px; color: var(--white); font-size: 22px; }
.settings-card p:not(.section-label) { color: rgba(240,238,232,0.66); }
button, .card-action { align-self: flex-start; min-height: 38px; border: 1px solid rgba(255,255,255,0.14); border-radius: 999px; background: rgba(255,255,255,0.05); color: var(--white); font: inherit; font-size: 13px; padding: 0 14px; cursor: pointer; display: inline-flex; align-items: center; text-decoration: none; }
button:hover, .settings-card:hover .card-action { border-color: rgba(232,54,93,0.54); color: var(--accent); }
button:disabled { opacity: 0.45; cursor: not-allowed; }
.settings-form { display: grid; gap: 10px; align-items: start; }
.settings-form--inline { grid-template-columns: minmax(180px, 1fr) auto; align-items: end; }
.settings-form label { display: grid; gap: 6px; color: rgba(240,238,232,0.72); font-size: 13px; }
.settings-form input { width: 100%; min-height: 42px; border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; background: rgba(8,8,16,0.72); color: var(--white); font: inherit; padding: 0 12px; outline: none; }
.settings-form input:focus { border-color: rgba(232,54,93,0.62); }
.settings-form input[readonly] { color: rgba(240,238,232,0.7); }
.mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13px; }
.action-row { display: flex; flex-wrap: wrap; gap: 8px; }
.form-error { color: #fca5a5; font-size: 13px; }
.empty-note { padding: 12px; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; background: rgba(255,255,255,0.035); color: var(--muted); font-size: 14px; }
.provider-grid, .profile-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.provider-toggle { align-self: auto; color: rgba(240,238,232,0.66); }
.provider-toggle.active, .profile-option.active { border-color: rgba(45,212,191,0.42); background: rgba(45,212,191,0.12); color: var(--teal); }
.profile-option { flex-direction: column; align-items: flex-start; gap: 3px; min-height: 76px; border-radius: 14px; }
.profile-option span { color: rgba(240,238,232,0.58); font-size: 12px; }
.profile-actions-panel { display: grid; gap: 10px; padding: 12px; border-radius: 16px; background: rgba(255,255,255,0.035); border: 1px solid rgba(255,255,255,0.08); }
.maturity-editor { display: grid; gap: 14px; }
.maturity-row { display: grid; gap: 8px; }
.maturity-row > div:first-child { display: flex; justify-content: space-between; gap: 12px; color: rgba(240,238,232,0.82); }
.maturity-row span { color: var(--muted); font-size: 12px; }
.maturity-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.maturity-chips button { min-height: 32px; padding: 0 10px; color: rgba(240,238,232,0.68); }
.maturity-chips button.active { border-color: rgba(45,212,191,0.42); background: rgba(45,212,191,0.12); color: var(--teal); }
.list-stack { display: grid; }
.list-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.08); }
.list-row:first-child { border-top: 1px solid rgba(255,255,255,0.08); }
.list-row > div { margin-right: auto; display: grid; gap: 2px; }
.list-row span { color: var(--muted); font-size: 12px; }
.list-action-row { padding: 16px 0 0; }
.danger:hover { border-color: rgba(248,113,113,0.45); color: #fca5a5; }
@media (max-width: 720px) { .settings-view { padding: 20px 14px 48px; } .settings-card--primary, .settings-card--wide { grid-column: auto; } .settings-form--inline { grid-template-columns: 1fr; } }
</style>
