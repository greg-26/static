export type TitleType = "movie" | "series";

export type SemanticImageSize = "thumbnail" | "small" | "medium" | "large" | "original";

export interface ImageAsset {
  url: string;
  sizes: Partial<Record<SemanticImageSize, string>>;
  width: number | null;
  height: number | null;
  language: string | null;
}

export interface PersonCredit {
  id: string;
  name: string;
  roles: string[];
  episodeCount: number | null;
  profile: ImageAsset | null;
}

export interface CrewCredits {
  directors: PersonCredit[];
  creators: PersonCredit[];
}

export interface CollectionSummary {
  id: string;
  name: string;
  poster: ImageAsset | null;
  backdrop: ImageAsset | null;
}

export interface StreamingProvider {
  id: string;
  name: string;
  logo: ImageAsset | null;
}

export interface StreamingProviders {
  region: string;
  stream: StreamingProvider[];
  rent: StreamingProvider[];
  buy: StreamingProvider[];
}

export interface TitleResponse {
  imdbId: string;
  type: TitleType;
  title: string;
  originalTitle: string | null;
  overview: string | null;
  release: {
    date: string | null;
    year: number | null;
  };
  runtime: {
    minutes: number | null;
  };
  genres: string[];
  rating: {
    average: number | null;
    voteCount: number;
  };
  cast: PersonCredit[];
  crew: CrewCredits;
  artwork: {
    poster: ImageAsset | null;
    backdrop: ImageAsset | null;
    posters: ImageAsset[];
    backdrops: ImageAsset[];
  };
  collection: CollectionSummary | null;
  streamingProviders: StreamingProviders | null;
}
