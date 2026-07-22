const DOMAIN_BRANDS = {
  netflix: "Netflix", disney: "Disney+", hbo: "HBO", max: "Max",
  prime: "Prime Video", amazon: "Prime Video", apple: "Apple TV+",
  hulu: "Hulu", paramount: "Paramount+", peacock: "Peacock",
  mubi: "MUBI", criterion: "Criterion", vudu: "Vudu",
  googleplay: "Google Play", youtube: "YouTube", rakuten: "Rakuten",
  skyshowtime: "SkyShowtime", filmin: "Filmin", movistar: "Movistar+",
  atresplayer: "Atresplayer", mitele: "Mitele", rtve: "RTVE Play",
};

export function extractCustomProviderDomain(urlTemplate) {
  try {
    const clean = urlTemplate.replace(/\{[^}]+\}/g, "X").trim();
    const prefixed = /^https?:\/\//i.test(clean) ? clean : `https://${clean}`;
    const hostname = new URL(prefixed).hostname.toLowerCase();
    const parts = hostname.replace(/\.(com|net|org|io|tv|es|co|uk|de|fr|it|jp|au|ca|mx|br|ar|nl|be|pl|se|no|dk|fi|pt|ru|cn|in|app|me|co\.uk|com\.mx|com\.br|com\.ar)$/, "").split(".");
    for (const part of [...parts].reverse()) {
      const key = part.replace(/[^a-z]/g, "");
      if (DOMAIN_BRANDS[key]) return DOMAIN_BRANDS[key];
    }
    const name = parts[parts.length - 1] || parts[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  } catch {
    return urlTemplate.split("/")[0].replace(/^www\./, "");
  }
}

export function fillCustomProviderUrl(urlTemplate, movie) {
  if (!movie) return "#";
  const prefixed = /^https?:\/\//i.test(urlTemplate) ? urlTemplate : `https://${urlTemplate}`;
  return prefixed
    .replace(/\{title\}/gi, encodeURIComponent((movie.t || movie.ts || "").replace(/[^a-zA-Z0-9.]/g, " ").trim()))
    .replace(/\{year\}/gi, encodeURIComponent(movie.y || ""))
    .replace(/\{imdb\}/gi, encodeURIComponent(movie.id || ""));
}

export function resolveCustomProviders(templates = [], movie = null) {
  return templates.map(urlTemplate => ({
    urlTemplate,
    domain: extractCustomProviderDomain(urlTemplate),
    url: movie ? fillCustomProviderUrl(urlTemplate, movie) : null,
  }));
}
