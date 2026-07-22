const DEFAULT_API_BASE_URL = "https://ohanamovies-api.ohanamovies-api.workers.dev";
const DEFAULT_TIMEOUT_MS = 4500;
const titleCache = new Map();

function configuredBaseUrl() {
  return (import.meta.env.VITE_OHANA_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/+$/, "");
}

function isValidImdbId(imdbId) {
  return /^tt\d{7,10}$/.test(String(imdbId || ""));
}

function bestImageUrl(image, preferred = ["medium", "small", "large", "original"]) {
  if (!image || typeof image !== "object") return null;
  for (const key of preferred) {
    const value = image.sizes?.[key];
    if (typeof value === "string" && value) return value;
  }
  return typeof image.url === "string" && image.url ? image.url : null;
}

function normalizeCastMember(member) {
  if (!member || typeof member !== "object" || !member.name) return null;
  const roles = Array.isArray(member.roles) ? member.roles.filter(Boolean).slice(0, 2) : [];
  return {
    id: member.id ? String(member.id) : member.name,
    name: String(member.name),
    roles,
    profileUrl: bestImageUrl(member.profile, ["small", "thumbnail", "medium", "original"]),
  };
}

function normalizeCollectionItem(item) {
  if (!item || typeof item !== "object" || !item.title) return null;
  return {
    id: item.id ? String(item.id) : `${item.title}-${item.release?.year || ""}`,
    imdbId: item.imdbId || null,
    title: String(item.title),
    year: item.release?.year || null,
    posterUrl: bestImageUrl(item.poster, ["thumbnail", "small", "medium", "original"]),
    order: Number.isFinite(item.order) ? item.order : null,
  };
}

function normalizeTitleDetail(data) {
  if (!data || typeof data !== "object") return null;
  const cast = Array.isArray(data.cast) ? data.cast.map(normalizeCastMember).filter(Boolean).slice(0, 8) : [];
  const collectionItems = Array.isArray(data.collection?.items)
    ? data.collection.items.map(normalizeCollectionItem).filter(Boolean).sort((a, b) => (a.order ?? 999) - (b.order ?? 999)).slice(0, 8)
    : [];

  return {
    imdbId: data.imdbId || null,
    type: data.type || null,
    title: data.title || null,
    overview: data.overview || null,
    runtimeMinutes: data.runtime?.minutes || null,
    ratingAverage: data.rating?.average || null,
    cast,
    artwork: data.artwork || null,
    collection: data.collection ? {
      id: data.collection.id || null,
      name: data.collection.name || "Collection",
      posterUrl: bestImageUrl(data.collection.poster, ["thumbnail", "small", "medium", "original"]),
      backdropUrl: bestImageUrl(data.collection.backdrop, ["medium", "small", "large", "original"]),
      items: collectionItems,
    } : null,
  };
}

export function getOhanaApiConfig() {
  return {
    baseUrl: configuredBaseUrl(),
    timeoutMs: Number(import.meta.env.VITE_OHANA_API_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS,
    lang: import.meta.env.VITE_OHANA_API_LANG || "es-ES",
    country: import.meta.env.VITE_OHANA_API_COUNTRY || "ES",
  };
}

export function clearOhanaTitleCache() {
  titleCache.clear();
}

export async function fetchOhanaTitleDetail(imdbId, options = {}) {
  if (!isValidImdbId(imdbId)) return null;

  const config = { ...getOhanaApiConfig(), ...options };
  const cacheKey = `${config.baseUrl}|${config.lang}|${config.country}|${imdbId}`;
  if (titleCache.has(cacheKey)) return titleCache.get(cacheKey);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);
  const params = new URLSearchParams();
  if (config.lang) params.set("lang", config.lang);
  if (config.country) params.set("country", config.country);
  const url = `${config.baseUrl}/titles/${encodeURIComponent(imdbId)}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const detail = normalizeTitleDetail(await response.json());
    titleCache.set(cacheKey, detail);
    return detail;
  } finally {
    clearTimeout(timeout);
  }
}

export { normalizeTitleDetail };
