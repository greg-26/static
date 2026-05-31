import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { kvRead, kvWrite, generateToken } from "@/lib/kvStore.js";

const LS_KEY = "ohanatv_user_token";

export const useUserStore = defineStore("user", () => {
  const userToken = ref(localStorage.getItem(LS_KEY) || null);
  const userData = ref(null); // { name, listTokens, watched }
  const lists = ref([]);      // [{ token, name, movies }]
  const loading = ref(false);
  const saving = ref(false);

  const isLoggedIn = computed(() => !!userToken.value && !!userData.value);
  const watchedSet = computed(() => new Set(userData.value?.watched ?? []));

  function isWatched(id) { return watchedSet.value.has(id); }
  function isInList(listToken, id) {
    return lists.value.find(l => l.token === listToken)?.movies.includes(id) ?? false;
  }

  async function init() {
    if (!userToken.value) return;
    loading.value = true;
    try {
      const data = await kvRead(userToken.value);
      if (!data) return;
      userData.value = data;
      await _loadAllLists();
    } catch (e) {
      console.warn("user init failed:", e);
    } finally {
      loading.value = false;
    }
  }

  async function _loadAllLists() {
    const tokens = userData.value?.listTokens ?? [];
    if (!tokens.length) { lists.value = []; return; }
    const results = await Promise.allSettled(tokens.map(t => kvRead(t).then(d => d ? { token: t, ...d } : null)));
    lists.value = results.filter(r => r.status === "fulfilled" && r.value).map(r => r.value);
  }

  async function _saveUser() {
    if (!userToken.value || !userData.value) return;
    saving.value = true;
    try { await kvWrite(userToken.value, userData.value); }
    finally { saving.value = false; }
  }

  async function createUser(name) {
    const token = generateToken();
    const data = { name, listTokens: [], watched: [] };
    await kvWrite(token, data);
    userToken.value = token;
    userData.value = data;
    lists.value = [];
    localStorage.setItem(LS_KEY, token);
  }

  async function importUser(token) {
    const data = await kvRead(token);
    if (!data) throw new Error("No user found for this token");
    userToken.value = token;
    userData.value = data;
    lists.value = [];
    localStorage.setItem(LS_KEY, token);
    await _loadAllLists();
  }

  async function setName(name) {
    if (!userData.value) return;
    userData.value = { ...userData.value, name };
    await _saveUser();
  }

  async function createList(name) {
    if (!userData.value) return;
    const token = generateToken();
    const listData = { name, movies: [] };
    await kvWrite(token, listData);
    lists.value = [...lists.value, { token, ...listData }];
    userData.value = { ...userData.value, listTokens: [...(userData.value.listTokens ?? []), token] };
    await _saveUser();
    return token;
  }

  async function addListByToken(token) {
    if (!userData.value) throw new Error("Not logged in");
    if (userData.value.listTokens?.includes(token)) return; // already have it
    const data = await kvRead(token);
    if (!data) throw new Error("List not found");
    lists.value = [...lists.value, { token, ...data }];
    userData.value = { ...userData.value, listTokens: [...(userData.value.listTokens ?? []), token] };
    await _saveUser();
  }

  async function removeList(token) {
    if (!userData.value) return;
    lists.value = lists.value.filter(l => l.token !== token);
    userData.value = { ...userData.value, listTokens: (userData.value.listTokens ?? []).filter(t => t !== token) };
    await _saveUser();
  }

  async function toggleMovieInList(listToken, imdbId) {
    const list = lists.value.find(l => l.token === listToken);
    if (!list) return;
    const has = list.movies.includes(imdbId);
    const movies = has ? list.movies.filter(id => id !== imdbId) : [...list.movies, imdbId];
    // Optimistic update
    lists.value = lists.value.map(l => l.token === listToken ? { ...l, movies } : l);
    await kvWrite(listToken, { name: list.name, movies });
  }

  async function toggleWatched(imdbId) {
    if (!userData.value) return;
    const watched = userData.value.watched ?? [];
    const newWatched = watched.includes(imdbId) ? watched.filter(id => id !== imdbId) : [...watched, imdbId];
    userData.value = { ...userData.value, watched: newWatched };
    await _saveUser();
  }

  function getShareUrl(listToken) {
    return `${window.location.origin}${window.location.pathname}?add=${listToken}`;
  }

  function logout() {
    userToken.value = null;
    userData.value = null;
    lists.value = [];
    localStorage.removeItem(LS_KEY);
  }

  return {
    userToken, userData, lists, loading, saving, isLoggedIn,
    isWatched, isInList, init, createUser, importUser, setName,
    createList, addListByToken, removeList, toggleMovieInList, toggleWatched,
    getShareUrl, logout,
  };
});
