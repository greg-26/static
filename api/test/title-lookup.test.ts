import { describe, expect, it } from "vitest";
import { lookupTitle, type TitleLookupClient } from "../src/services/titleLookup";

function client(result: Awaited<ReturnType<TitleLookupClient["fetchTitleByImdbId"]>>): TitleLookupClient {
  return { fetchTitleByImdbId: async () => result };
}

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
});
