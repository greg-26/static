import { afterEach, describe, expect, it, vi } from "vitest";
import { writeCachedTitle, type TitleCacheBinding } from "../src/cache/titleCache";
import type { TitleResponse } from "../src/models/title";
import worker from "../src/index";

async function readJson(response: Response): Promise<unknown> {
  return response.json();
}

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

const env = { TMDB_API_KEY: "test-key", TMDB_BASE_URL: "https://tmdb.test/3" };

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

function kvCache(raw: string | null = null): TitleCacheBinding {
  return {
    get: vi.fn(async () => raw),
    put: vi.fn(async () => undefined),
  };
}

describe("worker routing and errors", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("returns a normalized movie response for a valid IMDb title ID", async () => {
    const fetcher = tmdbFetch([
      jsonResponse({ movie_results: [{ id: 603 }], tv_results: [] }),
      jsonResponse({
        id: 603,
        external_ids: { imdb_id: "tt0133093" },
        title: "The Matrix",
        original_title: "The Matrix",
        overview: "A hacker discovers reality is a simulation.",
        release_date: "1999-03-31",
        runtime: 136,
        genres: [{ id: 28, name: "Action" }],
        vote_average: 8.2,
        vote_count: 25000,
        credits: { cast: [{ id: 6384, name: "Keanu Reeves", character: "Neo", order: 0 }], crew: [] },
        images: { posters: [], backdrops: [] },
        "watch/providers": { results: { US: { flatrate: [] } } },
      }),
    ]);
    vi.stubGlobal("fetch", fetcher);

    const response = await worker.fetch(new Request("https://api.example.test/titles/tt0133093"), env);

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/json; charset=utf-8");
    expect(await readJson(response)).toMatchObject({
      imdbId: "tt0133093",
      type: "movie",
      title: "The Matrix",
      release: { date: "1999-03-31", year: 1999 },
      runtime: { minutes: 136 },
      genres: ["Action"],
      cast: [{ id: "6384", name: "Keanu Reeves", roles: ["Neo"] }],
    });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("returns a normalized series response for a valid IMDb title ID", async () => {
    const fetcher = tmdbFetch([
      jsonResponse({ movie_results: [], tv_results: [{ id: 1399 }] }),
      jsonResponse({
        id: 1399,
        external_ids: { imdb_id: "tt0944947" },
        name: "Game of Thrones",
        original_name: "Game of Thrones",
        overview: "Nine noble families fight for control of Westeros.",
        first_air_date: "2011-04-17",
        episode_run_time: [60],
        genres: [{ id: 18, name: "Drama" }],
        vote_average: 8.4,
        vote_count: 24000,
        aggregate_credits: { cast: [{ id: 22970, name: "Kit Harington", roles: [{ character: "Jon Snow", episode_count: 62 }], order: 0 }], crew: [] },
        images: { posters: [], backdrops: [] },
        "watch/providers": { results: { US: { flatrate: [] } } },
      }),
    ]);
    vi.stubGlobal("fetch", fetcher);

    const response = await worker.fetch(new Request("https://api.example.test/titles/tt0944947"), env);

    expect(response.status).toBe(200);
    expect(await readJson(response)).toMatchObject({
      imdbId: "tt0944947",
      type: "series",
      title: "Game of Thrones",
      runtime: { minutes: 60 },
      genres: ["Drama"],
      cast: [{ id: "22970", name: "Kit Harington", roles: ["Jon Snow"], episodeCount: 62 }],
      collection: null,
    });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it.each(["0133093", "tt", "tt0133093%2F.."])("returns 400 JSON for invalid IMDb ID %s before calling TMDB", async (imdbId) => {
    const fetcher = vi.fn() as unknown as typeof fetch;
    vi.stubGlobal("fetch", fetcher);

    const response = await worker.fetch(new Request(`https://api.example.test/titles/${imdbId}`), env);

    expect(response.status).toBe(400);
    expect(response.headers.get("content-type")).toBe("application/json; charset=utf-8");
    expect(await readJson(response)).toEqual({
      error: {
        code: "invalid_imdb_id",
        message: "Invalid IMDb ID.",
      },
    });
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("returns stable 404 JSON for a valid unknown IMDb title ID", async () => {
    const fetcher = tmdbFetch([jsonResponse({ movie_results: [], tv_results: [] })]);
    vi.stubGlobal("fetch", fetcher);

    const response = await worker.fetch(new Request("https://api.example.test/titles/tt0000000"), env);

    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toBe("application/json; charset=utf-8");
    expect(await readJson(response)).toEqual({
      error: {
        code: "title_not_found",
        message: "Title not found.",
      },
    });
  });

  it("returns stable 500 JSON for upstream failures without leaking TMDB details", async () => {
    const fetcher = tmdbFetch([jsonResponse({ status_message: "TMDB exploded" }, { status: 503 })]);
    vi.stubGlobal("fetch", fetcher);
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const response = await worker.fetch(new Request("https://api.example.test/titles/tt0133093"), env);

    expect(response.status).toBe(500);
    expect(response.headers.get("content-type")).toBe("application/json; charset=utf-8");
    expect(await readJson(response)).toEqual({
      error: {
        code: "unexpected_failure",
        message: "Unexpected failure.",
      },
    });
  });

  it("returns cached title responses without calling TMDB", async () => {
    const writer = kvCache();
    await writeCachedTitle(writer, "tt0133093", cachedTitle, 60, Date.now());
    const stored = vi.mocked(writer.put).mock.calls[0]?.[1] as string;
    const cache = kvCache(stored);
    const fetcher = vi.fn() as unknown as typeof fetch;
    vi.stubGlobal("fetch", fetcher);

    const response = await worker.fetch(new Request("https://api.example.test/titles/tt0133093"), { ...env, TITLE_CACHE: cache, TITLE_CACHE_TTL_SECONDS: "60" });

    expect(response.status).toBe(200);
    expect(await readJson(response)).toEqual(cachedTitle);
    expect(fetcher).not.toHaveBeenCalled();
    expect(cache.get).toHaveBeenCalledWith("title:tt0133093:v1");
  });

  it("rejects cache override modes in production by default", async () => {
    const fetcher = vi.fn() as unknown as typeof fetch;
    vi.stubGlobal("fetch", fetcher);

    const response = await worker.fetch(new Request("https://api.example.test/titles/tt0133093?cache=refresh"), { ...env, ENVIRONMENT: "production" });

    expect(response.status).toBe(400);
    expect(await readJson(response)).toEqual({
      error: {
        code: "cache_mode_not_allowed",
        message: "Cache override mode is not allowed.",
      },
    });
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("returns JSON for an unknown route", async () => {
    const response = await worker.fetch(new Request("https://api.example.test/unknown"), env);

    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toBe("application/json; charset=utf-8");
    expect(await readJson(response)).toEqual({
      error: {
        code: "route_not_found",
        message: "Route not found.",
      },
    });
  });

  it("returns deterministic JSON for an unsupported method", async () => {
    const response = await worker.fetch(new Request("https://api.example.test/titles/tt0133093", { method: "POST" }), env);

    expect(response.status).toBe(405);
    expect(response.headers.get("allow")).toBe("GET");
    expect(response.headers.get("content-type")).toBe("application/json; charset=utf-8");
    expect(await readJson(response)).toEqual({
      error: {
        code: "method_not_allowed",
        message: "Method not allowed.",
      },
    });
  });
});
