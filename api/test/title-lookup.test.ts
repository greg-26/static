import { describe, expect, it, vi } from "vitest";
import { writeCachedTitle, type TitleCacheBinding } from "../src/cache/titleCache";
import type { TitleResponse } from "../src/models/title";
import { lookupTitle, type TitleLookupClient } from "../src/services/titleLookup";
import type { TmdbTitleLookupResult } from "../src/tmdb/client";

function client(result: Awaited<ReturnType<TitleLookupClient["fetchTitleByImdbId"]>>): TitleLookupClient {
  return { fetchTitleByImdbId: vi.fn(async () => result) };
}

function cache(raw: string | null = null, putImpl: TitleCacheBinding["put"] = vi.fn(async () => undefined)): TitleCacheBinding {
  return {
    get: vi.fn(async () => raw),
    put: putImpl,
  };
}

const cachedTitle: TitleResponse = {
  imdbId: "tt0133093",
  type: "movie",
  title: "Cached Matrix",
  originalTitle: null,
  overview: null,
  release: { date: null, year: null },
  runtime: { minutes: null },
  genres: [],
  rating: { average: null, voteCount: 0 },
  cast: [],
  crew: { directors: [], creators: [] },
  artwork: { poster: null, backdrop: null, posters: [], backdrops: [] },
  collection: null,
  streamingProviders: null,
};

const movieResult: TmdbTitleLookupResult = {
  ok: true,
  mediaType: "movie",
  data: {
    external_ids: { imdb_id: "tt0133093" },
    title: "The Matrix",
    release_date: "1999-03-31",
    runtime: 136,
    genres: [],
    credits: { cast: [], crew: [] },
    images: { posters: [], backdrops: [] },
  },
};

describe("title lookup service", () => {
  it("normalizes successful movie lookups", async () => {
    const result = await lookupTitle(
      "tt0133093",
      client({
        ok: true,
        mediaType: "movie",
        data: {
          external_ids: { imdb_id: "tt0133093" },
          title: "The Matrix",
          release_date: "1999-03-31",
          runtime: 136,
          genres: [],
          credits: { cast: [], crew: [] },
          images: { posters: [], backdrops: [] },
        },
      }),
    );

    expect(result).toMatchObject({ ok: true, title: { imdbId: "tt0133093", type: "movie", title: "The Matrix" } });
  });

  it("normalizes successful series lookups", async () => {
    const result = await lookupTitle(
      "tt0944947",
      client({
        ok: true,
        mediaType: "series",
        data: {
          external_ids: { imdb_id: "tt0944947" },
          name: "Game of Thrones",
          first_air_date: "2011-04-17",
          episode_run_time: [60],
          genres: [],
          aggregate_credits: { cast: [], crew: [] },
          images: { posters: [], backdrops: [] },
        },
      }),
    );

    expect(result).toMatchObject({ ok: true, title: { imdbId: "tt0944947", type: "series", title: "Game of Thrones" } });
  });

  it("maps client not-found to service not-found", async () => {
    const result = await lookupTitle("tt0000000", client({ ok: false, error: { kind: "not_found", message: "Title not found." } }));

    expect(result).toEqual({ ok: false, error: { kind: "not_found" } });
  });

  it("maps client configuration and upstream errors to upstream failure", async () => {
    const result = await lookupTitle("tt0133093", client({ ok: false, error: { kind: "configuration", message: "Missing credentials." } }));

    expect(result).toEqual({ ok: false, error: { kind: "upstream_failure" } });
  });

  it("returns a fresh cache hit without calling the TMDB client", async () => {
    const binding = cache();
    await writeCachedTitle(binding, "tt0133093", cachedTitle, 60, {}, 1_000);
    const stored = vi.mocked(binding.put).mock.calls[0]?.[1] as string;
    const readBinding = cache(stored);
    const lookupClient = client(movieResult);

    const result = await lookupTitle("tt0133093", lookupClient, { cache: readBinding, cacheTtlSeconds: 60, now: 2_000 });

    expect(result).toEqual({ ok: true, title: cachedTitle });
    expect(lookupClient.fetchTitleByImdbId).not.toHaveBeenCalled();
  });

  it("writes successful cache misses", async () => {
    const binding = cache();

    const result = await lookupTitle("tt0133093", client(movieResult), { cache: binding, cacheTtlSeconds: 60, now: 1_000 });

    expect(result).toMatchObject({ ok: true, title: { title: "The Matrix" } });
    expect(binding.get).toHaveBeenCalledWith("title:tt0133093:v1");
    expect(binding.put).toHaveBeenCalledWith("title:tt0133093:v1", expect.any(String), { expirationTtl: 60 });
  });

  it("passes localized request context to TMDB and localized cache keys", async () => {
    const binding = cache();
    const lookupClient = client({
      ok: true,
      mediaType: "movie",
      data: {
        external_ids: { imdb_id: "tt0133093" },
        title: "Matrix",
        genres: [],
        credits: { cast: [], crew: [] },
        images: { posters: [], backdrops: [] },
        watch: { results: { ES: { flatrate: [{ provider_id: 8, provider_name: "Netflix", logo_path: null }] } } },
      },
    });

    const result = await lookupTitle("tt0133093", lookupClient, { cache: binding, language: "es", country: "ES", cacheTtlSeconds: 60, now: 1_000 });

    expect(result).toMatchObject({ ok: true, title: { title: "Matrix", streamingProviders: { region: "ES", stream: [{ id: "8", name: "Netflix" }] } } });
    expect(lookupClient.fetchTitleByImdbId).toHaveBeenCalledWith("tt0133093", { language: "es", country: "ES" });
    expect(binding.get).toHaveBeenCalledWith("title:tt0133093:v1:lang=es:country=ES");
    expect(binding.put).toHaveBeenCalledWith("title:tt0133093:v1:lang=es:country=ES", expect.any(String), { expirationTtl: 60 });
  });

  it("does not cache not-found or upstream failure results", async () => {
    const notFoundCache = cache();
    const notFound = await lookupTitle("tt0000000", client({ ok: false, error: { kind: "not_found", message: "Title not found." } }), { cache: notFoundCache });
    expect(notFound).toEqual({ ok: false, error: { kind: "not_found" } });
    expect(notFoundCache.put).not.toHaveBeenCalled();

    const failureCache = cache();
    const failure = await lookupTitle("tt0133093", client({ ok: false, error: { kind: "upstream_failure", message: "Bad upstream." } }), { cache: failureCache });
    expect(failure).toEqual({ ok: false, error: { kind: "upstream_failure" } });
    expect(failureCache.put).not.toHaveBeenCalled();
  });

  it("returns successful upstream result when cache writes fail", async () => {
    const binding = cache(null, vi.fn(async () => {
      throw new Error("KV down");
    }));
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const result = await lookupTitle("tt0133093", client(movieResult), { cache: binding });

    expect(result).toMatchObject({ ok: true, title: { title: "The Matrix" } });
    expect(console.error).toHaveBeenCalledWith("title cache write failed", expect.objectContaining({ imdbId: "tt0133093" }));
    vi.mocked(console.error).mockRestore();
  });

  it("falls back to upstream when the cache entry is corrupt", async () => {
    const binding = cache("not json");
    const lookupClient = client(movieResult);

    const result = await lookupTitle("tt0133093", lookupClient, { cache: binding });

    expect(result).toMatchObject({ ok: true, title: { title: "The Matrix" } });
    expect(binding.get).toHaveBeenCalledWith("title:tt0133093:v1");
    expect(lookupClient.fetchTitleByImdbId).toHaveBeenCalledWith("tt0133093", {});
    expect(binding.put).toHaveBeenCalled();
  });

  it("returns stale cached data for normal requests when TMDB fails", async () => {
    const binding = cache();
    await writeCachedTitle(binding, "tt0133093", cachedTitle, 60, {}, 1_000);
    const stored = vi.mocked(binding.put).mock.calls[0]?.[1] as string;
    const readBinding = cache(stored);
    const lookupClient = client({ ok: false, error: { kind: "upstream_failure", message: "Bad upstream." } });

    const result = await lookupTitle("tt0133093", lookupClient, { cache: readBinding, cacheTtlSeconds: 60, now: 62_000 });

    expect(result).toEqual({ ok: true, title: cachedTitle });
    expect(lookupClient.fetchTitleByImdbId).toHaveBeenCalledWith("tt0133093", {});
    expect(readBinding.put).not.toHaveBeenCalled();
  });

  it("does not return stale cached data for not-found, refresh, or bypass requests", async () => {
    const binding = cache();
    await writeCachedTitle(binding, "tt0133093", cachedTitle, 60, {}, 1_000);
    const stored = vi.mocked(binding.put).mock.calls[0]?.[1] as string;

    await expect(
      lookupTitle("tt0133093", client({ ok: false, error: { kind: "not_found", message: "Title not found." } }), { cache: cache(stored), cacheTtlSeconds: 60, now: 62_000 }),
    ).resolves.toEqual({ ok: false, error: { kind: "not_found" } });

    await expect(
      lookupTitle("tt0133093", client({ ok: false, error: { kind: "upstream_failure", message: "Bad upstream." } }), {
        cache: cache(stored),
        cacheMode: "refresh",
        cacheTtlSeconds: 60,
        now: 62_000,
      }),
    ).resolves.toEqual({ ok: false, error: { kind: "upstream_failure" } });

    await expect(
      lookupTitle("tt0133093", client({ ok: false, error: { kind: "upstream_failure", message: "Bad upstream." } }), {
        cache: cache(stored),
        cacheMode: "bypass",
        cacheTtlSeconds: 60,
        now: 62_000,
      }),
    ).resolves.toEqual({ ok: false, error: { kind: "upstream_failure" } });
  });

  it("refresh mode skips cache reads and replaces cached values", async () => {
    const binding = cache("not json");

    const result = await lookupTitle("tt0133093", client(movieResult), { cache: binding, cacheMode: "refresh", cacheTtlSeconds: 60 });

    expect(result).toMatchObject({ ok: true, title: { title: "The Matrix" } });
    expect(binding.get).not.toHaveBeenCalled();
    expect(binding.put).toHaveBeenCalledWith("title:tt0133093:v1", expect.any(String), { expirationTtl: 60 });
  });

  it("bypass mode skips cache reads and writes", async () => {
    const binding = cache();

    const result = await lookupTitle("tt0133093", client(movieResult), { cache: binding, cacheMode: "bypass" });

    expect(result).toMatchObject({ ok: true, title: { title: "The Matrix" } });
    expect(binding.get).not.toHaveBeenCalled();
    expect(binding.put).not.toHaveBeenCalled();
  });
});
