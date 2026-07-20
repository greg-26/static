import type { CollectionSummary, ImageAsset, PersonCredit, StreamingProvider, StreamingProviders, TitleResponse } from "../models/title";
import type {
  TmdbCreatedBy,
  TmdbCrewCredit,
  TmdbGenre,
  TmdbImage,
  TmdbMovieCastCredit,
  TmdbMovieForMapping,
  TmdbProvider,
  TmdbSeriesCastCredit,
  TmdbSeriesCastRole,
  TmdbSeriesForMapping,
  TmdbWatchProviders,
} from "./types";

export type { TmdbMovieForMapping, TmdbSeriesForMapping } from "./types";

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
const MAX_CAST = 10;
const MAX_POSTERS = 5;
const MAX_BACKDROPS = 5;

interface MapperOptions {
  providerRegion?: string;
}

export function mapTmdbMovieToTitle(movie: TmdbMovieForMapping, options: MapperOptions = {}): TitleResponse {
  return {
    imdbId: movie.external_ids?.imdb_id ?? "",
    type: "movie",
    title: movie.title ?? "",
    originalTitle: movie.original_title ?? null,
    overview: movie.overview ?? null,
    release: mapRelease(movie.release_date),
    runtime: { minutes: movie.runtime ?? null },
    genres: mapGenres(movie.genres),
    rating: mapRating(movie.vote_average, movie.vote_count),
    cast: mapMovieCast(movie.credits?.cast),
    crew: { directors: mapCrewByJob(movie.credits?.crew, "Director"), creators: [] },
    artwork: mapArtwork(movie.poster_path, movie.backdrop_path, movie.images),
    collection: mapCollection(movie.belongs_to_collection),
    streamingProviders: mapStreamingProviders(movie.watch, options.providerRegion),
  };
}

export function mapTmdbSeriesToTitle(series: TmdbSeriesForMapping, options: MapperOptions = {}): TitleResponse {
  return {
    imdbId: series.external_ids?.imdb_id ?? "",
    type: "series",
    title: series.name ?? "",
    originalTitle: series.original_name ?? null,
    overview: series.overview ?? null,
    release: mapRelease(series.first_air_date),
    runtime: { minutes: series.episode_run_time?.[0] ?? null },
    genres: mapGenres(series.genres),
    rating: mapRating(series.vote_average, series.vote_count),
    cast: mapSeriesCast(series.aggregate_credits?.cast),
    crew: {
      directors: mapCrewByJob(series.aggregate_credits?.crew, "Director"),
      creators: mapCreatedBy(series.created_by),
    },
    artwork: mapArtwork(series.poster_path, series.backdrop_path, series.images),
    collection: null,
    streamingProviders: mapStreamingProviders(series.watch, options.providerRegion),
  };
}

function mapRelease(date: string | null | undefined): TitleResponse["release"] {
  const cleanDate = date || null;
  const year = cleanDate?.match(/^\d{4}/)?.[0];
  return { date: cleanDate, year: year === undefined ? null : Number(year) };
}

function mapGenres(genres: TmdbGenre[] | null | undefined): string[] {
  return (genres ?? []).map((genre) => genre.name).filter((name) => name.length > 0);
}

function mapRating(average: number | null | undefined, voteCount: number | null | undefined): TitleResponse["rating"] {
  return { average: average ?? null, voteCount: voteCount ?? 0 };
}

function mapMovieCast(cast: TmdbMovieCastCredit[] | null | undefined): PersonCredit[] {
  return [...(cast ?? [])]
    .sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER))
    .slice(0, MAX_CAST)
    .map((credit) => ({
      id: String(credit.id),
      name: credit.name ?? "",
      roles: compact([credit.character]),
      episodeCount: null,
      profile: mapProfile(credit.profile_path),
    }));
}

function mapSeriesCast(cast: TmdbSeriesCastCredit[] | null | undefined): PersonCredit[] {
  return [...(cast ?? [])]
    .sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER))
    .slice(0, MAX_CAST)
    .map((credit) => ({
      id: String(credit.id),
      name: credit.name ?? "",
      roles: compact(credit.roles?.map((role) => role.character)),
      episodeCount: credit.total_episode_count ?? maxEpisodeCount(credit.roles),
      profile: mapProfile(credit.profile_path),
    }));
}

function mapCrewByJob(crew: TmdbCrewCredit[] | null | undefined, job: string): PersonCredit[] {
  const people = new Map<string, PersonCredit>();
  for (const credit of crew ?? []) {
    if (credit.job !== job) continue;
    const id = String(credit.id);
    const current = people.get(id);
    if (current) {
      current.roles = unique([...current.roles, job]);
    } else {
      people.set(id, { id, name: credit.name ?? "", roles: [job], episodeCount: null, profile: mapProfile(credit.profile_path) });
    }
  }
  return [...people.values()];
}

function mapCreatedBy(creators: TmdbCreatedBy[] | null | undefined): PersonCredit[] {
  return (creators ?? []).map((creator) => ({
    id: String(creator.id),
    name: creator.name ?? "",
    roles: ["Creator"],
    episodeCount: null,
    profile: mapProfile(creator.profile_path),
  }));
}

function mapArtwork(
  posterPath: string | null | undefined,
  backdropPath: string | null | undefined,
  images: { posters?: TmdbImage[] | null; backdrops?: TmdbImage[] | null } | null | undefined,
): TitleResponse["artwork"] {
  const posters = mapImages(images?.posters, "poster").slice(0, MAX_POSTERS);
  const backdrops = mapImages(images?.backdrops, "backdrop").slice(0, MAX_BACKDROPS);
  return {
    poster: posterPath ? mapImagePath(posterPath, "poster") : (posters[0] ?? null),
    backdrop: backdropPath ? mapImagePath(backdropPath, "backdrop") : (backdrops[0] ?? null),
    posters,
    backdrops,
  };
}

function mapCollection(collection: TmdbMovieForMapping["belongs_to_collection"]): CollectionSummary | null {
  if (!collection) return null;
  return {
    id: String(collection.id),
    name: collection.name ?? "",
    poster: collection.poster_path ? mapImagePath(collection.poster_path, "poster") : null,
    backdrop: collection.backdrop_path ? mapImagePath(collection.backdrop_path, "backdrop") : null,
  };
}

function mapStreamingProviders(watch: TmdbWatchProviders | null | undefined, providerRegion = "US"): StreamingProviders | null {
  const region = providerRegion.toUpperCase();
  const providers = watch?.results?.[region];
  if (!providers) return null;

  return {
    region,
    stream: mapProviderList(providers.flatrate),
    rent: mapProviderList(providers.rent),
    buy: mapProviderList(providers.buy),
  };
}

function mapProviderList(providers: TmdbProvider[] | null | undefined): StreamingProvider[] {
  return (providers ?? []).map((provider) => ({
    id: String(provider.provider_id),
    name: provider.provider_name ?? "",
    logo: provider.logo_path ? mapImagePath(provider.logo_path, "logo") : null,
  }));
}

function mapImages(images: TmdbImage[] | null | undefined, kind: "poster" | "backdrop"): ImageAsset[] {
  return (images ?? [])
    .filter((image) => Boolean(image.file_path))
    .map((image) => ({
      ...mapImagePath(image.file_path as string, kind),
      width: image.width ?? null,
      height: image.height ?? null,
      language: image.iso_639_1 ?? null,
    }));
}

function mapProfile(path: string | null | undefined): ImageAsset | null {
  return path ? mapImagePath(path, "profile") : null;
}

function mapImagePath(path: string, kind: "poster" | "backdrop" | "profile" | "logo"): ImageAsset {
  const sizes = imageSizes(kind, path);
  return { url: sizes.original, sizes, width: null, height: null, language: null };
}

function imageSizes(kind: "poster" | "backdrop" | "profile" | "logo", path: string): ImageAsset["sizes"] & { original: string } {
  const rawSizes = {
    poster: { thumbnail: "w92", small: "w185", medium: "w342", large: "w780", original: "original" },
    backdrop: { small: "w300", medium: "w780", large: "w1280", original: "original" },
    profile: { thumbnail: "w45", small: "w185", medium: "h632", original: "original" },
    logo: { thumbnail: "w45", small: "w92", medium: "w154", original: "original" },
  }[kind];

  return Object.fromEntries(Object.entries(rawSizes).map(([name, size]) => [name, `${TMDB_IMAGE_BASE_URL}/${size}${path}`])) as ImageAsset["sizes"] & { original: string };
}

function maxEpisodeCount(roles: TmdbSeriesCastRole[] | null | undefined): number | null {
  const counts = (roles ?? []).map((role) => role.episode_count).filter((count): count is number => typeof count === "number");
  return counts.length === 0 ? null : Math.max(...counts);
}

function compact(values: Array<string | null | undefined> | undefined): string[] {
  return unique((values ?? []).filter((value): value is string => Boolean(value)));
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}
