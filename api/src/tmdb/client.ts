import type { TmdbCollectionDetails, TmdbFindResponse, TmdbMovieForMapping, TmdbSeriesForMapping } from "./types";

export interface TmdbClientConfig {
  apiKey?: string;
  accessToken?: string;
  baseUrl?: string;
  timeoutMs?: number;
  fetch?: typeof fetch;
}

export type TmdbClientErrorKind = "configuration" | "not_found" | "upstream_failure";

export interface TmdbClientError {
  kind: TmdbClientErrorKind;
  message: string;
  status?: number;
  cause?: string;
}

export type TmdbTitleLookupResult =
  | { ok: true; mediaType: "movie"; data: TmdbMovieForMapping }
  | { ok: true; mediaType: "series"; data: TmdbSeriesForMapping }
  | { ok: false; error: TmdbClientError };

interface RequestOptions {
  optional?: boolean;
}

interface TmdbMovieDetailsResponse extends TmdbMovieForMapping {
  "watch/providers"?: TmdbMovieForMapping["watch"];
}

interface TmdbSeriesDetailsResponse extends TmdbSeriesForMapping {
  "watch/providers"?: TmdbSeriesForMapping["watch"];
}

const DEFAULT_TMDB_BASE_URL = "https://api.themoviedb.org/3";
const DEFAULT_TIMEOUT_MS = 5000;

export class TmdbClient {
  private readonly apiKey?: string;
  private readonly accessToken?: string;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly fetcher: typeof fetch;

  constructor(config: TmdbClientConfig) {
    this.apiKey = emptyToUndefined(config.apiKey);
    this.accessToken = emptyToUndefined(config.accessToken);
    this.baseUrl = (config.baseUrl ?? DEFAULT_TMDB_BASE_URL).replace(/\/$/, "");
    this.timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.fetcher = config.fetch ?? ((input, init) => fetch(input, init));
  }

  async fetchTitleByImdbId(imdbId: string): Promise<TmdbTitleLookupResult> {
    if (!this.apiKey && !this.accessToken) {
      return failure("configuration", "TMDB credentials are not configured.");
    }

    const resolved = await this.request<TmdbFindResponse>(`/find/${encodeURIComponent(imdbId)}`, {
      external_source: "imdb_id",
    });
    if (!resolved.ok) return resolved;

    const movieId = firstId(resolved.data.movie_results);
    if (movieId !== undefined) {
      return this.fetchMovie(movieId);
    }

    const seriesId = firstId(resolved.data.tv_results);
    if (seriesId !== undefined) {
      return this.fetchSeries(seriesId);
    }

    return failure("not_found", "Title not found.");
  }

  private async fetchMovie(movieId: number): Promise<TmdbTitleLookupResult> {
    const details = await this.request<TmdbMovieDetailsResponse>(`/movie/${movieId}`, {
      append_to_response: "credits,images,watch/providers,external_ids",
    });
    if (!details.ok) return details;

    const movie: TmdbMovieForMapping = {
      ...details.data,
      watch: details.data["watch/providers"] ?? details.data.watch ?? null,
    };

    if (movie.belongs_to_collection?.id !== undefined) {
      const collection = await this.request<TmdbCollectionDetails>(`/collection/${movie.belongs_to_collection.id}`, {}, { optional: true });
      if (collection.ok) {
        movie.belongs_to_collection = collection.data;
      }
    }

    return { ok: true, mediaType: "movie", data: movie };
  }

  private async fetchSeries(seriesId: number): Promise<TmdbTitleLookupResult> {
    const details = await this.request<TmdbSeriesDetailsResponse>(`/tv/${seriesId}`, {
      append_to_response: "aggregate_credits,images,watch/providers,external_ids",
    });
    if (!details.ok) return details;

    return {
      ok: true,
      mediaType: "series",
      data: {
        ...details.data,
        watch: details.data["watch/providers"] ?? details.data.watch ?? null,
      },
    };
  }

  private async request<T>(path: string, query: Record<string, string | number> = {}, options: RequestOptions = {}): Promise<{ ok: true; data: T } | { ok: false; error: TmdbClientError }> {
    const url = new URL(`${this.baseUrl}${path}`);
    for (const [key, value] of Object.entries(query)) {
      url.searchParams.set(key, String(value));
    }
    if (this.apiKey && !this.accessToken) {
      url.searchParams.set("api_key", this.apiKey);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await this.fetcher(url.toString(), {
        headers: this.accessToken === undefined ? undefined : { authorization: `Bearer ${this.accessToken}` },
        signal: controller.signal,
      });

      if (!response.ok) {
        if (response.status === 404) {
          return options.optional ? { ok: false, error: { kind: "not_found", message: "Optional TMDB resource not found." } } : failure("not_found", "Title not found.");
        }
        return failure("upstream_failure", "TMDB request failed.", response.status);
      }

      return { ok: true, data: (await response.json()) as T };
    } catch (error) {
      return failure("upstream_failure", "TMDB request failed.", undefined, error instanceof Error ? error.name : typeof error);
    } finally {
      clearTimeout(timeout);
    }
  }
}

export function createTmdbClient(config: TmdbClientConfig): TmdbClient {
  return new TmdbClient(config);
}

function firstId(results: Array<{ id: number }> | null | undefined): number | undefined {
  return results?.[0]?.id;
}

function failure(kind: TmdbClientErrorKind, message: string, status?: number, cause?: string): { ok: false; error: TmdbClientError } {
  return { ok: false, error: { kind, message, ...(status === undefined ? {} : { status }), ...(cause === undefined ? {} : { cause }) } };
}

function emptyToUndefined(value: string | undefined): string | undefined {
  return value?.trim() === "" ? undefined : value;
}
