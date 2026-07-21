import { describe, expect, it } from "vitest";
import { mapTmdbMovieToTitle, mapTmdbSeriesToTitle, type TmdbMovieForMapping, type TmdbSeriesForMapping } from "../src/tmdb/title-mapper";

const movieFixture: TmdbMovieForMapping = {
  external_ids: { imdb_id: "tt0133093" },
  title: "The Matrix",
  original_title: "The Matrix",
  overview: "A hacker discovers reality is a simulation.",
  release_date: "1999-03-31",
  runtime: 136,
  genres: [
    { id: 28, name: "Action" },
    { id: 878, name: "Science Fiction" },
  ],
  vote_average: 8.2,
  vote_count: 25000,
  poster_path: "/matrix-poster.jpg",
  backdrop_path: "/matrix-backdrop.jpg",
  belongs_to_collection: {
    id: 2344,
    name: "The Matrix Collection",
    poster_path: "/collection-poster.jpg",
    backdrop_path: "/collection-backdrop.jpg",
    parts: [
      { id: 603, external_ids: { imdb_id: "tt0133093" }, title: "The Matrix", release_date: "1999-03-31", poster_path: "/matrix-poster.jpg", order: 0 },
      { id: 604, external_ids: { imdb_id: "tt0234215" }, title: "The Matrix Reloaded", release_date: "2003-05-15", poster_path: null, order: 1 },
    ],
  },
  credits: {
    cast: [
      { id: 6384, name: "Keanu Reeves", character: "Neo", profile_path: "/keanu.jpg", order: 0 },
      { id: 2975, name: "Laurence Fishburne", character: "Morpheus", profile_path: null, order: 1 },
    ],
    crew: [{ id: 9339, name: "Lana Wachowski", job: "Director", profile_path: "/lana.jpg" }],
  },
  images: {
    posters: [
      { file_path: "/poster-alt-1.jpg", width: 1000, height: 1500, iso_639_1: "en" },
      { file_path: "/poster-alt-2.jpg", width: 1000, height: 1500, iso_639_1: null },
      { file_path: "/poster-alt-3.jpg", width: 1000, height: 1500, iso_639_1: "es" },
      { file_path: "/poster-alt-4.jpg", width: 1000, height: 1500, iso_639_1: "fr" },
      { file_path: "/poster-alt-5.jpg", width: 1000, height: 1500, iso_639_1: "de" },
      { file_path: "/poster-alt-6.jpg", width: 1000, height: 1500, iso_639_1: "it" },
    ],
    backdrops: [{ file_path: "/backdrop-alt.jpg", width: 1920, height: 1080, iso_639_1: null }],
  },
  watch: {
    results: {
      US: {
        flatrate: [{ provider_id: 8, provider_name: "Netflix", logo_path: "/netflix.jpg" }],
        rent: [{ provider_id: 2, provider_name: "Apple TV", logo_path: "/apple.jpg" }],
        buy: [{ provider_id: 10, provider_name: "Amazon Video", logo_path: null }],
      },
    },
  },
};

const seriesFixture: TmdbSeriesForMapping = {
  external_ids: { imdb_id: "tt0944947" },
  name: "Game of Thrones",
  original_name: "Game of Thrones",
  overview: "Nine noble families fight for control of Westeros.",
  first_air_date: "2011-04-17",
  number_of_seasons: 8,
  seasons: [
    { id: 3624, season_number: 0, name: "Specials", overview: "Behind the scenes.", episode_count: 272, air_date: "2010-12-05", poster_path: "/got-specials.jpg" },
    { id: 3625, season_number: 1, name: "Season 1", overview: "Winter is coming.", episode_count: 10, air_date: "2011-04-17", poster_path: "/got-s1.jpg" },
    { id: 3626, season_number: 2, name: "Season 2", overview: "The War of the Five Kings.", episode_count: 10, air_date: "2012-04-01", poster_path: null },
  ],
  episode_run_time: [60],
  genres: [{ id: 18, name: "Drama" }],
  vote_average: 8.4,
  vote_count: 24000,
  poster_path: "/got-poster.jpg",
  backdrop_path: "/got-backdrop.jpg",
  created_by: [{ id: 9813, name: "David Benioff", profile_path: "/benioff.jpg" }],
  aggregate_credits: {
    cast: [
      {
        id: 22970,
        name: "Kit Harington",
        roles: [
          { character: "Jon Snow", episode_count: 62 },
          { character: "Aegon Targaryen", episode_count: 6 },
        ],
        total_episode_count: 62,
        profile_path: "/kit.jpg",
        order: 0,
      },
    ],
    crew: [{ id: 9813, name: "David Benioff", job: "Director", profile_path: "/benioff.jpg" }],
  },
  images: {
    posters: [{ file_path: "/got-poster-alt.jpg", width: 1000, height: 1500, iso_639_1: "en" }],
    backdrops: [{ file_path: "/got-backdrop-alt.jpg", width: 1920, height: 1080, iso_639_1: null }],
  },
  watch: { results: { GB: { flatrate: [{ provider_id: 29, provider_name: "Sky", logo_path: "/sky.jpg" }] } } },
};

describe("TMDB title mappers", () => {
  it("maps a movie fixture to the application-owned public title schema", () => {
    const title = mapTmdbMovieToTitle(movieFixture);

    expect(title).toMatchObject({
      imdbId: "tt0133093",
      type: "movie",
      title: "The Matrix",
      originalTitle: "The Matrix",
      overview: "A hacker discovers reality is a simulation.",
      release: { date: "1999-03-31", year: 1999 },
      runtime: { minutes: 136 },
      genres: ["Action", "Science Fiction"],
      rating: { average: 8.2, voteCount: 25000 },
      cast: [
        { id: "6384", name: "Keanu Reeves", roles: ["Neo"], episodeCount: null },
        { id: "2975", name: "Laurence Fishburne", roles: ["Morpheus"], episodeCount: null },
      ],
      crew: { directors: [{ id: "9339", name: "Lana Wachowski", roles: ["Director"] }], creators: [] },
      collection: {
        id: "2344",
        name: "The Matrix Collection",
        items: [
          { id: "603", imdbId: "tt0133093", title: "The Matrix", release: { date: "1999-03-31", year: 1999 }, order: 0 },
          { id: "604", imdbId: "tt0234215", title: "The Matrix Reloaded", release: { date: "2003-05-15", year: 2003 }, poster: null, order: 1 },
        ],
      },
      streamingProviders: {
        region: "US",
        stream: [{ id: "8", name: "Netflix" }],
        rent: [{ id: "2", name: "Apple TV" }],
        buy: [{ id: "10", name: "Amazon Video", logo: null }],
      },
    });
  });

  it("maps semantic artwork URLs, dimensions, collection artwork, provider logos, and image limits", () => {
    const title = mapTmdbMovieToTitle(movieFixture);

    expect(title.artwork.poster?.sizes.medium).toBe("https://image.tmdb.org/t/p/w342/matrix-poster.jpg");
    expect(title.artwork.backdrop?.sizes.large).toBe("https://image.tmdb.org/t/p/w1280/matrix-backdrop.jpg");
    expect(title.artwork.posters).toHaveLength(5);
    expect(title.artwork.posters[0]).toMatchObject({
      url: "https://image.tmdb.org/t/p/original/poster-alt-1.jpg",
      width: 1000,
      height: 1500,
      language: "en",
    });
    expect(title.collection?.poster?.sizes.small).toBe("https://image.tmdb.org/t/p/w185/collection-poster.jpg");
    expect(title.streamingProviders?.stream[0]?.logo?.sizes.thumbnail).toBe("https://image.tmdb.org/t/p/w45/netflix.jpg");
  });

  it("maps collection items with partial upstream data without crashing", () => {
    const title = mapTmdbMovieToTitle({
      external_ids: { imdb_id: "tt0000001" },
      belongs_to_collection: {
        id: 10,
        name: "Partial Collection",
        poster_path: null,
        backdrop_path: null,
        parts: [
          { id: 2, external_ids: null, title: null, original_title: "Fallback Title", release_date: "", poster_path: null, order: 2 },
          { id: 1, external_ids: { imdb_id: "tt0000002" }, title: "First", release_date: null, poster_path: "/first.jpg", order: 1 },
        ],
      },
      genres: [],
      credits: { cast: [], crew: [] },
      images: { posters: [], backdrops: [] },
    });

    expect(title.collection).toMatchObject({
      id: "10",
      items: [
        { id: "1", imdbId: "tt0000002", title: "First", release: { date: null, year: null }, order: 1 },
        { id: "2", imdbId: null, title: "Fallback Title", release: { date: null, year: null }, poster: null, order: 2 },
      ],
    });
    expect(title.collection?.items[0]?.poster?.sizes.small).toBe("https://image.tmdb.org/t/p/w185/first.jpg");
  });

  it("maps a series fixture using series-level aggregate credits and no collection", () => {
    const title = mapTmdbSeriesToTitle(seriesFixture, { providerRegion: "gb" });

    expect(title).toMatchObject({
      imdbId: "tt0944947",
      type: "series",
      title: "Game of Thrones",
      release: { date: "2011-04-17", year: 2011 },
      runtime: { minutes: 60 },
      cast: [
        {
          id: "22970",
          name: "Kit Harington",
          roles: ["Jon Snow", "Aegon Targaryen"],
          episodeCount: 62,
        },
      ],
      crew: {
        directors: [{ id: "9813", name: "David Benioff", roles: ["Director"] }],
        creators: [{ id: "9813", name: "David Benioff", roles: ["Creator"] }],
      },
      collection: null,
      seasonCount: 8,
      seasons: [
        { id: "3624", seasonNumber: 0, name: "Specials", episodeCount: 272, airDate: "2010-12-05", year: 2010, overview: "Behind the scenes." },
        { id: "3625", seasonNumber: 1, name: "Season 1", episodeCount: 10, airDate: "2011-04-17", year: 2011, overview: "Winter is coming." },
        { id: "3626", seasonNumber: 2, name: "Season 2", episodeCount: 10, airDate: "2012-04-01", year: 2012, overview: "The War of the Five Kings.", poster: null },
      ],
      streamingProviders: { region: "GB", stream: [{ id: "29", name: "Sky" }], rent: [], buy: [] },
    });
    expect(title.seasons?.[1]?.poster?.sizes.medium).toBe("https://image.tmdb.org/t/p/w342/got-s1.jpg");
  });

  it("maps partial series season data without crashing", () => {
    const title = mapTmdbSeriesToTitle({
      external_ids: { imdb_id: "tt0944947" },
      name: "Game of Thrones",
      number_of_seasons: null,
      seasons: [
        { id: 2, season_number: 2, name: null, overview: null, episode_count: null, air_date: "", poster_path: null },
        { id: 1, season_number: 1, name: "Season 1", air_date: null },
        { id: null, season_number: 3, name: "Invalid missing id" },
        { id: 4, season_number: null, name: "Invalid missing season number" },
      ],
      aggregate_credits: { cast: [], crew: [] },
      images: { posters: [], backdrops: [] },
    });

    expect(title).toMatchObject({
      type: "series",
      seasonCount: 2,
      seasons: [
        { id: "1", seasonNumber: 1, name: "Season 1", episodeCount: null, airDate: null, year: null, overview: null, poster: null },
        { id: "2", seasonNumber: 2, name: "", episodeCount: null, airDate: null, year: null, overview: null, poster: null },
      ],
      collection: null,
    });
  });

  it("does not crash when optional TMDB fields are missing or null", () => {
    const title = mapTmdbMovieToTitle({
      external_ids: { imdb_id: "tt0000001" },
      title: null,
      original_title: null,
      release_date: "",
      runtime: null,
      genres: null,
      vote_average: null,
      vote_count: null,
      credits: null,
      images: { posters: [{ file_path: null }], backdrops: null },
      watch: { results: {} },
    });

    expect(title).toEqual({
      imdbId: "tt0000001",
      type: "movie",
      title: "",
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
    });
    expect(title).not.toHaveProperty("seasons");
    expect(title).not.toHaveProperty("seasonCount");
  });
});
