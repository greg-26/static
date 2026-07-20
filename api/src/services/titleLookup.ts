import type { TitleResponse } from "../models/title";
import type { TmdbTitleLookupResult } from "../tmdb/client";
import { mapTmdbMovieToTitle, mapTmdbSeriesToTitle } from "../tmdb/title-mapper";

export type TitleLookupErrorKind = "not_found" | "upstream_failure";

export type TitleLookupResult = { ok: true; title: TitleResponse } | { ok: false; error: { kind: TitleLookupErrorKind } };

export interface TitleLookupClient {
  fetchTitleByImdbId(imdbId: string): Promise<TmdbTitleLookupResult>;
}

export async function lookupTitle(imdbId: string, client: TitleLookupClient): Promise<TitleLookupResult> {
  const result = await client.fetchTitleByImdbId(imdbId);

  if (!result.ok) {
    return { ok: false, error: { kind: result.error.kind === "not_found" ? "not_found" : "upstream_failure" } };
  }

  return {
    ok: true,
    title: result.mediaType === "movie" ? mapTmdbMovieToTitle(result.data) : mapTmdbSeriesToTitle(result.data),
  };
}
