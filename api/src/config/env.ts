export interface ApiEnv {
  TMDB_API_KEY?: string;
  TMDB_ACCESS_TOKEN?: string;
  TMDB_BASE_URL?: string;
  TMDB_TIMEOUT_MS?: string;
}

export function tmdbTimeoutMs(env: ApiEnv): number | undefined {
  if (env.TMDB_TIMEOUT_MS === undefined || env.TMDB_TIMEOUT_MS.trim() === "") return undefined;

  const value = Number(env.TMDB_TIMEOUT_MS);
  return Number.isFinite(value) && value > 0 ? value : undefined;
}
