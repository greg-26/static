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

function normalizeSeason(season) {
  if (!season || typeof season !== "object") return null;
  const seasonNumber = Number.isFinite(season.seasonNumber) ? season.seasonNumber : null;
  const title = season.name || (seasonNumber === 0 ? "Specials" : seasonNumber ? `Season ${seasonNumber}` : "Season");
  return {
    id: season.id ? String(season.id) : `${seasonNumber ?? "unknown"}-${title}`,
    seasonNumber,
    title: String(title),
    episodeCount: Number.isFinite(season.episodeCount) ? season.episodeCount : null,
    airDate: season.airDate || null,
    year: season.year || null,
    overview: season.overview || null,
    posterUrl: bestImageUrl(season.poster, ["thumbnail", "small", "medium", "original"]),
    isSpecials: seasonNumber === 0,
  };
}

const PROVIDER_GROUP_LABELS = {
  stream: "Stream",
  flatrate: "Stream",
  rent: "Rent",
  buy: "Buy",
  free: "Free",
  ads: "With ads",
};

const PROVIDER_GROUP_ORDER = ["stream", "flatrate", "rent", "buy", "free", "ads"];

function normalizeProvider(provider, fallbackGroup) {
  if (!provider || typeof provider !== "object" || !provider.name) return null;
  const id = provider.id ? String(provider.id) : `${fallbackGroup}-${provider.name}`;
  return {
    id,
    name: String(provider.name).trim(),
    logoUrl: bestImageUrl(provider.logo, ["thumbnail", "small", "medium", "original"]),
  };
}

function normalizeProviderGroups(streamingProviders) {
  if (!streamingProviders || typeof streamingProviders !== "object") return [];

  const orderedKeys = [
    ...PROVIDER_GROUP_ORDER,
    ...Object.keys(streamingProviders).filter(key => !PROVIDER_GROUP_ORDER.includes(key) && Array.isArray(streamingProviders[key])),
  ];

  return orderedKeys
    .map(key => {
      const providers = Array.isArray(streamingProviders[key])
        ? streamingProviders[key].map(provider => normalizeProvider(provider, key)).filter(Boolean)
        : [];
      if (!providers.length) return null;
      return {
        key,
        label: PROVIDER_GROUP_LABELS[key] || key.replace(/[_-]+/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
        providers,
      };
    })
    .filter(Boolean);
}

function normalizeArtworkImage(image, preferred, type) {
  const url = bestImageUrl(image, preferred);
  if (!url) return null;
  return {
    id: image.id ? String(image.id) : url,
    url,
    originalUrl: bestImageUrl(image, ["original", "large", "medium", "small"]),
    width: Number.isFinite(image.width) ? image.width : null,
    height: Number.isFinite(image.height) ? image.height : null,
    language: image.language || null,
    type,
  };
}

function uniqueImages(images) {
  const seen = new Set();
  return images.filter(image => {
    if (!image?.url || seen.has(image.url)) return false;
    seen.add(image.url);
    return true;
  });
}

function normalizeHeroImageCandidates(artwork) {
  if (!artwork || typeof artwork !== "object") return [];
  const candidates = [
    normalizeArtworkImage(artwork.backdrop, ["large", "medium", "original", "small"], "backdrop"),
    ...(Array.isArray(artwork.backdrops)
      ? artwork.backdrops.map(image => normalizeArtworkImage(image, ["large", "medium", "original", "small"], "backdrop"))
      : []),
    ...(Array.isArray(artwork.stills)
      ? artwork.stills.map(image => normalizeArtworkImage(image, ["large", "medium", "original", "small"], "still"))
      : []),
  ].filter(Boolean);
  return uniqueImages(candidates);
}

function normalizePosterImage(artwork) {
  if (!artwork || typeof artwork !== "object") return null;
  return normalizeArtworkImage(artwork.poster, ["medium", "large", "small", "original"], "poster");
}

function normalizeTitleDetail(data) {
  if (!data || typeof data !== "object") return null;
  const cast = Array.isArray(data.cast) ? data.cast.map(normalizeCastMember).filter(Boolean).slice(0, 8) : [];
  const collectionItems = Array.isArray(data.collection?.items)
    ? data.collection.items.map(normalizeCollectionItem).filter(Boolean).sort((a, b) => (a.order ?? 999) - (b.order ?? 999)).slice(0, 8)
    : [];
  const seasons = Array.isArray(data.seasons)
    ? data.seasons.map(normalizeSeason).filter(Boolean).sort((a, b) => {
      if (a.isSpecials !== b.isSpecials) return a.isSpecials ? 1 : -1;
      return (a.seasonNumber ?? 999) - (b.seasonNumber ?? 999);
    })
    : [];

  return {
    imdbId: data.imdbId || null,
    type: data.type || null,
    title: data.title || null,
    overview: data.overview || null,
    runtimeMinutes: data.runtime?.minutes || null,
    ratingAverage: data.rating?.average || null,
    seasonCount: Number.isFinite(data.seasonCount) ? data.seasonCount : null,
    seasons,
    cast,
    artwork: data.artwork || null,
    posterImage: normalizePosterImage(data.artwork),
    heroImageCandidates: normalizeHeroImageCandidates(data.artwork),
    providerRegion: data.streamingProviders?.region || null,
    providerGroups: normalizeProviderGroups(data.streamingProviders),
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

export { normalizeProviderGroups, normalizeTitleDetail };
