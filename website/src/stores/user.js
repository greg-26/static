import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { kvRead, kvWrite, generateToken } from "@/lib/kvStore.js";

const LS_KEY = "ohanatv_user_token";

export const useUserStore = defineStore("user", () => {
  const userToken = ref(localStorage.getItem(LS_KEY) || null);
  const userData = ref(null); // { name, listTokens, watched, customProviders, filterPrefs }
  const baseData = ref(null); // snapshot at last successful read — merge base for user doc
  const lists = ref([]);      // [{ token, name, movies }]
  const baseLists = ref({});  // { [listToken]: { name, movies } } — merge base per list
  const loading = ref(false);
  const saving = ref(false);

  const isLoggedIn = computed(() => !!userToken.value && !!userData.value);
  const watchedSet = computed(() => new Set(userData.value?.watched ?? []));

  function isWatched(id) { return watchedSet.value.has(id); }
  function isInList(listToken, id) {
    return lists.value.find(l => l.token === listToken)?.movies.includes(id) ?? false;
  }

  // ── 3-way merge ────────────────────────────────────────────────────────────
  // For set-like fields: compute intent vs base, apply onto remote.
  //
  //   added   = local − base
  //   removed = base − local
  //   result  = (remote ∪ added) − removed
  //
  // Scalar fields use last-write-wins (local).

  function mergeSet(base = [], local = [], remote = []) {
    const baseSet = new Set(base);
    const added   = local.filter(x => !baseSet.has(x));
    const removed = new Set(base.filter(x => !local.includes(x)));
    const result  = remote.filter(x => !removed.has(x));
    for (const x of added) if (!result.includes(x)) result.push(x);
    return result;
  }

  function _mergeUserOntoRemote(remote) {
    const base  = baseData.value ?? {};
    const local = userData.value ?? {};
    return {
      ...remote,
      name:            local.name            ?? remote.name,
      filterPrefs:     local.filterPrefs     ?? remote.filterPrefs,
      customProviders: mergeSet(base.customProviders, local.customProviders, remote.customProviders),
      listTokens:      mergeSet(base.listTokens,      local.listTokens,      remote.listTokens),
      watched:         mergeSet(base.watched,          local.watched,         remote.watched),
    };
  }

  function _mergeListOntoRemote(listToken, remote) {
    const base  = baseLists.value[listToken] ?? {};
    const local = lists.value.find(l => l.token === listToken) ?? {};
    return {
      ...remote,
      name:   local.name ?? remote.name,   // last-write-wins for name
      movies: mergeSet(base.movies, local.movies, remote.movies),
    };
  }

  // ── Core persistence ───────────────────────────────────────────────────────

  async function init() {
    if (!userToken.value) return;
    loading.value = true;
    try {
      const data = await kvRead(userToken.value);
      if (!data) return;
      userData.value = data;
      baseData.value = structuredClone(data);
      await _loadAllLists();
    } catch (e) {
      console.warn("user init failed:", e);
    } finally {
      loading.value = false;
    }
  }

  async function _loadAllLists() {
    const tokens = userData.value?.listTokens ?? [];
    if (!tokens.length) { lists.value = []; baseLists.value = {}; return; }
    const results = await Promise.allSettled(
      tokens.map(t => kvRead(t).then(d => d ? { token: t, ...d } : null))
    );
    const loaded = results
      .filter(r => r.status === "fulfilled" && r.value)
      .map(r => r.value);
    lists.value = loaded;
    // Record merge base for each list
    baseLists.value = Object.fromEntries(
      loaded.map(l => [l.token, structuredClone({ name: l.name, movies: l.movies })])
    );
  }

  async function _saveUser() {
    if (!userToken.value || !userData.value) return;
    saving.value = true;
    try {
      const remote = await kvRead(userToken.value);
      const merged = remote ? _mergeUserOntoRemote(remote) : { ...userData.value };
      await kvWrite(userToken.value, merged);
      userData.value = merged;
      baseData.value = JSON.parse(JSON.stringify(merged)); // merged can't be cloned with structuredClone
    } finally {
      saving.value = false;
    }
  }

  async function _saveList(listToken) {
    const local = lists.value.find(l => l.token === listToken);
    if (!local) return;
    const remote = await kvRead(listToken);
    const merged = remote ? _mergeListOntoRemote(listToken, remote) : { name: local.name, movies: local.movies };
    await kvWrite(listToken, merged);
    // Update local state and base to the merged result
    lists.value = lists.value.map(l => l.token === listToken ? { ...l, ...merged } : l);
    baseLists.value = {
      ...baseLists.value,
      [listToken]: structuredClone({ name: merged.name, movies: merged.movies }),
    };
  }

  // ── User lifecycle ─────────────────────────────────────────────────────────

  async function createUser(name) {
    const token = generateToken();
    const data = { name, listTokens: [], watched: [], customProviders: [], filterPrefs: null };
    await kvWrite(token, data);
    userToken.value = token;
    userData.value = data;
    baseData.value = structuredClone(data);
    lists.value = [];
    baseLists.value = {};
    localStorage.setItem(LS_KEY, token);
  }

  async function importUser(token) {
    const data = await kvRead(token);
    if (!data) throw new Error("No user found for this token");
    userToken.value = token;
    userData.value = data;
    baseData.value = structuredClone(data);
    lists.value = [];
    baseLists.value = {};
    localStorage.setItem(LS_KEY, token);
    await _loadAllLists();
  }

  async function setName(name) {
    if (!userData.value) return;
    userData.value = { ...userData.value, name };
    await _saveUser();
  }

  // ── Lists ──────────────────────────────────────────────────────────────────

  async function createList(name) {
    if (!userData.value) return;
    const token = generateToken();
    const listData = { name, movies: [] };
    await kvWrite(token, listData);
    lists.value = [...lists.value, { token, ...listData }];
    baseLists.value = { ...baseLists.value, [token]: structuredClone(listData) };
    userData.value = { ...userData.value, listTokens: [...(userData.value.listTokens ?? []), token] };
    await _saveUser();
    return token;
  }

  async function addListByToken(token) {
    if (!userData.value) throw new Error("Not logged in");
    if (userData.value.listTokens?.includes(token)) return;
    const data = await kvRead(token);
    if (!data) throw new Error("List not found");
    lists.value = [...lists.value, { token, ...data }];
    baseLists.value = { ...baseLists.value, [token]: structuredClone({ name: data.name, movies: data.movies }) };
    userData.value = { ...userData.value, listTokens: [...(userData.value.listTokens ?? []), token] };
    await _saveUser();
  }

  async function removeList(token) {
    if (!userData.value) return;
    lists.value = lists.value.filter(l => l.token !== token);
    const { [token]: _, ...rest } = baseLists.value;
    baseLists.value = rest;
    userData.value = { ...userData.value, listTokens: (userData.value.listTokens ?? []).filter(t => t !== token) };
    await _saveUser();
  }

  async function toggleMovieInList(listToken, imdbId) {
    const list = lists.value.find(l => l.token === listToken);
    if (!list) return;
    const has = list.movies.includes(imdbId);
    const movies = has ? list.movies.filter(id => id !== imdbId) : [...list.movies, imdbId];
    // Optimistic local update, then merge-write
    lists.value = lists.value.map(l => l.token === listToken ? { ...l, movies } : l);
    await _saveList(listToken);
  }

  // ── Watched ────────────────────────────────────────────────────────────────

  async function toggleWatched(imdbId) {
    if (!userData.value) return;
    const watched = userData.value.watched ?? [];
    const newWatched = watched.includes(imdbId)
      ? watched.filter(id => id !== imdbId)
      : [...watched, imdbId];
    userData.value = { ...userData.value, watched: newWatched };
    await _saveUser();
  }

  // ── Custom providers ───────────────────────────────────────────────────────

  async function addCustomProvider(urlTemplate) {
    if (!userData.value) return;
    const existing = userData.value.customProviders ?? [];
    if (existing.includes(urlTemplate)) return;
    userData.value = { ...userData.value, customProviders: [...existing, urlTemplate] };
    await _saveUser();
  }

  async function removeCustomProvider(urlTemplate) {
    if (!userData.value) return;
    userData.value = {
      ...userData.value,
      customProviders: (userData.value.customProviders ?? []).filter(u => u !== urlTemplate),
    };
    await _saveUser();
  }

  // ── Filter preferences ─────────────────────────────────────────────────────

  async function saveFilterPrefs(prefs) {
    if (!userData.value) return;
    userData.value = { ...userData.value, filterPrefs: prefs };
    await _saveUser();
  }

  // ── Sharing / auth ─────────────────────────────────────────────────────────

  function getShareUrl(listToken) {
    return `${window.location.origin}${window.location.pathname}?add=${listToken}`;
  }

  function logout() {
    userToken.value = null;
    userData.value = null;
    baseData.value = null;
    lists.value = [];
    baseLists.value = {};
    localStorage.removeItem(LS_KEY);
  }

  return {
    userToken, userData, lists, loading, saving, isLoggedIn, watchedSet,
    isWatched, isInList, init, createUser, importUser, setName,
    createList, addListByToken, removeList, toggleMovieInList, toggleWatched,
    addCustomProvider, removeCustomProvider, saveFilterPrefs,
    getShareUrl, logout,
  };
});