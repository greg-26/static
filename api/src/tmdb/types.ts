export type TmdbMediaType = "movie" | "series";

export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbImage {
  file_path?: string | null;
  width?: number | null;
  height?: number | null;
  iso_639_1?: string | null;
}

export interface TmdbPersonImage {
  profile_path?: string | null;
}

export interface TmdbMovieCastCredit extends TmdbPersonImage {
  id: number;
  name?: string | null;
  character?: string | null;
  order?: number | null;
}

export interface TmdbSeriesCastRole {
  character?: string | null;
  episode_count?: number | null;
}

export interface TmdbSeriesCastCredit extends TmdbPersonImage {
  id: number;
  name?: string | null;
  roles?: TmdbSeriesCastRole[] | null;
  total_episode_count?: number | null;
  order?: number | null;
}

export interface TmdbCrewCredit extends TmdbPersonImage {
  id: number;
  name?: string | null;
  job?: string | null;
  department?: string | null;
}

export interface TmdbCreatedBy extends TmdbPersonImage {
  id: number;
  name?: string | null;
}

export interface TmdbProvider {
  provider_id: number;
  provider_name?: string | null;
  logo_path?: string | null;
}

export interface TmdbProviderRegion {
  flatrate?: TmdbProvider[] | null;
  rent?: TmdbProvider[] | null;
  buy?: TmdbProvider[] | null;
}

export interface TmdbWatchProviders {
  results?: Record<string, TmdbProviderRegion | undefined> | null;
}

export interface TmdbMovieForMapping {
  id?: number;
  external_ids?: { imdb_id?: string | null } | null;
  title?: string | null;
  original_title?: string | null;
  overview?: string | null;
  release_date?: string | null;
  runtime?: number | null;
  genres?: TmdbGenre[] | null;
  vote_average?: number | null;
  vote_count?: number | null;
  poster_path?: string | null;
  backdrop_path?: string | null;
  belongs_to_collection?: TmdbCollectionDetails | null;
  credits?: { cast?: TmdbMovieCastCredit[] | null; crew?: TmdbCrewCredit[] | null } | null;
  images?: { posters?: TmdbImage[] | null; backdrops?: TmdbImage[] | null } | null;
  watch?: TmdbWatchProviders | null;
}

export interface TmdbSeriesForMapping {
  id?: number;
  external_ids?: { imdb_id?: string | null } | null;
  name?: string | null;
  original_name?: string | null;
  overview?: string | null;
  first_air_date?: string | null;
  episode_run_time?: number[] | null;
  genres?: TmdbGenre[] | null;
  vote_average?: number | null;
  vote_count?: number | null;
  poster_path?: string | null;
  backdrop_path?: string | null;
  created_by?: TmdbCreatedBy[] | null;
  aggregate_credits?: { cast?: TmdbSeriesCastCredit[] | null; crew?: TmdbCrewCredit[] | null } | null;
  images?: { posters?: TmdbImage[] | null; backdrops?: TmdbImage[] | null } | null;
  watch?: TmdbWatchProviders | null;
}

export interface TmdbFindResult {
  id: number;
}

export interface TmdbFindResponse {
  movie_results?: TmdbFindResult[] | null;
  tv_results?: TmdbFindResult[] | null;
}

export interface TmdbExternalIds {
  imdb_id?: string | null;
}

export interface TmdbCollectionPart {
  id: number;
  external_ids?: TmdbExternalIds | null;
  title?: string | null;
  original_title?: string | null;
  release_date?: string | null;
  poster_path?: string | null;
  order?: number | null;
}

export interface TmdbCollectionDetails {
  id: number;
  name?: string | null;
  poster_path?: string | null;
  backdrop_path?: string | null;
  parts?: TmdbCollectionPart[] | null;
}
