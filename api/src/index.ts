import { areCacheOverridesAllowed, isProductionEnvironment, parseTitleCacheTtlSeconds, type TitleCacheMode } from "./cache/titleCache";
import type { ApiEnv } from "./config/env";
import { tmdbTimeoutMs } from "./config/env";
import { errorResponse } from "./http/errors";
import { jsonResponse } from "./http/errors";
import { lookupTitle } from "./services/titleLookup";
import { createTmdbClient } from "./tmdb/client";
import { isValidImdbTitleId } from "./validation/imdb";

function routeTitleRequest(pathname: string): string | undefined {
  const match = /^\/titles\/([^/]+)$/.exec(pathname);
  return match?.[1];
}

function parseCacheMode(url: URL, env: ApiEnv): { ok: true; mode: TitleCacheMode } | { ok: false; response: Response } {
  const value = url.searchParams.get("cache");
  const mode = value === null || value === "" ? "normal" : value;

  if (mode !== "normal" && mode !== "refresh" && mode !== "bypass") {
    return { ok: false, response: errorResponse("invalid_cache_mode", "Invalid cache mode.", 400) };
  }

  if ((mode === "refresh" || mode === "bypass") && isProductionEnvironment(env.ENVIRONMENT) && !areCacheOverridesAllowed(env.ALLOW_CACHE_OVERRIDES)) {
    return { ok: false, response: errorResponse("cache_mode_not_allowed", "Cache override mode is not allowed.", 400) };
  }

  return { ok: true, mode };
}

async function handleRequest(request: Request, env: ApiEnv): Promise<Response> {
  if (request.method !== "GET") {
    return errorResponse("method_not_allowed", "Method not allowed.", 405, {
      headers: {
        allow: "GET",
      },
    });
  }

  const url = new URL(request.url);
  const { pathname } = url;
  const imdbId = routeTitleRequest(pathname);

  if (imdbId === undefined) {
    return errorResponse("route_not_found", "Route not found.", 404);
  }

  if (!isValidImdbTitleId(imdbId)) {
    return errorResponse("invalid_imdb_id", "Invalid IMDb ID.", 400);
  }

  const cacheMode = parseCacheMode(url, env);
  if (!cacheMode.ok) return cacheMode.response;

  const client = createTmdbClient({
    apiKey: env.TMDB_API_KEY,
    accessToken: env.TMDB_ACCESS_TOKEN,
    baseUrl: env.TMDB_BASE_URL,
    timeoutMs: tmdbTimeoutMs(env),
  });
  const result = await lookupTitle(imdbId, client, {
    cache: env.TITLE_CACHE,
    cacheMode: cacheMode.mode,
    cacheTtlSeconds: parseTitleCacheTtlSeconds(env.TITLE_CACHE_TTL_SECONDS),
  });

  if (result.ok) {
    return jsonResponse(result.title, 200);
  }

  if (result.error.kind === "not_found") {
    return errorResponse("title_not_found", "Title not found.", 404);
  }

  console.error("title lookup failed", { imdbId, errorKind: result.error.kind });
  return errorResponse("unexpected_failure", "Unexpected failure.", 500);
}

export default {
  async fetch(request: Request, env: ApiEnv = {}): Promise<Response> {
    try {
      return await handleRequest(request, env);
    } catch (error) {
      console.error("unexpected request failure", { error: error instanceof Error ? error.name : typeof error });
      return errorResponse("unexpected_failure", "Unexpected failure.", 500);
    }
  },
} satisfies ExportedHandler<ApiEnv>;
