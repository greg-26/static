<template>
  <Teleport to="body">
    <div class="config-backdrop" @click.self="emit('close')">
      <div
        ref="dialogRef"
        class="config-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="config-dialog-title"
        tabindex="-1"
        @keydown="handleDialogKeydown"
      >
        <header class="config-header">
          <div>
            <p class="eyebrow">Ohana TV</p>
            <h2 id="config-dialog-title" class="config-title">Settings</h2>
            <p class="config-subtitle">Profile, shared lists, and family viewing preferences in one place.</p>
          </div>
          <button class="config-close" @click="emit('close')" aria-label="Close settings">✕</button>
        </header>

        <div v-if="pendingListToken" class="notice">
          A shared list is waiting — log in or create a profile to add it.
        </div>

        <div class="settings-grid">
          <section v-if="!userStore.isLoggedIn" class="settings-card settings-card--primary">
            <div class="card-heading">
              <div>
                <p class="section-label">Profile</p>
                <h3>Save your setup</h3>
              </div>
              <span class="status-pill">Not signed in</span>
            </div>
            <p class="section-copy">Create a lightweight profile to save watchlists, watched titles, and maturity limits.</p>

            <div class="form-stack">
              <label class="field-label" for="new-profile-name">Create profile</label>
              <div class="inline-form">
                <input id="new-profile-name" v-model="newName" class="config-input" placeholder="Your name" maxlength="40" @keydown.enter="handleCreate" />
                <button class="btn btn--accent" :disabled="creating || !newName.trim()" @click="handleCreate">
                  {{ creating ? "Creating…" : "Create" }}
                </button>
              </div>
            </div>

            <div class="divider"></div>

            <div class="form-stack">
              <label class="field-label" for="import-profile-token">Import existing profile</label>
              <div class="inline-form">
                <input id="import-profile-token" v-model="importToken" class="config-input config-input--mono" placeholder="Paste access token" @keydown.enter="handleImport" />
                <button class="btn btn--ghost" :disabled="importing || !importToken.trim()" @click="handleImport">
                  {{ importing ? "Loading…" : "Import" }}
                </button>
              </div>
              <p v-if="importError" class="form-error">{{ importError }}</p>
            </div>
          </section>

          <template v-else>
            <section class="settings-card settings-card--primary">
              <div class="card-heading">
                <div>
                  <p class="section-label">Profile</p>
                  <h3>{{ userStore.userData?.name || "Your profile" }}</h3>
                </div>
                <span class="status-pill status-pill--ok">Signed in</span>
              </div>
              <p class="section-copy">This token is your portable access key. Copy it before changing devices.</p>

              <div class="inline-form">
                <input v-model="editName" class="config-input" placeholder="Your name" maxlength="40" @keydown.enter="handleSetName" />
                <button class="btn btn--ghost" :disabled="userStore.saving || editName.trim() === userStore.userData?.name" @click="handleSetName">Save</button>
              </div>

              <div class="profile-actions">
                <button class="btn btn--ghost btn--sm" @click="copyToken">{{ tokenCopied ? "✓ Token copied" : "Copy access token" }}</button>
                <button class="btn btn--danger btn--sm" @click="handleLogout">Log out</button>
              </div>
            </section>

            <section class="settings-card">
              <div class="card-heading">
                <div>
                  <p class="section-label">Lists</p>
                  <h3>Watchlists</h3>
                </div>
                <span class="status-pill">{{ userStore.lists.length }} lists</span>
              </div>
              <p class="section-copy">Lists stay available in the catalog, but management stays tucked away here.</p>

              <div v-if="userStore.lists.length" class="lists-container">
                <div v-for="list in userStore.lists" :key="list.token" class="list-row">
                  <div class="list-main">
                    <span class="list-name">{{ list.name }}</span>
                    <span class="list-count">{{ list.movies.length }} films</span>
                  </div>
                  <div class="list-actions">
                    <button class="btn btn--ghost btn--sm" @click="shareList(list.token)">
                      {{ shareStates[list.token] ? "✓ Copied" : "Share" }}
                    </button>
                    <button class="btn btn--danger btn--sm" @click="handleRemoveList(list.token)">Remove</button>
                  </div>
                </div>
              </div>
              <p v-else class="empty-lists">No lists yet. Create one when you want a shortlist for a night.</p>

              <details class="add-list-details">
                <summary>Add a shared list</summary>
                <div class="inline-form inline-form--stackable">
                  <input v-model="addListToken" class="config-input config-input--mono" placeholder="Paste list token or share URL" @keydown.enter="handleAddList" />
                  <button class="btn btn--ghost" :disabled="addingList || !addListToken.trim()" @click="handleAddList">
                    {{ addingList ? "Adding…" : "Add" }}
                  </button>
                </div>
                <p v-if="addListError" class="form-error">{{ addListError }}</p>
              </details>

              <div class="new-list-box">
                <label class="field-label" for="new-list-name">Create list</label>
                <div class="inline-form">
                  <input id="new-list-name" v-model="newListName" class="config-input" placeholder="Family night, classics…" maxlength="40" @keydown.enter="handleCreateList" />
                  <button class="btn btn--accent" :disabled="creatingList || !newListName.trim()" @click="handleCreateList">
                    {{ creatingList ? "Creating…" : "Create" }}
                  </button>
                </div>
              </div>
            </section>
          </template>

          <section class="settings-card settings-card--wide">
            <div class="card-heading">
              <div>
                <p class="section-label">Viewing preferences</p>
                <h3>Family maturity limits</h3>
              </div>
              <span class="status-pill" :class="{ 'status-pill--ok': maturitySummary !== 'Off' }">{{ maturitySummary === 'Off' ? 'Off' : 'Active' }}</span>
            </div>
            <p class="section-copy">Choose the highest allowed severity per category. These filters are saved with your profile when signed in.</p>

            <button class="family-limits-toggle" type="button" :aria-expanded="familyLimitsOpen" @click="familyLimitsOpen = !familyLimitsOpen">
              <span>{{ maturitySummary }}</span>
              <span aria-hidden="true">{{ familyLimitsOpen ? "−" : "+" }}</span>
            </button>

            <div v-if="familyLimitsOpen" class="family-limits-panel">
              <div v-for="(cat, catIdx) in MATURITY_CATEGORIES" :key="cat.key" class="mat-cat-row">
                <div class="mat-cat-title">
                  <span>{{ cat.label }}</span>
                  <small>{{ categorySummary(catIdx) }}</small>
                </div>
                <div class="mat-chip-row">
                  <button class="maturity-chip maturity-chip--off" :class="{ active: movieStore.maxMaturityCat[catIdx] === -1 }" type="button" @click="movieStore.setMaxMaturityCat(catIdx, -1)">Off</button>
                  <button
                    v-for="(label, sev) in SEVERITY_LABELS"
                    :key="sev"
                    class="maturity-chip"
                    :class="[`maturity-chip--sev-${sev}`, { active: movieStore.maxMaturityCat[catIdx] === sev }]"
                    type="button"
                    @click="movieStore.setMaxMaturityCat(catIdx, sev)"
                  >{{ label }}</button>
                </div>
              </div>
              <button class="btn btn--ghost btn--sm maturity-clear" type="button" @click="movieStore.clearMaturityFilters">Clear family limits</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, ref, watch, nextTick, onMounted, onUnmounted } from "vue";
import { useUserStore } from "@/stores/user.js";
import { useMovieStore } from "@/stores/movies.js";
import { MATURITY_CATEGORIES, SEVERITY_LABELS } from "@/maturity.js";
import { lockBodyScroll, unlockBodyScroll, trapTabKey } from "@/composables/modalGuards.js";

const props = defineProps({ pendingListToken: { type: String, default: null } });
const emit = defineEmits(["close"]);

const userStore = useUserStore();
const movieStore = useMovieStore();
const dialogRef = ref(null);
const previouslyFocused = ref(null);

const newName = ref("");
const creating = ref(false);
const importToken = ref("");
const importing = ref(false);
const importError = ref("");

const editName = ref(userStore.userData?.name ?? "");
const tokenCopied = ref(false);
const shareStates = ref({});
const newListName = ref("");
const creatingList = ref(false);
const addListToken = ref("");
const addingList = ref(false);
const addListError = ref("");
const familyLimitsOpen = ref(false);

const maturitySummary = computed(() => {
  const active = movieStore.maxMaturityCat
    .map((level, i) => ({ level, category: MATURITY_CATEGORIES[i] }))
    .filter(({ level }) => level >= 0);
  if (!active.length) return "Off";
  return active.map(({ level, category }) => `${category.label} ≤ ${SEVERITY_LABELS[level]}`).join(" · ");
});

watch(() => userStore.userData?.name, (n) => {
  if (n != null) editName.value = n;
}, { immediate: true });

function categorySummary(catIdx) {
  const level = movieStore.maxMaturityCat[catIdx];
  return level >= 0 ? `Up to ${SEVERITY_LABELS[level]}` : "Not filtered";
}

async function handleCreate() {
  if (!newName.value.trim() || creating.value) return;
  creating.value = true;
  try { await userStore.createUser(newName.value.trim()); }
  finally { creating.value = false; }
}

async function handleImport() {
  if (!importToken.value.trim() || importing.value) return;
  importing.value = true;
  importError.value = "";
  try { await userStore.importUser(importToken.value.trim()); }
  catch (e) { importError.value = e.message; }
  finally { importing.value = false; }
}

async function handleSetName() {
  const name = editName.value.trim();
  if (!name || name === userStore.userData?.name) return;
  await userStore.setName(name);
}

async function copyToken() {
  try {
    await navigator.clipboard.writeText(userStore.userToken);
    tokenCopied.value = true;
    setTimeout(() => { tokenCopied.value = false; }, 2000);
  } catch {}
}

async function shareList(token) {
  const url = userStore.getShareUrl(token);
  try {
    await navigator.clipboard.writeText(url);
    shareStates.value = { ...shareStates.value, [token]: true };
    setTimeout(() => { shareStates.value = { ...shareStates.value, [token]: false }; }, 2000);
  } catch {}
}

async function handleRemoveList(token) { await userStore.removeList(token); }

async function handleCreateList() {
  if (!newListName.value.trim() || creatingList.value) return;
  creatingList.value = true;
  try {
    await userStore.createList(newListName.value.trim());
    newListName.value = "";
  } finally { creatingList.value = false; }
}

async function handleAddList() {
  if (!addListToken.value.trim() || addingList.value) return;
  addingList.value = true;
  addListError.value = "";
  try {
    let token = addListToken.value.trim();
    const urlParam = new URL(token, window.location.href).searchParams.get("add");
    if (urlParam) token = urlParam;
    await userStore.addListByToken(token);
    addListToken.value = "";
  } catch (e) {
    addListError.value = e.message;
  } finally { addingList.value = false; }
}

function handleLogout() { userStore.logout(); }

function handleDialogKeydown(event) {
  if (event.key === "Escape") {
    event.preventDefault();
    emit("close");
    return;
  }
  trapTabKey(event, dialogRef.value);
}

onMounted(async () => {
  previouslyFocused.value = document.activeElement;
  lockBodyScroll();
  await nextTick();
  dialogRef.value?.focus({ preventScroll: true });
});

onUnmounted(() => {
  unlockBodyScroll();
  previouslyFocused.value?.focus?.({ preventScroll: true });
});
</script>

<style scoped>
.config-backdrop {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: max(18px, env(safe-area-inset-top)) 18px max(18px, env(safe-area-inset-bottom));
  min-height: 100vh;
  min-height: 100dvh;
  overflow-y: auto;
  background: rgba(0,0,0,0.76);
  backdrop-filter: blur(8px);
}

.config-modal {
  width: min(760px, 100%);
  max-height: calc(100dvh - 36px);
  overflow-y: auto;
  padding: 24px;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 22px;
  background: linear-gradient(180deg, rgba(22,22,31,0.98), rgba(15,15,26,0.98));
  box-shadow: 0 30px 100px rgba(0,0,0,0.5);
  outline: none;
}

.config-header { display: flex; justify-content: space-between; gap: 18px; margin-bottom: 18px; }
.eyebrow, .section-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--accent); }
.config-title { font-family: var(--font-display); font-size: 46px; letter-spacing: 0.06em; line-height: 1; margin-top: 3px; }
.config-subtitle, .section-copy { color: var(--muted); font-size: 14px; }
.config-close { width: 36px; height: 36px; flex: 0 0 auto; border-radius: 50%; border: 1px solid rgba(255,255,255,0.13); background: rgba(255,255,255,0.04); color: var(--muted); cursor: pointer; }
.config-close:hover { color: var(--white); border-color: var(--accent); }

.notice { margin-bottom: 16px; padding: 12px 14px; border: 1px solid rgba(45,212,191,0.3); border-radius: 14px; background: rgba(45,212,191,0.1); color: rgba(255,255,255,0.84); font-size: 14px; }
.settings-grid { display: grid; gap: 14px; }
.settings-card { padding: 18px; border: 1px solid rgba(255,255,255,0.09); border-radius: 18px; background: rgba(255,255,255,0.035); }
.settings-card--primary { background: rgba(232,54,93,0.06); border-color: rgba(232,54,93,0.18); }
.card-heading { display: flex; justify-content: space-between; align-items: flex-start; gap: 14px; margin-bottom: 8px; }
.card-heading h3 { font-size: 19px; line-height: 1.2; }
.status-pill { flex: 0 0 auto; padding: 4px 9px; border: 1px solid rgba(255,255,255,0.13); border-radius: 99px; color: var(--muted); font-size: 12px; }
.status-pill--ok { border-color: rgba(45,212,191,0.35); background: rgba(45,212,191,0.1); color: var(--teal); }

.form-stack, .new-list-box { display: grid; gap: 7px; margin-top: 14px; }
.field-label { color: rgba(255,255,255,0.72); font-size: 13px; }
.inline-form { display: flex; gap: 8px; align-items: center; }
.config-input { min-width: 0; flex: 1; padding: 11px 12px; border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; background: rgba(8,8,16,0.72); color: var(--white); font: inherit; outline: none; }
.config-input:focus { border-color: rgba(232,54,93,0.62); }
.config-input--mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13px; }
.divider { height: 1px; margin: 18px 0 4px; background: rgba(255,255,255,0.08); }

.btn { flex: 0 0 auto; padding: 10px 14px; border-radius: 12px; border: 1px solid transparent; font-family: var(--font-body); font-weight: 600; cursor: pointer; color: var(--white); }
.btn:disabled { opacity: 0.45; cursor: not-allowed; }
.btn--accent { background: var(--accent); }
.btn--ghost { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.13); color: rgba(255,255,255,0.82); }
.btn--ghost:hover:not(:disabled) { border-color: var(--accent); color: var(--white); }
.btn--danger { background: rgba(248,113,113,0.1); border-color: rgba(248,113,113,0.26); color: #fca5a5; }
.btn--sm { padding: 7px 10px; font-size: 12px; }
.profile-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
.form-error { color: #fca5a5; font-size: 13px; }

.lists-container { display: grid; gap: 8px; margin-top: 14px; }
.list-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 11px; border-radius: 14px; background: rgba(8,8,16,0.42); border: 1px solid rgba(255,255,255,0.07); }
.list-main { display: grid; min-width: 0; }
.list-name { font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.list-count { color: var(--muted); font-size: 12px; }
.list-actions { display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }
.empty-lists { margin-top: 14px; padding: 12px; border-radius: 14px; background: rgba(8,8,16,0.34); color: var(--muted); font-size: 14px; }
.add-list-details { margin-top: 14px; color: var(--muted); font-size: 13px; }
.add-list-details summary { cursor: pointer; width: fit-content; }
.add-list-details .inline-form { margin-top: 8px; }

.family-limits-toggle { width: 100%; margin-top: 14px; display: flex; justify-content: space-between; gap: 12px; padding: 13px 14px; border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; background: rgba(8,8,16,0.42); color: var(--white); font: inherit; text-align: left; cursor: pointer; }
.family-limits-toggle span:first-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: rgba(255,255,255,0.86); }
.family-limits-panel { display: grid; gap: 14px; margin-top: 14px; }
.mat-cat-row { display: grid; gap: 8px; }
.mat-cat-title { display: flex; justify-content: space-between; gap: 12px; color: rgba(255,255,255,0.82); font-weight: 700; }
.mat-cat-title small { color: var(--muted); font-weight: 400; }
.mat-chip-row { display: flex; flex-wrap: wrap; gap: 6px; }
.maturity-chip { padding: 6px 10px; border: 1px solid rgba(255,255,255,0.13); border-radius: 99px; background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.72); font: inherit; font-size: 12px; cursor: pointer; }
.maturity-chip--off.active { background: rgba(255,255,255,0.14); color: var(--white); }
.maturity-chip--sev-0 { --sev-color: #4ade80; }
.maturity-chip--sev-1 { --sev-color: #a3e635; }
.maturity-chip--sev-2 { --sev-color: #facc15; }
.maturity-chip--sev-3 { --sev-color: #fb923c; }
.maturity-chip--sev-4 { --sev-color: #f87171; }
.maturity-chip--sev-5 { --sev-color: #dc2626; }
.maturity-chip:hover, .maturity-chip.active { border-color: var(--sev-color, var(--accent)); color: var(--sev-color, var(--white)); }
.maturity-chip.active { background: rgba(255,255,255,0.08); }
.maturity-clear { justify-self: start; }

@media (max-width: 640px) {
  .config-backdrop { padding: 0; }
  .config-modal { min-height: 100dvh; max-height: none; border-radius: 0; border-left: 0; border-right: 0; padding: 20px 16px; }
  .config-title { font-size: 40px; }
  .inline-form, .inline-form--stackable { align-items: stretch; flex-direction: column; }
  .btn { width: 100%; }
  .profile-actions .btn, .list-actions .btn { width: auto; }
  .list-row { align-items: flex-start; flex-direction: column; }
  .list-actions { justify-content: flex-start; }
}
</style>
