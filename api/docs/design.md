Movie and Series Metadata API — High-Level Design

1. Summary

Extend the existing repository with a Cloudflare Worker that exposes a read-only metadata API for movies and television series.

Given an IMDb title ID such as:

tt0133093

the API will:

1. Validate the IMDb ID.
2. Check Cloudflare Workers KV for a cached normalized response.
3. Return cached data when available and fresh.
4. Otherwise resolve the IMDb ID through TMDB.
5. Determine whether the title is a movie or television series.
6. Retrieve the appropriate movie or series metadata.
7. Retrieve overall cast and crew information.
8. Retrieve movie or series artwork.
9. Retrieve collection or franchise information when available.
10. Retrieve country-specific streaming-provider availability.
11. Normalize the upstream data into an application-owned schema.
12. Cache the normalized response in Workers KV.
13. Return the normalized response to the frontend.

The existing frontend and the new backend will remain in the same Git repository but will be deployed as separate Cloudflare applications.

⸻

2. Goals

The implementation should:

* Run within Cloudflare’s free tier for normal development and personal-project usage.
* Be fully configurable and deployable using Cloudflare’s Wrangler CLI.
* Keep TMDB credentials out of the frontend.
* Support both movies and television series.
* Accept IMDb title IDs as the external identifier.
* Return stable application-owned response schemas.
* Cache metadata to reduce external API calls.
* Support explicit cache refresh and cache bypass during development.
* Return posters, backdrops, collection artwork, and cast profile images.
* Return overall series cast rather than cast from only the latest season.
* Return country-specific streaming-provider information.
* Support localization by language and region.
* Allow frontend and backend deployments to remain independent.
* Support local development without modifying production KV data.
* Be straightforward for developers, coding agents, and CI workflows to manage.

⸻

3. Non-goals

The first implementation will not:

* Scrape IMDb pages.
* Return or redistribute raw IMDb website content.
* Store the actual poster or backdrop files in Workers KV.
* Copy third-party artwork into Cloudflare R2.
* Proxy every image request through the Worker.
* Return a complete image catalogue with hundreds of images.
* Return movie or series logos.
* Implement user accounts or authentication.
* Persist user lists, ratings, watch history, or preferences.
* Introduce Cloudflare D1 unless application-owned relational data is later required.
* Guarantee real-time accuracy for streaming availability.
* Provide full-text title search initially.
* Retrieve complete image galleries for every actor.
* Use the latest season’s credits as the source of a series’ main cast.

⸻

4. Proposed architecture

┌─────────────────────────────────────────────────────┐
│ Git repository                                      │
│                                                     │
│  website/                                           │
│    Vue 3 frontend                                   │
│                                                     │
│  api/                                               │
│    Cloudflare Worker                                │
│                                                     │
│  packages/contracts/                                │
│    Shared TypeScript contracts                      │
└─────────────────────────────────────────────────────┘
              │                         │
              │ deploy                  │ deploy
              ▼                         ▼
┌────────────────────────┐   ┌──────────────────────────┐
│ www.example.com        │   │ api.example.com          │
│                        │   │                          │
│ Existing Vue frontend  │──▶│ Cloudflare Worker        │
└────────────────────────┘   └────────────┬─────────────┘
                                         │
                           ┌─────────────┴─────────────┐
                           ▼                           ▼
                 ┌───────────────────┐       ┌───────────────────┐
                 │ Workers KV        │       │ TMDB API          │
                 │                   │       │                   │
                 │ Normalized JSON   │       │ Metadata, images, │
                 │ cache             │       │ credits, providers│
                 └───────────────────┘       └───────────────────┘

⸻

5. Repository structure

Recommended structure:

repository/
├── website/
│   ├── src/
│   │   ├── services/
│   │   │   └── media-api.ts
│   │   └── ...
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── ...
│
├── api/
│   ├── src/
│   │   ├── index.ts
│   │   ├── router.ts
│   │   │
│   │   ├── handlers/
│   │   │   ├── get-title.ts
│   │   │   └── health.ts
│   │   │
│   │   ├── services/
│   │   │   ├── title-service.ts
│   │   │   ├── movie-service.ts
│   │   │   ├── series-service.ts
│   │   │   ├── tmdb-client.ts
│   │   │   ├── media-cache.ts
│   │   │   └── image-configuration-service.ts
│   │   │
│   │   ├── mappers/
│   │   │   ├── movie-mapper.ts
│   │   │   ├── series-mapper.ts
│   │   │   ├── person-mapper.ts
│   │   │   ├── collection-mapper.ts
│   │   │   ├── provider-mapper.ts
│   │   │   └── image-mapper.ts
│   │   │
│   │   ├── validation/
│   │   │   ├── imdb-id.ts
│   │   │   ├── language.ts
│   │   │   ├── region.ts
│   │   │   └── cache-mode.ts
│   │   │
│   │   ├── middleware/
│   │   │   ├── cors.ts
│   │   │   ├── error-handler.ts
│   │   │   └── request-id.ts
│   │   │
│   │   └── types/
│   │       ├── environment.ts
│   │       ├── cache.ts
│   │       └── tmdb.ts
│   │
│   ├── test/
│   │   ├── get-title.test.ts
│   │   ├── movie-service.test.ts
│   │   ├── series-service.test.ts
│   │   ├── media-cache.test.ts
│   │   └── fixtures/
│   │
│   ├── package.json
│   ├── tsconfig.json
│   ├── wrangler.jsonc
│   └── vitest.config.ts
│
├── packages/
│   └── contracts/
│       ├── src/
│       │   ├── media-title.ts
│       │   ├── movie.ts
│       │   ├── series.ts
│       │   ├── person.ts
│       │   ├── images.ts
│       │   ├── collection.ts
│       │   ├── providers.ts
│       │   ├── api-response.ts
│       │   ├── api-error.ts
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
│
├── package.json
└── README.md

The shared contracts package is optional but strongly recommended. It allows the frontend and backend to compile against the same TypeScript response definitions.

⸻

6. Deployment model

6.1 Frontend

Keep the current website/ deployment unchanged.

Possible frontend domains:

https://example.com
https://www.example.com

6.2 Backend

Deploy api/ as an independent Cloudflare Worker.

Recommended production domain:

https://api.example.com

Example api/wrangler.jsonc:

{
  "$schema": "../node_modules/wrangler/config-schema.json",
  "name": "ohana-media-api",
  "main": "src/index.ts",
  "compatibility_date": "2026-07-19",
  "routes": [
    {
      "pattern": "api.example.com",
      "custom_domain": true
    }
  ],
  "kv_namespaces": [
    {
      "binding": "MEDIA_CACHE",
      "id": "PRODUCTION_MEDIA_CACHE_NAMESPACE_ID"
    },
    {
      "binding": "CONFIG_CACHE",
      "id": "PRODUCTION_CONFIG_CACHE_NAMESPACE_ID"
    }
  ],
  "vars": {
    "ALLOWED_ORIGINS": "https://www.example.com",
    "DEFAULT_LANGUAGE": "es-ES",
    "DEFAULT_REGION": "ES",
    "CACHE_VERSION": "v1",
    "ALLOW_CACHE_OVERRIDE": "false"
  }
}

6.3 Why use a subdomain

Recommended:

https://api.example.com/v1/titles/tt0133093

Alternative:

https://www.example.com/api/v1/titles/tt0133093

The separate API subdomain is preferred because it:

* Separates frontend and backend deployments.
* Avoids conflicts with Vue SPA routing.
* Makes Worker logs and ownership clearer.
* Allows API-specific Cloudflare rules.
* Allows the backend to move independently later.
* Prevents backend-only changes from rebuilding the frontend.
* Provides a stable API base URL.

The main trade-off is that CORS must be configured explicitly.

⸻

7. Resource model

The API should use a common title endpoint that supports both movies and series.

GET /v1/titles/:imdbId

The response includes:

{
  "mediaType": "movie"
}

or:

{
  "mediaType": "series"
}

This avoids forcing the frontend to know whether an IMDb ID represents a movie or series before calling the API.

Internally, the service should route to either:

MovieService
SeriesService

after resolving the title through TMDB.

⸻

8. API design

8.1 Health endpoint

GET /health

Example:

{
  "status": "ok"
}

The health endpoint must not contact TMDB or Workers KV.

8.2 Get title by IMDb ID

GET /v1/titles/:imdbId

Example movie request:

GET /v1/titles/tt0133093?language=es-ES&region=ES

Example series request:

GET /v1/titles/tt0903747?language=es-ES&region=ES

Parameters:

Parameter	Location	Required	Description
imdbId	Path	Yes	IMDb title ID
language	Query	No	Metadata language, such as es-ES
region	Query	No	Country code used for streaming availability
cache	Query	No	Cache behaviour: default, refresh, or bypass

IMDb validation:

^tt[0-9]{7,10}$

The implementation must not assume IMDb IDs always contain exactly seven digits.

⸻

9. Common response envelope

{
  "data": {
    "imdbId": "tt0133093",
    "tmdbId": 603,
    "mediaType": "movie"
  },
  "meta": {
    "language": "es-ES",
    "region": "ES",
    "cache": "hit",
    "cachedAt": "2026-07-19T16:30:00.000Z",
    "expiresAt": "2026-07-26T16:30:00.000Z"
  }
}

Supported cache statuses:

hit
miss
refreshed
bypassed
stale

⸻

10. Movie response

Example normalized movie response:

{
  "data": {
    "imdbId": "tt0133093",
    "tmdbId": 603,
    "mediaType": "movie",
    "title": "Matrix",
    "originalTitle": "The Matrix",
    "overview": "A computer hacker learns...",
    "tagline": "Welcome to the Real World.",
    "releaseDate": "1999-03-30",
    "year": 1999,
    "runtimeMinutes": 136,
    "originalLanguage": "en",
    "status": "Released",
    "genres": [
      {
        "id": 28,
        "name": "Acción"
      }
    ],
    "images": {
      "poster": {},
      "backdrop": {},
      "alternativePosters": [],
      "alternativeBackdrops": []
    },
    "cast": [],
    "directors": [],
    "collection": {
      "id": 2344,
      "name": "The Matrix Collection",
      "poster": {},
      "backdrop": {}
    },
    "watchProviders": {
      "region": "ES",
      "link": "https://...",
      "subscription": [],
      "rent": [],
      "buy": [],
      "free": [],
      "ads": []
    }
  },
  "meta": {
    "language": "es-ES",
    "region": "ES",
    "cache": "hit"
  }
}

⸻

11. Series response

Example normalized series response:

{
  "data": {
    "imdbId": "tt0903747",
    "tmdbId": 1396,
    "mediaType": "series",
    "title": "Breaking Bad",
    "originalTitle": "Breaking Bad",
    "overview": "A chemistry teacher diagnosed with cancer...",
    "tagline": "All Hail the King.",
    "firstAirDate": "2008-01-20",
    "lastAirDate": "2013-09-29",
    "year": 2008,
    "numberOfSeasons": 5,
    "numberOfEpisodes": 62,
    "episodeRuntimeMinutes": [45, 47],
    "originalLanguage": "en",
    "status": "Ended",
    "inProduction": false,
    "genres": [
      {
        "id": 18,
        "name": "Drama"
      }
    ],
    "images": {
      "poster": {},
      "backdrop": {},
      "alternativePosters": [],
      "alternativeBackdrops": []
    },
    "cast": [],
    "creators": [],
    "collection": null,
    "watchProviders": {
      "region": "ES",
      "link": "https://...",
      "subscription": [],
      "rent": [],
      "buy": [],
      "free": [],
      "ads": []
    }
  },
  "meta": {
    "language": "es-ES",
    "region": "ES",
    "cache": "hit"
  }
}

⸻

12. Series cast requirements

12.1 Overall-series cast

For television series, the cast must represent the overall series.

The implementation must not use:

* The latest season’s credits.
* The latest episode’s credits.
* A randomly selected season.
* Only the cast returned for the currently airing season.

The series service should use the TMDB television-series aggregate credits resource where available.

Conceptually:

TV series
   ↓
Aggregate credits
   ↓
Overall series cast and crew

This is important because a latest-season cast can omit:

* Major actors from previous seasons.
* Series leads whose characters have left.
* Important recurring actors.
* Actors whose credit is attached to earlier episodes or seasons.

12.2 Cast ranking

Series cast should be ranked using overall-series participation.

Recommended ranking factors:

1. Aggregate credit order.
2. Number of episodes credited.
3. Importance of roles.
4. Upstream popularity or credit metadata as a secondary signal.

The normalized cast member should include:

export interface SeriesCastMember {
  personId: number;
  name: string;
  characters: Array<{
    name: string;
    episodeCount: number;
  }>;
  totalEpisodeCount: number;
  order: number;
  profile: PersonImage | null;
}

Example:

{
  "personId": 17419,
  "name": "Bryan Cranston",
  "characters": [
    {
      "name": "Walter White",
      "episodeCount": 62
    }
  ],
  "totalEpisodeCount": 62,
  "order": 0,
  "profile": {
    "path": "/example.jpg",
    "urls": {
      "small": "https://image.tmdb.org/...",
      "medium": "https://image.tmdb.org/...",
      "original": "https://image.tmdb.org/..."
    }
  }
}

12.3 Series creators and crew

Return the series creators separately:

export interface SeriesCreator {
  personId: number;
  name: string;
  profile: PersonImage | null;
}

Do not force the frontend to derive creators from raw crew roles.

Additional aggregate crew data may be added later when needed.

12.4 Cast limits

A series may contain a very large cast.

Recommended default:

Maximum cast members returned: 30

The primary series cast should be selected based on overall-series importance, not recency.

A future dedicated endpoint can expose more:

GET /v1/titles/:imdbId/cast?limit=100

This is not required for the first implementation.

⸻

13. Movie cast requirements

For movies, return the movie’s credits.

Recommended cast limit:

Maximum cast members returned: 30

Normalized movie cast member:

export interface MovieCastMember {
  personId: number;
  name: string;
  character: string | null;
  order: number;
  profile: PersonImage | null;
}

Return directors separately:

export interface Director {
  personId: number;
  name: string;
  profile: PersonImage | null;
}

⸻

14. Image requirements

The API should return images needed to enrich the frontend without returning an unlimited gallery.

Required image types:

* Primary poster
* Primary backdrop
* Alternative posters
* Alternative backdrops
* Collection poster
* Collection backdrop
* Cast profile image
* Creator or director profile image

Movie and series logos are explicitly excluded.

14.1 Image schema

export interface ImageUrls {
  thumbnail?: string;
  small?: string;
  medium?: string;
  large?: string;
  original: string;
}
export interface MediaImage {
  path: string;
  width: number;
  height: number;
  aspectRatio: number;
  language: string | null;
  voteAverage: number;
  voteCount: number;
  urls: ImageUrls;
}
export interface MediaImages {
  poster: MediaImage | null;
  backdrop: MediaImage | null;
  alternativePosters: MediaImage[];
  alternativeBackdrops: MediaImage[];
}

14.2 Example

{
  "images": {
    "poster": {
      "path": "/poster.jpg",
      "width": 1000,
      "height": 1500,
      "aspectRatio": 0.667,
      "language": "es",
      "voteAverage": 5.4,
      "voteCount": 12,
      "urls": {
        "thumbnail": "https://image.tmdb.org/t/p/w185/poster.jpg",
        "small": "https://image.tmdb.org/t/p/w342/poster.jpg",
        "medium": "https://image.tmdb.org/t/p/w500/poster.jpg",
        "large": "https://image.tmdb.org/t/p/w780/poster.jpg",
        "original": "https://image.tmdb.org/t/p/original/poster.jpg"
      }
    },
    "backdrop": {
      "path": "/backdrop.jpg",
      "width": 1920,
      "height": 1080,
      "aspectRatio": 1.778,
      "language": null,
      "voteAverage": 5.2,
      "voteCount": 8,
      "urls": {
        "small": "https://image.tmdb.org/t/p/w780/backdrop.jpg",
        "medium": "https://image.tmdb.org/t/p/w1280/backdrop.jpg",
        "original": "https://image.tmdb.org/t/p/original/backdrop.jpg"
      }
    },
    "alternativePosters": [],
    "alternativeBackdrops": []
  }
}

14.3 Primary image selection

For movies:

* Primary poster should normally correspond to the movie’s poster_path.
* Primary backdrop should normally correspond to the movie’s backdrop_path.

For television series:

* Primary poster should normally correspond to the series’ poster_path.
* Primary backdrop should normally correspond to the series’ backdrop_path.

The backend should ensure the selected primary image is included even when alternative-image limits are applied.

14.4 Language handling

Image retrieval should consider:

1. Requested language.
2. Title original language.
3. Language-neutral images.

Example request:

GET /v1/titles/tt0133093?language=es-ES&region=ES

Derived image languages:

Requested language: es
Original language: en
Neutral images: null

Conceptual upstream option:

include_image_language=es,en,null

Language-neutral backdrops are especially important because many backdrops contain no text.

14.5 Response limits

Recommended defaults:

Alternative posters:   maximum 10
Alternative backdrops: maximum 10

There is no logo array.

Images should be ranked by:

1. Requested-language relevance.
2. Language-neutral suitability.
3. Original-language relevance.
4. Vote average.
5. Vote count.
6. Resolution.

14.6 Actual image delivery

The API caches and returns:

* Image paths.
* Dimensions.
* Language.
* Vote metadata.
* Generated image URLs.

The frontend downloads actual image files directly from TMDB’s image CDN.

The Worker must not initially:

* Download images into KV.
* Copy images into R2.
* Proxy normal poster or backdrop requests.
* Transform every image through the backend.

This avoids unnecessary bandwidth, Worker requests, storage, and complexity.

⸻

15. Image configuration

TMDB image responses contain file paths rather than permanent self-contained URLs.

The backend should maintain a small image-configuration service responsible for resolving:

secure_base_url
poster_sizes
backdrop_sizes
profile_sizes

Logo sizes are not required.

Suggested cache key:

tmdb-image-config:v1

Suggested freshness:

7 days

Suggested stale fallback:

30 days

The backend should expose semantic sizes to the frontend rather than raw provider-specific size codes.

Posters

thumbnail → approximately 185 px wide
small     → approximately 342 px wide
medium    → approximately 500 px wide
large     → approximately 780 px wide
original  → original

Backdrops

small     → approximately 780 px wide
medium    → approximately 1280 px wide
original  → original

Profiles

small     → approximately 185 px wide
medium    → approximately 342 px wide
original  → original

The image mapper should choose the closest supported upstream size.

⸻

16. Collections and franchises

16.1 Movie collections

When a movie belongs to a TMDB collection, return:

export interface MediaCollection {
  id: number;
  name: string;
  poster: MediaImage | null;
  backdrop: MediaImage | null;
  parts?: CollectionPart[];
}

Minimum collection response:

{
  "collection": {
    "id": 2344,
    "name": "The Matrix Collection",
    "poster": {
      "path": "/collection-poster.jpg",
      "urls": {
        "small": "https://image.tmdb.org/...",
        "medium": "https://image.tmdb.org/...",
        "original": "https://image.tmdb.org/..."
      }
    },
    "backdrop": {
      "path": "/collection-backdrop.jpg",
      "urls": {
        "small": "https://image.tmdb.org/...",
        "medium": "https://image.tmdb.org/...",
        "original": "https://image.tmdb.org/..."
      }
    }
  }
}

Collection artwork is required when available.

16.2 Collection parts

The initial version may return only collection identity and artwork.

A later extension may return collection parts:

export interface CollectionPart {
  tmdbId: number;
  mediaType: "movie";
  title: string;
  releaseDate: string | null;
  year: number | null;
  poster: MediaImage | null;
}

Possible future endpoint:

GET /v1/collections/:tmdbCollectionId

16.3 Series collections

TMDB movie collections and television-series grouping are not necessarily modeled identically.

For the initial version:

* Movie collections should be returned when present.
* Series should return collection: null unless the chosen upstream data provides a clearly equivalent collection or franchise relationship.
* Do not manufacture a collection from seasons.
* Do not treat seasons as collection entries.
* Do not assume that multiple related series share a collection unless the upstream provider explicitly identifies the relationship.

A future franchise model may support cross-media relationships separately.

⸻

17. Streaming providers

Return region-specific availability.

Example:

{
  "watchProviders": {
    "region": "ES",
    "link": "https://...",
    "subscription": [
      {
        "providerId": 8,
        "name": "Netflix",
        "logoPath": "/provider.jpg",
        "logoUrl": "https://image.tmdb.org/...",
        "displayPriority": 0
      }
    ],
    "rent": [],
    "buy": [],
    "free": [],
    "ads": []
  }
}

Supported groups:

subscription
rent
buy
free
ads

The API should use the request’s region value:

GET /v1/titles/tt0133093?region=ES

Provider availability should be treated as informational and potentially stale.

The frontend must display any required attribution associated with this data.

⸻

18. Upstream provider workflow

18.1 Initial IMDb resolution

Use the IMDb ID to resolve the TMDB entity.

Conceptual flow:

IMDb ID
   ↓
TMDB find-by-external-ID
   ↓
Movie result or TV result
   ↓
Media-specific retrieval workflow

Possible outcomes:

movie
tv
not found
ambiguous

The implementation should fail explicitly if the upstream response cannot be resolved to one supported title type.

18.2 Movie retrieval

For a movie, retrieve:

* Movie details.
* Credits.
* Images.
* Watch providers.
* Collection identity and artwork when present.

Optional later resources:

* Videos.
* Recommendations.
* Release-date certifications.
* Similar titles.

18.3 Series retrieval

For a television series, retrieve:

* Series details.
* Aggregate credits for the overall series.
* Images.
* Watch providers.
* Creators.
* Basic season counts and episode counts.

Do not retrieve the latest season’s credits as the main cast source.

Do not use a single season’s cast unless implementing a future season-specific endpoint.

⸻

19. Cache design

19.1 Storage

Use Workers KV for normalized API responses.

Binding:

export interface Env {
  MEDIA_CACHE: KVNamespace;
  CONFIG_CACHE: KVNamespace;
  TMDB_ACCESS_TOKEN: string;
  ALLOWED_ORIGINS: string;
  DEFAULT_LANGUAGE: string;
  DEFAULT_REGION: string;
  CACHE_VERSION: string;
  ALLOW_CACHE_OVERRIDE: string;
  CACHE_OVERRIDE_TOKEN?: string;
}

19.2 Cache key

Cache keys must include values that materially affect the response:

title:{version}:{imdbId}:{language}:{region}

Example:

title:v1:tt0133093:es-ES:ES

The key deliberately includes:

* Schema version.
* IMDb ID.
* Language.
* Region.

This prevents mixing:

* Spanish metadata with English metadata.
* Spanish provider availability with US provider availability.
* Old response shapes with new response shapes.

19.3 Cache envelope

{
  "value": {
    "imdbId": "tt0133093",
    "mediaType": "movie",
    "title": "Matrix"
  },
  "cachedAt": "2026-07-19T16:30:00.000Z",
  "freshUntil": "2026-07-26T16:30:00.000Z",
  "staleUntil": "2026-08-19T16:30:00.000Z",
  "schemaVersion": 1
}

19.4 Freshness policy

Recommended first implementation:

Data	Fresh period	Stale fallback
Core movie metadata	7 days	30 days
Core series metadata	7 days	30 days
Movie credits	7 days	30 days
Series aggregate credits	7 days	30 days
Posters and backdrops	7 days	30 days
Collection artwork	7 days	30 days
Watch providers	24 hours	7 days
Not-found result	6 hours	None
TMDB image configuration	7 days	30 days

For simplicity, the first version may cache the complete normalized title response as one object.

A later optimization may split:

title-core:v1:{imdbId}:{language}
title-providers:v1:{imdbId}:{region}
title-images:v1:{imdbId}:{language}

Do not introduce split caching until it provides a measurable benefit.

19.5 Negative caching

Cache confirmed not-found results briefly.

Suggested key:

title-not-found:v1:{imdbId}

Suggested TTL:

6 hours

Do not cache transient upstream errors as not-found responses.

19.6 Stale-if-error

For normal requests:

1. Return fresh cache when available.
2. When stale, try to refresh from TMDB.
3. Store and return fresh data if successful.
4. Return stale cached data if the upstream request fails.
5. Mark the response:

{
  "meta": {
    "cache": "stale"
  }
}

This protects the frontend from temporary upstream outages.

⸻

20. Explicit cache control

The API must support explicit cache behaviour for development and diagnostics.

Supported values:

default
refresh
bypass

20.1 Default

GET /v1/titles/tt0133093

Behaviour:

Read cache
   ├── Fresh → return cache
   ├── Stale → try refresh, with stale fallback
   └── Missing → call upstream and cache result

20.2 Refresh

GET /v1/titles/tt0133093?cache=refresh

Behaviour:

Skip cached response
   ↓
Call upstream
   ↓
Normalize response
   ↓
Replace cache entry
   ↓
Return fresh response

Use this during development when:

* Mapping logic has changed.
* Image selection logic has changed.
* Series aggregate cast logic has changed.
* The upstream record has changed.
* The cached response may contain an older schema.

Response metadata:

{
  "meta": {
    "cache": "refreshed"
  }
}

20.3 Bypass

GET /v1/titles/tt0133093?cache=bypass

Behaviour:

Skip cache read
   ↓
Call upstream
   ↓
Normalize response
   ↓
Do not write cache
   ↓
Return response

Use this when testing:

* Upstream behaviour.
* Cache write logic.
* Mapper output without mutating cache.
* Error behaviour.

Response metadata:

{
  "meta": {
    "cache": "bypassed"
  }
}

20.4 Cache override failures

For cache=refresh:

* Return the new response when upstream succeeds.
* Return an upstream error when upstream fails.
* Do not silently return stale data.
* Do not overwrite the old cache after failure.

For cache=bypass:

* Always return the live upstream result or upstream error.
* Never fall back to cached data.
* Never write to cache.

Strict behaviour makes these options useful for testing.

20.5 Production protection

Cache overrides should be freely enabled only in:

local
staging

Production should default to:

ALLOW_CACHE_OVERRIDE=false

When disabled, a request such as:

GET /v1/titles/tt0133093?cache=refresh

should return:

403 Forbidden
{
  "error": {
    "code": "CACHE_OVERRIDE_NOT_ALLOWED",
    "message": "Cache overrides are not enabled in this environment.",
    "requestId": "01J..."
  }
}

If operational production refreshes are required, protect them with:

X-Cache-Override-Token: <secret>

Store the expected value using:

npx wrangler secret put CACHE_OVERRIDE_TOKEN

The override token must never be exposed to the frontend.

20.6 HTTP cache interaction

Override requests must also bypass Cloudflare’s HTTP response cache.

Responses should include:

Cache-Control: no-store

Normal requests may use:

Cache-Control: public, max-age=300, s-maxage=3600

⸻

21. Error response

Use a stable error structure:

{
  "error": {
    "code": "INVALID_IMDB_ID",
    "message": "The IMDb ID must use the tt1234567 format.",
    "requestId": "01J..."
  }
}

Suggested codes:

INVALID_IMDB_ID
INVALID_LANGUAGE
INVALID_REGION
INVALID_CACHE_MODE
CACHE_OVERRIDE_NOT_ALLOWED
TITLE_NOT_FOUND
UNSUPPORTED_MEDIA_TYPE
UPSTREAM_UNAVAILABLE
UPSTREAM_RATE_LIMITED
METHOD_NOT_ALLOWED
INTERNAL_ERROR

Suggested HTTP statuses:

Situation	Status
Invalid request	400
Title not found	404
Cache override forbidden	403
Unsupported method	405
Upstream unavailable	502
Upstream rate-limited	503
Unexpected error	500

Never expose:

* TMDB credentials.
* Raw authorization headers.
* Stack traces.
* Raw upstream response bodies.
* Internal exception details.

⸻

22. CORS

Because the API is on another subdomain, configure explicit CORS.

Production:

Access-Control-Allow-Origin: https://www.example.com
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
Vary: Origin

Requirements:

* Do not reflect arbitrary origins.
* Do not use * if private endpoints or credentials are later introduced.
* Handle OPTIONS without calling KV or TMDB.
* Allow local origins during development.

Possible development origins:

http://localhost:5173
http://127.0.0.1:5173

⸻

23. Secrets and configuration

Secrets

Store the TMDB access token as a Worker secret:

cd api
npx wrangler secret put TMDB_ACCESS_TOKEN

The token must never be:

* Committed to Git.
* Added to frontend environment variables.
* Included in wrangler.jsonc.
* Logged.
* Returned in errors.

Non-secret variables

Use Wrangler variables for:

ALLOWED_ORIGINS
DEFAULT_LANGUAGE
DEFAULT_REGION
CACHE_VERSION
ALLOW_CACHE_OVERRIDE
LOG_LEVEL

Local development secrets

Use an ignored file such as:

api/.dev.vars

Example:

TMDB_ACCESS_TOKEN=local-development-token
ALLOWED_ORIGINS=http://localhost:5173
DEFAULT_LANGUAGE=es-ES
DEFAULT_REGION=ES
CACHE_VERSION=v1
ALLOW_CACHE_OVERRIDE=true

Add .dev.vars to .gitignore.

⸻

24. Environments

Support:

local
production

Optional later environment:

staging

Suggested production resources:

Worker:          ohana-media-api
Media KV:        ohana-media-cache-production
Config KV:       ohana-config-cache-production
Domain:          api.example.com

Suggested staging resources:

Worker:          ohana-media-api-staging
Media KV:        ohana-media-cache-staging
Config KV:       ohana-config-cache-staging
Domain:          api-staging.example.com

Production and staging must not share KV namespaces.

⸻

25. Local development

Suggested root scripts:

{
  "scripts": {
    "dev": "concurrently \"npm run dev:website\" \"npm run dev:api\"",
    "dev:website": "npm --workspace website run dev",
    "dev:api": "npm --workspace api run dev",
    "build": "npm run build:contracts && npm run build:website && npm run build:api",
    "build:contracts": "npm --workspace @app/contracts run build",
    "build:website": "npm --workspace website run build",
    "build:api": "npm --workspace api run build",
    "test": "npm run test:api",
    "test:api": "npm --workspace api run test",
    "deploy:website": "npm --workspace website run deploy",
    "deploy:api": "npm --workspace api run deploy"
  }
}

Local API:

http://localhost:8787

Frontend local environment:

VITE_API_BASE_URL=http://localhost:8787

Frontend production environment:

VITE_API_BASE_URL=https://api.example.com

Local Wrangler development should use local KV state and must not modify the production namespaces.

⸻

26. Frontend integration

Create one dedicated API client:

website/src/services/media-api.ts

Suggested interface:

export interface GetTitleOptions {
  language?: string;
  region?: string;
  cache?: "default" | "refresh" | "bypass";
  signal?: AbortSignal;
}
export async function getTitleByImdbId(
  imdbId: string,
  options: GetTitleOptions = {},
): Promise<MediaTitle> {
  // API implementation
}

The frontend should:

* Read the API URL from VITE_API_BASE_URL.
* Use shared TypeScript contracts.
* Call only the application API.
* Never call TMDB directly.
* Never contain the TMDB secret.
* Use AbortSignal for navigation-related requests.
* Handle loading, success, not-found, and unavailable states.
* Render movies and series according to mediaType.
* Use appropriate image sizes for each context.
* Display required provider attribution.

Suggested image usage:

Card poster              → images.poster.urls.small
Details-page poster      → images.poster.urls.medium
Hero background          → images.backdrop.urls.medium
Fullscreen image         → images.backdrop.urls.original
Collection card          → collection.poster.urls.small
Cast avatar              → castMember.profile.urls.small

⸻

27. Backend responsibilities

27.1 Route handler

The route handler should:

* Parse HTTP method and path.
* Validate the IMDb ID.
* Parse language, region, and cache mode.
* Call the title service.
* Convert service results into HTTP responses.

It should not:

* Build TMDB URLs.
* Map raw TMDB responses.
* Contain direct KV implementation details.
* Select cast members.
* Rank images.

27.2 Title service

The title service should:

* Resolve the IMDb ID.
* Determine movie or series.
* Coordinate cache behaviour.
* Delegate to the movie or series service.
* Return the normalized contract.

27.3 Movie service

The movie service should:

* Retrieve movie details.
* Retrieve movie credits.
* Retrieve movie images.
* Retrieve watch providers.
* Retrieve collection artwork.
* Normalize the result.

27.4 Series service

The series service should:

* Retrieve series details.
* Retrieve aggregate series credits.
* Retrieve series images.
* Retrieve watch providers.
* Retrieve creators.
* Normalize the result.

It must never use latest-season credits as the main series cast.

27.5 TMDB client

The client should:

* Add authorization headers.
* Build URLs.
* Apply explicit timeouts.
* Parse upstream responses.
* Map upstream failures into typed application errors.
* Avoid exposing secrets.

27.6 Cache adapter

The cache adapter should:

* Generate versioned keys.
* Read and validate cache envelopes.
* Write successful normalized values.
* Store negative-cache entries.
* Distinguish fresh, stale, expired, and invalid entries.
* Hide direct Workers KV details from the services.

27.7 Mappers

Mappers should:

* Convert provider-specific data into application contracts.
* Remove unnecessary fields.
* Normalize nullability.
* Rank images.
* Rank aggregate series cast.
* Ensure primary images are retained.
* Normalize provider categories.
* Normalize collection artwork.

⸻

28. Resilience

28.1 Upstream timeout

Recommended initial timeout:

5 seconds

For normal requests:

* Return stale cached data if available.
* Otherwise return UPSTREAM_UNAVAILABLE.

For explicit refresh or bypass:

* Return an upstream error.
* Do not use stale fallback.

28.2 Partial failures

Optional data should not necessarily break the complete response.

Examples:

* Missing alternative images should produce empty arrays.
* Missing provider data should produce empty provider groups.
* Missing collection should produce null.
* Missing cast profile images should produce profile: null.
* Missing backdrop should produce backdrop: null.

Core title lookup failure should still fail the request.

28.3 Cache write failures

When upstream retrieval succeeds but KV writing fails:

1. Log the KV write failure.
2. Return the valid response.
3. Do not fail the user request solely because the cache could not be updated.

28.4 Invalid cached values

When cached data does not match the expected envelope:

1. Treat it as a miss.
2. Retrieve upstream data.
3. Replace the invalid entry.
4. Log the validation issue.

⸻

29. Security

Requirements:

* Allow only GET and OPTIONS.
* Validate IMDb IDs before any upstream request.
* Validate language and region formats.
* Validate cache mode.
* Restrict CORS origins.
* Store API tokens as Worker secrets.
* Do not expose raw exceptions.
* Do not proxy arbitrary URLs.
* Do not provide a public endpoint that writes arbitrary KV entries.
* Protect production cache overrides.
* Record a request ID.
* Restrict query parameter lengths.

CORS is not authentication.

A public frontend means the normal read-only endpoint will remain callable by anyone who discovers it.

If measurable abuse occurs later, consider:

* Cloudflare rate limiting.
* Per-IP request limits.
* Bot protections.
* Request analytics.

Do not add these prematurely unless required.

⸻

30. Logging and observability

Use structured logs.

Example:

{
  "event": "title_request_completed",
  "requestId": "01J...",
  "imdbId": "tt0903747",
  "mediaType": "series",
  "language": "es-ES",
  "region": "ES",
  "cacheStatus": "hit",
  "status": 200,
  "durationMs": 28
}

Log:

* Request completion.
* Resolved media type.
* Cache hit, miss, refresh, bypass, stale, and invalid.
* Upstream latency.
* Upstream status category.
* Image count returned.
* Cast count returned.
* KV write failures.
* Validation failures.
* Unexpected errors.

Do not log:

* Secrets.
* Authorization headers.
* Full upstream payloads.
* Excessive client-identifying information.

Useful metrics:

Requests by status
Requests by media type
Cache hit ratio
Cache stale ratio
Cache refresh count
Cache bypass count
TMDB request count
TMDB failure rate
TMDB latency
Movie requests
Series requests
Title-not-found rate
KV read failures
KV write failures

⸻

31. Testing strategy

31.1 Unit tests

Test:

* IMDb ID validation.
* Language validation.
* Region validation.
* Cache-mode validation.
* Cache-key generation.
* Cache envelope validation.
* Fresh, stale, expired, and missing cache behaviour.
* Negative caching.
* Movie mapping.
* Series mapping.
* Movie cast mapping.
* Aggregate-series cast mapping.
* Collection mapping.
* Poster and backdrop ranking.
* Provider mapping.
* Stale fallback.
* Refresh behaviour.
* Bypass behaviour.
* Cache-write failure tolerance.

31.2 Critical series-cast tests

Tests must verify that:

* Aggregate series credits are requested.
* Latest-season credits are not used as the primary cast source.
* A lead actor from an earlier season is not omitted merely because they do not appear in the latest season.
* Episode counts are normalized.
* Multiple characters for one actor are preserved.
* Cast ordering is stable.
* The cast limit is applied only after aggregate ranking.

31.3 Integration tests

Test:

GET /health
GET /v1/titles/tt0133093
GET /v1/titles/tt0903747
GET /v1/titles/invalid
GET /v1/titles/tt0133093?cache=refresh
GET /v1/titles/tt0133093?cache=bypass
GET /v1/titles/tt0133093?cache=invalid
OPTIONS /v1/titles/tt0133093
POST /v1/titles/tt0133093

31.4 Fixtures

Automated tests should use mocked TMDB fixtures.

Provide fixtures for:

* Movie with collection.
* Movie without collection.
* Series with many seasons.
* Series whose latest season has a substantially different cast.
* Series with multiple roles for one actor.
* Title without backdrop.
* Title without poster.
* Title without providers.
* Title not found.
* Upstream timeout.
* Malformed upstream response.

Do not depend on the live TMDB API in normal pull-request tests.

⸻

32. CI/CD

The repository should have separate deployment pipelines or separate Cloudflare Git configurations.

Frontend trigger paths

website/**
packages/contracts/**
package.json
package-lock.json

Actions:

Install
Type-check
Run frontend tests
Build frontend
Deploy frontend

Backend trigger paths

api/**
packages/contracts/**
package.json
package-lock.json

Actions:

Install
Type-check
Run backend tests
Build or dry-run Worker
Deploy Worker

Backend deployment:

cd api
npx wrangler deploy

Use only one deployment authority per application:

* Cloudflare Git integration, or
* GitHub Actions.

Do not configure both to deploy the same application automatically.

⸻

33. CLI provisioning

Create the backend project:

mkdir api
cd api
npm init -y
npm install --save-dev wrangler typescript vitest

Authenticate:

npx wrangler login

Create KV namespaces:

npx wrangler kv namespace create MEDIA_CACHE
npx wrangler kv namespace create CONFIG_CACHE

Add the returned IDs to wrangler.jsonc.

Store the TMDB secret:

npx wrangler secret put TMDB_ACCESS_TOKEN

Optional production cache-override token:

npx wrangler secret put CACHE_OVERRIDE_TOKEN

Deploy:

npx wrangler deploy

Verify:

curl https://api.example.com/health

Movie example:

curl "https://api.example.com/v1/titles/tt0133093?language=es-ES&region=ES"

Series example:

curl "https://api.example.com/v1/titles/tt0903747?language=es-ES&region=ES"

Development refresh:

curl "http://localhost:8787/v1/titles/tt0903747?cache=refresh"

⸻

34. Implementation phases

Phase 1 — Worker foundation

Deliver:

* api/ workspace.
* Wrangler configuration.
* /health.
* Routing.
* Error middleware.
* Request IDs.
* CORS.
* Local environment.
* Production deployment.

Phase 2 — IMDb resolution

Deliver:

* IMDb ID validation.
* TMDB external-ID lookup.
* Movie versus series resolution.
* Title-not-found handling.
* Common response envelope.

Phase 3 — Movie support

Deliver:

* Movie details.
* Movie credits.
* Director mapping.
* Primary poster and backdrop.
* Alternative posters and backdrops.
* Watch providers.
* Collection identity.
* Collection poster and backdrop.

Phase 4 — Series support

Deliver:

* Series details.
* Aggregate series credits.
* Overall cast ranking.
* Multiple-character handling.
* Episode-count handling.
* Creator mapping.
* Series poster and backdrop.
* Alternative series images.
* Watch providers.

Phase 5 — Caching

Deliver:

* Media KV namespace.
* Image-configuration KV namespace.
* Versioned keys.
* Fresh cache reads.
* Cache writes.
* Negative caching.
* Stale-if-error.
* cache=refresh.
* cache=bypass.
* Production cache-override protection.

Phase 6 — Frontend integration

Deliver:

* Shared contracts.
* Frontend API client.
* Environment-specific API URL.
* Movie rendering.
* Series rendering.
* Image rendering.
* Collection rendering.
* Overall-series cast rendering.
* Provider rendering.
* Attribution.

Phase 7 — Hardening

Deliver:

* Unit tests.
* Integration tests.
* Structured logs.
* Explicit timeouts.
* Path-filtered CI.
* Optional staging deployment.
* Operational documentation.

⸻

35. Future extensions

Potential later endpoints:

GET /v1/titles/:imdbId/cast
GET /v1/titles/:imdbId/images
GET /v1/titles/:imdbId/recommendations
GET /v1/collections/:tmdbCollectionId
GET /v1/series/:imdbId/seasons
GET /v1/series/:imdbId/seasons/:seasonNumber
GET /v1/search?query=...

Possible future application-owned data:

users
lists
list_items
ratings
watch_status
custom_tags

Use D1 for this relational data rather than KV.

Possible future R2 usage:

* User-uploaded list artwork.
* Application-owned generated assets.
* Imported user files.

Do not copy third-party posters or backdrops to R2 without confirming licensing and provider terms.

⸻

36. Architecture decisions

ADR-001: One repository, separate deployments

Decision: Keep the frontend and backend in the same repository but deploy them independently.

Reasoning:

* Shared contracts.
* Easier coordinated changes.
* Independent release cycles.
* No unnecessary cross-deployment.
* Clear operational boundaries.

ADR-002: Common title endpoint

Decision: Use:

GET /v1/titles/:imdbId

for both movies and series.

Reasoning:

* The frontend may only know the IMDb ID.
* The backend is responsible for resolving media type.
* Avoids a preliminary frontend lookup.
* Keeps the client API simple.

ADR-003: API subdomain

Decision: Use:

api.example.com

Reasoning:

* Clear separation.
* Stable API base URL.
* Independent Worker deployment.
* Easier logging and routing.

ADR-004: Workers KV for metadata cache

Decision: Cache normalized title responses in Workers KV.

Reasoning:

* Read-heavy workload.
* Identifier-based lookups.
* Globally distributed reads.
* No relational querying required.
* External data can be replaced.

ADR-005: Application-owned schema

Decision: Do not expose raw TMDB responses.

Reasoning:

* Prevent provider coupling.
* Stable frontend contract.
* Smaller payloads.
* Controlled naming and nullability.
* Easier future provider migration.

ADR-006: Overall aggregate cast for series

Decision: Use overall-series aggregate credits.

Reasoning:

* Latest-season cast is not representative.
* Earlier lead actors remain important.
* Recurring cast should not disappear.
* Episode participation provides better ranking.

ADR-007: No logo catalogue

Decision: Do not retrieve or return title logos.

Reasoning:

* They are not required by the current UI.
* They add payload and mapping complexity.
* Posters and backdrops provide the required visual enrichment.

ADR-008: Collection artwork is required

Decision: Return collection poster and backdrop when available.

Reasoning:

* Collections are a meaningful discovery and navigation concept.
* Collection artwork improves the frontend experience.
* The data is directly useful for franchise presentation.

ADR-009: No image proxy

Decision: Return image metadata and CDN URLs; let the frontend load the images directly.

Reasoning:

* Less Worker traffic.
* Lower latency.
* Lower operational complexity.
* No need for R2 storage.
* Better alignment with the upstream image CDN.

ADR-010: Explicit development cache control

Decision: Support cache=refresh and cache=bypass.

Reasoning:

* Developers need to validate new mappings.
* Cached old schemas must be easy to replace.
* Upstream behaviour must be testable directly.
* Production overrides can be restricted.

ADR-011: No D1 initially

Decision: Do not use D1 for external media metadata.

Reasoning:

* Lookups are key-based.
* Data is replaceable.
* Relational querying is not needed.
* KV is simpler for this workload.

⸻

37. Acceptance criteria

The implementation is complete when:

* The repository contains separate website/ and api/ applications.
* The Worker deploys through Wrangler.
* The API is available on its own subdomain.
* The TMDB token is stored as a Worker secret.
* The frontend never receives the TMDB token.
* GET /health succeeds without TMDB or KV.
* A valid movie IMDb ID returns normalized movie data.
* A valid series IMDb ID returns normalized series data.
* The response identifies mediaType.
* Movies return their movie cast and directors.
* Series return aggregate overall-series cast.
* Series cast is not sourced from the latest season.
* Series cast preserves multiple character roles.
* Series cast includes episode counts when available.
* Posters and backdrops are returned when available.
* Alternative poster and backdrop arrays are limited.
* Logos are not returned.
* Collection identity and artwork are returned for collection movies.
* Collection poster and backdrop are returned when available.
* Cast profile images are returned when available.
* Creator and director profile images are returned when available.
* Region-specific streaming providers are returned.
* Invalid IMDb IDs return 400.
* Unknown title IDs return 404.
* Successful responses are stored in Workers KV.
* Repeat requests can be served from KV.
* Cache keys vary by language and region.
* cache=refresh retrieves fresh data and updates KV.
* cache=bypass retrieves fresh data without reading or writing KV.
* Cache overrides are unrestricted locally.
* Production cache overrides are disabled or protected.
* Normal stale responses may be used during upstream outages.
* Explicit refresh and bypass do not silently return stale data.
* Local development does not modify production KV.
* Automated tests use mocked upstream responses.
* Frontend-only changes do not unnecessarily deploy the backend.
* Backend-only changes do not unnecessarily deploy the frontend.
* Required TMDB and streaming-data attribution is displayed.