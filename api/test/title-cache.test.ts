import { describe, expect, it, vi } from "vitest";
import { readCachedTitle, readCachedTitleState, titleCacheKey, writeCachedTitle, type TitleCacheBinding } from "../src/cache/titleCache";
import type { TitleResponse } from "../src/models/title";

const title: TitleResponse = {
  imdbId: "tt0133093",
  type: "movie",
  title: "The Matrix",
  originalTitle: "The Matrix",
  overview: null,
  release: { date: "1999-03-31", year: 1999 },
  runtime: { minutes: 136 },
  genres: [],
  rating: { average: null, voteCount: 0 },
  cast: [],
  crew: { directors: [], creators: [] },
  artwork: { poster: null, backdrop: null, posters: [], backdrops: [] },
  collection: null,
  streamingProviders: null,
};

function cache(raw: string | null = null): TitleCacheBinding {
  return {
    get: vi.fn(async () => raw),
    put: vi.fn(async () => undefined),
  };
}

describe("title cache", () => {
  it("constructs versioned title cache keys", () => {
    expect(titleCacheKey("tt0133093")).toBe("title:tt0133093:v3");
  });

  it("varies cache keys by normalized language and country", () => {
    expect(titleCacheKey("tt0133093", { language: "es" })).toBe("title:tt0133093:v3:lang=es");
    expect(titleCacheKey("tt0133093", { country: "ES" })).toBe("title:tt0133093:v3:country=ES");
    expect(titleCacheKey("tt0133093", { language: "es", country: "ES" })).toBe("title:tt0133093:v3:lang=es:country=ES");
  });

  it("writes and reads fresh cached title envelopes", async () => {
    const binding = cache();
    await writeCachedTitle(binding, "tt0133093", title, 60, {}, 1_000);

    expect(binding.put).toHaveBeenCalledWith("title:tt0133093:v3", expect.any(String), { expirationTtl: 60 });

    const stored = vi.mocked(binding.put).mock.calls[0]?.[1] as string;
    const readBinding = cache(stored);
    await expect(readCachedTitle(readBinding, "tt0133093", {}, 30_000)).resolves.toEqual(title);
  });

  it("ignores corrupt cache entries", async () => {
    await expect(readCachedTitle(cache("not json"), "tt0133093", {}, 1_000)).resolves.toBeNull();
  });

  it("treats stale cache entries as misses", async () => {
    const binding = cache();
    await writeCachedTitle(binding, "tt0133093", title, 60, {}, 1_000);
    const stored = vi.mocked(binding.put).mock.calls[0]?.[1] as string;

    await expect(readCachedTitle(cache(stored), "tt0133093", {}, 62_000)).resolves.toBeNull();
  });

  it("exposes stale cache entries for normal-request upstream fallback", async () => {
    const binding = cache();
    await writeCachedTitle(binding, "tt0133093", title, 60, {}, 1_000);
    const stored = vi.mocked(binding.put).mock.calls[0]?.[1] as string;

    await expect(readCachedTitleState(cache(stored), "tt0133093", {}, 62_000)).resolves.toEqual({ status: "stale", title });
  });
});
