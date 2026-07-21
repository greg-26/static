import { describe, expect, it, vi } from "vitest";
import { createTmdbClient } from "../src/tmdb/client";

function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json" },
    ...init,
  });
}

function tmdbFetch(responses: Response[]): typeof fetch {
  return vi.fn(async () => {
    const response = responses.shift();
    if (!response) throw new Error("Unexpected fetch call");
    return response;
  }) as unknown as typeof fetch;
}

describe("TMDB client", () => {
  it("resolves an IMDb ID to movie raw detail data", async () => {
    const fetcher = tmdbFetch([
      jsonResponse({ movie_results: [{ id: 603 }], tv_results: [] }),
      jsonResponse({
        id: 603,
        title: "The Matrix",
        external_ids: { imdb_id: "tt0133093" },
        credits: { cast: [], crew: [] },
        images: { posters: [], backdrops: [] },
        "watch/providers": { results: { US: { flatrate: [] } } },
        belongs_to_collection: { id: 2344, name: "Matrix", poster_path: null, backdrop_path: null },
      }),
      jsonResponse({ id: 2344, name: "The Matrix Collection", poster_path: "/collection.jpg", backdrop_path: "/collection-bg.jpg" }),
    ]);

    const result = await createTmdbClient({ apiKey: "test-key", baseUrl: "https://tmdb.test/3", fetch: fetcher }).fetchTitleByImdbId("tt0133093");

    expect(result).toMatchObject({
      ok: true,
      mediaType: "movie",
      data: {
        id: 603,
        title: "The Matrix",
        external_ids: { imdb_id: "tt0133093" },
        watch: { results: { US: { flatrate: [] } } },
        belongs_to_collection: { id: 2344, name: "The Matrix Collection", poster_path: "/collection.jpg" },
      },
    });
    expect(fetcher).toHaveBeenCalledTimes(3);
    expect(new URL(String(vi.mocked(fetcher).mock.calls[0]?.[0])).pathname).toBe("/3/find/tt0133093");
    expect(new URL(String(vi.mocked(fetcher).mock.calls[1]?.[0])).searchParams.get("append_to_response")).toBe("credits,images,watch/providers,external_ids");
  });

  it("resolves an IMDb ID to series raw detail data", async () => {
    const fetcher = tmdbFetch([
      jsonResponse({ movie_results: [], tv_results: [{ id: 1399 }] }),
      jsonResponse({
        id: 1399,
        name: "Game of Thrones",
        external_ids: { imdb_id: "tt0944947" },
        aggregate_credits: { cast: [], crew: [] },
        images: { posters: [], backdrops: [] },
        "watch/providers": { results: { GB: { flatrate: [] } } },
      }),
    ]);

    const result = await createTmdbClient({ accessToken: "test-token", baseUrl: "https://tmdb.test/3", fetch: fetcher }).fetchTitleByImdbId("tt0944947");

    expect(result).toMatchObject({
      ok: true,
      mediaType: "series",
      data: {
        id: 1399,
        name: "Game of Thrones",
        watch: { results: { GB: { flatrate: [] } } },
      },
    });
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(new URL(String(vi.mocked(fetcher).mock.calls[1]?.[0])).searchParams.get("append_to_response")).toBe("aggregate_credits,images,watch/providers,external_ids");
    expect(vi.mocked(fetcher).mock.calls[0]?.[1]?.headers).toEqual({ authorization: "Bearer test-token" });
  });

  it("forwards language and region query params to supported TMDB requests", async () => {
    const fetcher = tmdbFetch([
      jsonResponse({ movie_results: [{ id: 603 }], tv_results: [] }),
      jsonResponse({
        id: 603,
        title: "Matrix",
        external_ids: { imdb_id: "tt0133093" },
        credits: { cast: [], crew: [] },
        images: { posters: [], backdrops: [] },
        "watch/providers": { results: { ES: { flatrate: [] } } },
        belongs_to_collection: { id: 2344, name: "Matrix", poster_path: null, backdrop_path: null },
      }),
      jsonResponse({ id: 2344, name: "Colección Matrix", poster_path: null, backdrop_path: null }),
    ]);

    const result = await createTmdbClient({ apiKey: "test-key", baseUrl: "https://tmdb.test/3", fetch: fetcher }).fetchTitleByImdbId("tt0133093", { language: "es", country: "ES" });

    expect(result).toMatchObject({ ok: true, mediaType: "movie", data: { title: "Matrix", belongs_to_collection: { name: "Colección Matrix" } } });
    const findUrl = new URL(String(vi.mocked(fetcher).mock.calls[0]?.[0]));
    const detailsUrl = new URL(String(vi.mocked(fetcher).mock.calls[1]?.[0]));
    const collectionUrl = new URL(String(vi.mocked(fetcher).mock.calls[2]?.[0]));
    expect(findUrl.searchParams.get("language")).toBe("es");
    expect(detailsUrl.searchParams.get("language")).toBe("es");
    expect(detailsUrl.searchParams.get("watch_region")).toBe("ES");
    expect(collectionUrl.searchParams.get("language")).toBe("es");
  });

  it("maps no TMDB result to not found", async () => {
    const fetcher = tmdbFetch([jsonResponse({ movie_results: [], tv_results: [] })]);

    const result = await createTmdbClient({ apiKey: "test-key", fetch: fetcher }).fetchTitleByImdbId("tt0000000");

    expect(result).toEqual({ ok: false, error: { kind: "not_found", message: "Title not found." } });
  });

  it("maps upstream non-2xx responses to an internal upstream failure", async () => {
    const fetcher = tmdbFetch([jsonResponse({ status_message: "bad upstream" }, { status: 503 })]);

    const result = await createTmdbClient({ apiKey: "secret-key", fetch: fetcher }).fetchTitleByImdbId("tt0133093");

    expect(result).toEqual({ ok: false, error: { kind: "upstream_failure", message: "TMDB request failed.", status: 503 } });
  });

  it("maps aborted fetches/timeouts to an internal upstream failure", async () => {
    const fetcher = vi.fn(
      (_url: RequestInfo | URL, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
        }),
    ) as unknown as typeof fetch;

    const result = await createTmdbClient({ apiKey: "test-key", timeoutMs: 1, fetch: fetcher }).fetchTitleByImdbId("tt0133093");

    expect(result).toEqual({ ok: false, error: { kind: "upstream_failure", message: "TMDB request failed.", cause: "AbortError" } });
  });

  it("keeps required movie data when optional collection detail fetch fails", async () => {
    const fetcher = tmdbFetch([
      jsonResponse({ movie_results: [{ id: 603 }], tv_results: [] }),
      jsonResponse({
        id: 603,
        title: "The Matrix",
        belongs_to_collection: { id: 2344, name: "Matrix", poster_path: null, backdrop_path: null },
      }),
      jsonResponse({ status_message: "temporary" }, { status: 500 }),
    ]);

    const result = await createTmdbClient({ apiKey: "test-key", fetch: fetcher }).fetchTitleByImdbId("tt0133093");

    expect(result).toMatchObject({
      ok: true,
      mediaType: "movie",
      data: { title: "The Matrix", belongs_to_collection: { id: 2344, name: "Matrix" } },
    });
  });

  it("reports missing TMDB credentials as a configuration failure before making upstream calls", async () => {
    const fetcher = vi.fn() as unknown as typeof fetch;

    const result = await createTmdbClient({ fetch: fetcher }).fetchTitleByImdbId("tt0133093");

    expect(result).toEqual({ ok: false, error: { kind: "configuration", message: "TMDB credentials are not configured." } });
    expect(fetcher).not.toHaveBeenCalled();
  });
});
