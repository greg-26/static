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
        <button class="config-close" @click="emit('close')" aria-label="Close settings">✕</button>

        <h2 id="config-dialog-title" class="config-title">Settings</h2>

        <!-- NOT LOGGED IN -->
        <template v-if="!userStore.isLoggedIn">
          <p class="config-subtitle">Create a profile to save watchlists and track what you've watched.</p>

          <!-- Pending list add notice -->
          <div v-if="pendingListToken" class="notice">
            <span>A shared list is waiting — log in or create a profile to add it.</span>
          </div>

          <!-- Create -->
          <div class="config-section">
            <p class="section-label">New Profile</p>
            <div class="inline-form">
              <input
                v-model="newName"
                class="config-input"
                placeholder="Your name"
                maxlength="40"
                @keydown.enter="handleCreate"
              />
              <button class="btn btn--accent" :disabled="creating || !newName.trim()" @click="handleCreate">
                <span v-if="creating">Creating…</span>
                <span v-else>Create</span>
              </button>
            </div>
          </div>

          <!-- Import -->
          <div class="config-section">
            <p class="section-label">Import Existing Profile</p>
            <div class="inline-form">
              <input
                v-model="importToken"
                class="config-input config-input--mono"
                placeholder="Paste your token"
                @keydown.enter="handleImport"
              />
              <button class="btn btn--ghost" :disabled="importing || !importToken.trim()" @click="handleImport">
                <span v-if="importing">Loading…</span>
                <span v-else>Import</span>
              </button>
            </div>
            <p v-if="importError" class="form-error">{{ importError }}</p>
          </div>

        </template>

        <!-- LOGGED IN -->
        <template v-else>
          <!-- Profile section -->
          <div class="config-section">
            <p class="section-label">Profile</p>

            <div class="profile-row">
              <div class="inline-form">
                <input
                  v-model="editName"
                  class="config-input"
                  placeholder="Your name"
                  maxlength="40"
                  @keydown.enter="handleSetName"
                />
                <button class="btn btn--ghost" :disabled="userStore.saving || editName === userStore.userData?.name" @click="handleSetName">
                  Save
                </button>
                <button class="btn btn--ghost btn--sm" @click="copyToken">
                {{ tokenCopied ? "✓ Copied" : "Copy access token" }}
              </button>
              </div>
            </div>

            <!--<div class="token-row">
              <span class="token-label">Your token</span>
              <code class="token-value">{{ userStore.userToken?.slice(0, 16) }}…</code>
            </div>-->

            <button class="btn btn--danger btn--sm" @click="handleLogout">Log out</button>
          </div>

          <!-- Lists section -->
          <div class="config-section">
            <p class="section-label">My Lists</p>

            <div v-if="userStore.lists.length === 0 && !userStore.loading" class="empty-lists">
              No lists yet. Create one below.
            </div>

            <div class="lists-container">
              <div
                v-for="list in userStore.lists"
                :key="list.token"
                class="list-row"
              >
                <span class="list-name">{{ list.name }}</span>
                <span class="list-count">{{ list.movies.length }} films</span>
                <div class="list-actions">
                  <button class="btn btn--ghost btn--sm" @click="shareList(list.token)">
                    {{ shareStates[list.token] ? "✓ Copied!" : "Share" }}
                  </button>
                  <button class="btn btn--danger btn--sm" @click="handleRemoveList(list.token)">
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <!-- Add list by token - ->
            <div class="add-list-section">
              <p class="add-list-label">Add a shared list</p>
              <div class="inline-form">
                <input
                  v-model="addListToken"
                  class="config-input config-input--mono"
                  placeholder="Paste list token or share URL"
                  @keydown.enter="handleAddList"
                />
                <button class="btn btn--ghost" :disabled="addingList || !addListToken.trim()" @click="handleAddList">
                  <span v-if="addingList">Adding…</span>
                  <span v-else>Add</span>
                </button>
              </div>
              <p v-if="addListError" class="form-error">{{ addListError }}</p>
            </div>-->

            <!-- New list -->
            <div class="new-list-section">
              <p class="add-list-label">Create new list</p>
              <div class="inline-form">
                <input
                  v-model="newListName"
                  class="config-input"
                  placeholder="List name"
                  maxlength="40"
                  @keydown.enter="handleCreateList"
                />
                <button class="btn btn--accent" :disabled="creatingList || !newListName.trim()" @click="handleCreateList">
                  <span v-if="creatingList">Creating…</span>
                  <span v-else>Create</span>
                </button>
              </div>
            </div>
          </div>

        </template>

          <!-- Viewing preferences -->
          <div class="config-section">
            <p class="section-label">Viewing preferences</p>

            <div class="family-limits">
              <button
                class="family-limits-toggle"
                type="button"
                :aria-expanded="familyLimitsOpen"
                @click="familyLimitsOpen = !familyLimitsOpen"
              >
                <span>Family maturity limits</span>
                <span class="family-limits-summary">{{ maturitySummary }}</span>
                <span class="family-limits-caret" aria-hidden="true">{{ familyLimitsOpen ? "−" : "+" }}</span>
              </button>

              <div v-if="familyLimitsOpen" class="family-limits-panel">
                <p class="family-limits-help">Choose the highest allowed severity per category. Off ignores that category.</p>
                <div
                  v-for="(cat, catIdx) in MATURITY_CATEGORIES"
                  :key="cat.key"
                  class="mat-cat-row"
                >
                  <span class="mat-cat-name">{{ cat.label }}</span>
                  <div class="mat-chip-row">
                    <button
                      class="maturity-chip maturity-chip--off"
                      :class="{ active: movieStore.maxMaturityCat[catIdx] === -1 }"
                      type="button"
                      @click="movieStore.setMaxMaturityCat(catIdx, -1)"
                    >Off</button>
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
                <button class="btn btn--ghost btn--sm maturity-clear" type="button" @click="movieStore.clearMaturityFilters">
                  Clear family limits
                </button>
              </div>
            </div>
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

const props = defineProps({
  pendingListToken: { type: String, default: null },
});

const emit = defineEmits(["close"]);

const userStore = useUserStore();
const movieStore = useMovieStore();
const dialogRef = ref(null);
const previouslyFocused = ref(null);

// Not logged in state
const newName = ref("");
const creating = ref(false);
const importToken = ref("");
const importing = ref(false);
const importError = ref("");

// Logged in state
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

async function handleCreate() {
  if (!newName.value.trim() || creating.value) return;
  creating.value = true;
  try {
    await userStore.createUser(newName.value.trim());
  } finally {
    creating.value = false;
  }
}

async function handleImport() {
  if (!importToken.value.trim() || importing.value) return;
  importing.value = true;
  importError.value = "";
  try {
    await userStore.importUser(importToken.value.trim());
  } catch (e) {
    importError.value = e.message;
  } finally {
    importing.value = false;
  }
}

async function handleSetName() {
  if (editName.value === userStore.userData?.name) return;
  await userStore.setName(editName.value.trim());
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
    setTimeout(() => {
      shareStates.value = { ...shareStates.value, [token]: false };
    }, 2000);
  } catch {}
}

async function handleRemoveList(token) {
  await userStore.removeList(token);
}

async function handleCreateList() {
  if (!newListName.value.trim() || creatingList.value) return;
  creatingList.value = true;
  try {
    await userStore.createList(newListName.value.trim());
    newListName.value = "";
  } finally {
    creatingList.value = false;
  }
}

async function handleAddList() {
  if (!addListToken.value.trim() || addingList.value) return;
  addingList.value = true;
  addListError.value = "";
  try {
    // Accept full share URL or raw token
    let token = addListToken.value.trim();
    const urlParam = new URL(token, window.location.href).searchParams.get("add");
    if (urlParam) token = urlParam;
    await userStore.addListByToken(token);
    addListToken.value = "";
  } catch (e) {
    addListError.value = e.message;
  } finally {
    addingList.value = false;
  }
}

function handleLogout() {
  userStore.logout();
}

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
  background: rgba(0, 0, 0, 0.75);
  z-index: 200;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: max(20px, env(safe-area-inset-top)) 20px max(20px, env(safe-area-inset-bottom));
  backdrop-filter: blur(6px);
  animation: fadeIn 0.15s ease;
  height: 100vh;
  height: 100dvh;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }

.config-modal {
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  max-width: 480px;
  width: 100%;
  padding: 28px;
  position: relative;
  animation: slideUp 0.2s ease;
  max-height: calc(100vh - 40px);
  max-height: calc(100dvh - 40px);
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  display: flex;
  flex-direction: column;
  gap: 0;
  outline: none;
}

@keyframes slideUp { from { transform: translateY(16px); opacity: 0 } to { transform: none; opacity: 1 } }

.config-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  color: var(--muted);
  font-size: 18px;
  cursor: pointer;
  line-height: 1;
  padding: 4px 8px;
  transition: color 0.15s;
}
.config-close:hover { color: var(--white); }

.config-title {
  font-family: var(--font-display);
  font-size: 26px;
  letter-spacing: 0.06em;
  margin-bottom: 8px;
}

.config-subtitle {
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 20px;
  line-height: 1.5;
}

.notice {
  background: rgba(232, 54, 93, 0.1);
  border: 1px solid rgba(232, 54, 93, 0.25);
  border-radius: var(--radius);
  padding: 10px 14px;
  font-size: 12px;
  color: var(--accent);
  margin-bottom: 18px;
}

.config-section {
  border-top: 1px solid var(--border);
  padding-top: 20px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.config-section:first-of-type {
  border-top: none;
  padding-top: 0;
  margin-top: 0;
}

.section-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted);
}

.inline-form {
  display: flex;
  gap: 8px;
}

.config-input {
  flex: 1;
  background: var(--surface3);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--white);
  font-family: var(--font-body);
  font-size: 13px;
  padding: 8px 12px;
  outline: none;
  transition: border-color 0.15s;
  min-width: 0;
}
.config-input:focus { border-color: rgba(255, 255, 255, 0.2); }
.config-input::placeholder { color: var(--muted); }

.config-input--mono { font-family: monospace; font-size: 11px; }

/* Buttons */
.btn {
  flex-shrink: 0;
  padding: 8px 16px;
  border-radius: var(--radius);
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: opacity 0.15s, background 0.15s;
  white-space: nowrap;
}
.btn:disabled { opacity: 0.45; cursor: default; }

.btn--accent { background: var(--accent); color: #fff; }
.btn--accent:hover:not(:disabled) { opacity: 0.85; }

.btn--ghost {
  background: var(--surface3);
  border: 1px solid var(--border);
  color: var(--white);
}
.btn--ghost:hover:not(:disabled) { border-color: rgba(255, 255, 255, 0.2); }

.btn--danger {
  background: rgba(248, 113, 113, 0.12);
  border: 1px solid rgba(248, 113, 113, 0.25);
  color: #f87171;
}
.btn--danger:hover:not(:disabled) { background: rgba(248, 113, 113, 0.2); }

.btn--sm { padding: 5px 10px; font-size: 12px; }


/* Viewing preferences */
.family-limits {
  background: var(--surface3);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

.family-limits-toggle {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 4px 10px;
  align-items: center;
  padding: 12px;
  border: 0;
  background: transparent;
  color: var(--white);
  font-family: var(--font-body);
  text-align: left;
  cursor: pointer;
}

.family-limits-summary {
  grid-column: 1 / -1;
  min-width: 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.45;
}

.family-limits-caret {
  grid-column: 2;
  grid-row: 1;
  color: var(--muted);
  font-size: 18px;
}

.family-limits-panel {
  border-top: 1px solid var(--border);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.family-limits-help {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.45;
}

.mat-cat-row {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.mat-cat-name {
  font-size: 12px;
  color: rgba(255,255,255,0.78);
}

.mat-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.maturity-chip {
  padding: 5px 9px;
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 99px;
  background: rgba(18,18,28,0.72);
  color: rgba(255,255,255,0.76);
  font-family: var(--font-body);
  font-size: 11px;
  cursor: pointer;
}
.maturity-chip:hover { border-color: var(--sev-color, rgba(255,255,255,0.35)); color: var(--sev-color, var(--white)); }
.maturity-chip.active { border-color: var(--sev-color, var(--accent)); color: var(--sev-color, var(--accent)); }
.maturity-chip--off.active { background: rgba(255,255,255,0.08); }
.maturity-chip--sev-0 { --sev-color: #4ade80; }
.maturity-chip--sev-1 { --sev-color: #a3e635; }
.maturity-chip--sev-2 { --sev-color: #facc15; }
.maturity-chip--sev-3 { --sev-color: #fb923c; }
.maturity-chip--sev-4 { --sev-color: #f87171; }
.maturity-chip--sev-5 { --sev-color: #dc2626; }
.maturity-chip--sev-0.active { background: rgba(74,222,128,0.13); }
.maturity-chip--sev-1.active { background: rgba(163,230,53,0.13); }
.maturity-chip--sev-2.active { background: rgba(250,204,21,0.13); }
.maturity-chip--sev-3.active { background: rgba(251,146,60,0.13); }
.maturity-chip--sev-4.active { background: rgba(248,113,113,0.13); }
.maturity-chip--sev-5.active { background: rgba(220,38,38,0.13); }
.maturity-clear { align-self: flex-start; }

/* Profile section */
.profile-row { display: flex; flex-direction: column; gap: 8px; }

.token-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.token-label {
  font-size: 12px;
  color: var(--muted);
  flex-shrink: 0;
}

.token-value {
  font-family: monospace;
  font-size: 11px;
  color: var(--muted);
  background: var(--surface3);
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid var(--border);
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Lists */
.empty-lists {
  font-size: 13px;
  color: var(--muted);
  padding: 4px 0;
}

.lists-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.list-row {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--surface3);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 8px 12px;
}

.list-name {
  flex: 1;
  font-size: 13px;
  color: var(--white);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-count {
  font-size: 11px;
  color: var(--muted);
  flex-shrink: 0;
}

.list-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.add-list-section,
.new-list-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.add-list-label {
  font-size: 12px;
  color: var(--muted);
}

.form-error {
  font-size: 12px;
  color: #f87171;
  padding: 2px 0;
}

@media (max-width: 480px) {
  .config-modal { padding: 20px 16px; }
  .token-row { flex-wrap: wrap; }
  .list-row { flex-wrap: wrap; }
}
</style>
