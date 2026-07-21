import { DEFAULT_TITLE_CACHE_TTL_SECONDS, readCachedTitleState, writeCachedTitle, type TitleCacheBinding, type TitleCacheMode } from "../cache/titleCache";
import type { TitleResponse } from "../models/title";
import type { TmdbTitleLookupResult } from "../tmdb/client";
import { mapTmdbMovieToTitle, mapTmdbSeriesToTitle } from "../tmdb/title-mapper";

export type TitleLookupErrorKind = "not_found" | "upstream_failure";

export type TitleLookupResult = { ok: true; title: TitleResponse } | { ok: false; error: { kind: TitleLookupErrorKind } };

export interface TitleLookupClient {
  fetchTitleByImdbId(imdbId: string): Promise<TmdbTitleLookupResult>;
}

export interface TitleLookupOptions {
  cache?: TitleCacheBinding;
  cacheMode?: TitleCacheMode;
  cacheTtlSeconds?: number;
  now?: number;
}

export async function lookupTitle(imdbId: string, client: TitleLookupClient, options: TitleLookupOptions = {}): Promise<TitleLookupResult> {
  const cacheMode = options.cacheMode ?? "normal";
  const now = options.now ?? Date.now();
  let staleTitle: TitleResponse | null = null;

  if (cacheMode === "normal") {
    const cachedTitle = await readCachedTitleState(options.cache, imdbId, now);
    if (cachedTitle.status === "fresh") return { ok: true, title: cachedTitle.title };
    if (cachedTitle.status === "stale") staleTitle = cachedTitle.title;
  }

  const result = await client.fetchTitleByImdbId(imdbId);

  if (!result.ok) {
    if (staleTitle && result.error.kind !== "not_found") return { ok: true, title: staleTitle };
    return { ok: false, error: { kind: result.error.kind === "not_found" ? "not_found" : "upstream_failure" } };
  }

  const title = result.mediaType === "movie" ? mapTmdbMovieToTitle(result.data) : mapTmdbSeriesToTitle(result.data);

  if (cacheMode !== "bypass") {
    try {
      await writeCachedTitle(options.cache, imdbId, title, options.cacheTtlSeconds ?? DEFAULT_TITLE_CACHE_TTL_SECONDS, now);
    } catch (error) {
      console.error("title cache write failed", { imdbId, error: error instanceof Error ? error.name : typeof error });
    }
  }

  return { ok: true, title };
}
