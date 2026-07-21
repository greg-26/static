# Ohana Movies API

Small Cloudflare Worker API that returns normalized movie/series metadata by IMDb title ID.

The API intentionally hides TMDB behind an Ohana-owned response schema. Clients should use this API contract, not TMDB fields.

## How to get the API

- **Local API:** run `npm install`, set a TMDB secret, then start Wrangler:

  ```sh
  npx wrangler secret put TMDB_API_KEY
  npx wrangler dev
  ```

  Wrangler prints the local Worker URL; use that as the API base.
- **Deployed API:** pushes to `origin/main` that touch `api/**` deploy the production Worker through GitHub Actions after typecheck, tests, and Wrangler dry-run pass. Manual dispatch of **Deploy API Worker** can deploy either `production` or `development`.

  Current Workers URLs:

  - Production: `https://ohanamovies-api.ohanamovies-api.workers.dev`
  - Development: `https://ohanamovies-api-development.ohanamovies-api.workers.dev`

  Manual local deploys are still available when needed:

  ```sh
  npx wrangler deploy --env development
  npx wrangler deploy --env production
  ```

## Endpoint

```http
GET /titles/{imdbId}
```

Examples:

```sh
curl "https://api.ohana.example/titles/tt0133093"
curl "https://api.ohana.example/titles/tt0088247?lang=es&country=ES"
```

Query parameters:

- `lang` — optional TMDB metadata language. Accepted forms are conservative two-letter language tags with an optional two-letter region, e.g. `es` or `es-ES`. Language is normalized to lowercase language plus uppercase region.
- `country` — optional watch-provider country/region. Accepted form is ISO 3166-1 alpha-2, e.g. `ES`; values are normalized to uppercase. When provided, `streamingProviders.region` uses this country and only that country is selected from TMDB provider results.
- `cache` — optional operator cache mode: `refresh` or `bypass`.

Defaults:

- Without `lang`, TMDB default-language metadata is requested.
- Without `country`, provider mapping preserves the existing default region behavior (`US`).
- Cache keys vary by normalized `lang` and `country`, so localized responses do not share cached bodies with default requests.

Cache operator modes are available outside production by default:

```sh
curl "https://api.ohana.example/titles/tt0133093?cache=refresh"
curl "https://api.ohana.example/titles/tt0133093?cache=bypass"
```

- `cache=refresh` skips cache read, fetches from TMDB, and writes a fresh successful response for the normalized `lang`/`country` variant.
- `cache=bypass` skips both cache read and cache write.
- Production rejects cache override modes unless `ALLOW_CACHE_OVERRIDES=true` is explicitly configured.
- Normal requests can return stale cached data when TMDB is unavailable; explicit refresh/bypass requests do not silently fall back to stale data.

## Example response

```json
{
  "imdbId": "tt0133093",
  "type": "movie",
  "title": "The Matrix",
  "originalTitle": "The Matrix",
  "overview": "A hacker discovers reality is a simulation.",
  "release": {
    "date": "1999-03-31",
    "year": 1999
  },
  "runtime": {
    "minutes": 136
  },
  "genres": ["Action", "Science Fiction"],
  "rating": {
    "average": 8.2,
    "voteCount": 25000
  },
  "cast": [
    {
      "id": "6384",
      "name": "Keanu Reeves",
      "roles": ["Neo"],
      "episodeCount": null,
      "profile": null
    }
  ],
  "crew": {
    "directors": [],
    "creators": []
  },
  "artwork": {
    "poster": null,
    "backdrop": null,
    "posters": [],
    "backdrops": []
  },
  "collection": {
    "id": "2344",
    "name": "The Matrix Collection",
    "poster": null,
    "backdrop": null,
    "items": [
      {
        "id": "603",
        "imdbId": "tt0133093",
        "title": "The Matrix",
        "release": {
          "date": "1999-03-31",
          "year": 1999
        },
        "poster": null,
        "order": 0
      }
    ]
  },
  "streamingProviders": null
}
```

Movie `collection` is `null` when TMDB has no collection. When present, `collection.items` contains normalized movie summaries in collection order:

- `id` — stable Ohana string identifier derived from the TMDB movie ID.
- `imdbId` — item IMDb title ID when TMDB external IDs resolve it; otherwise `null`.
- `title`, `release`, `poster`, and `order` — display data for CX collection lists.

Series always return `collection: null`; seasons are a separate series concern.


## Errors

All errors use stable JSON:

```json
{
  "error": {
    "code": "invalid_imdb_id",
    "message": "Invalid IMDb ID."
  }
}
```

Current statuses:

- `400 invalid_imdb_id` — malformed IMDb title ID.
- `400 invalid_cache_mode` — unsupported `cache` query value.
- `400 invalid_language` — malformed `lang` query value.
- `400 invalid_country` — malformed `country` query value.
- `400 cache_mode_not_allowed` — cache override rejected in production.
- `404 route_not_found` — unknown route.
- `404 title_not_found` — valid IMDb ID with no matching title.
- `405 method_not_allowed` — only `GET` is supported.
- `500 unexpected_failure` — upstream or unexpected failure without leaking TMDB details.

## Local development

```sh
npm install
npm run typecheck
npm test
npm run wrangler:dry-run
```

Run locally with Wrangler:

```sh
npx wrangler dev
```

Required secret:

```sh
npx wrangler secret put TMDB_API_KEY
# or use TMDB_ACCESS_TOKEN if deploying with a bearer token instead
```

Configuration is in `wrangler.toml`:

- `TITLE_CACHE` — Cloudflare KV binding for normalized title responses.
- `TITLE_CACHE_TTL_SECONDS` — successful response freshness; default is `604800` seconds / 7 days.
- `ENVIRONMENT` — `local`, `development`, or `production`.
- `ALLOW_CACHE_OVERRIDES` — enables `cache=refresh|bypass`; keep disabled in production unless intentionally operating the cache.
- `TMDB_BASE_URL` / `TMDB_TIMEOUT_MS` — TMDB integration settings.
- `CORS_ALLOWED_ORIGINS` — deployment input for the future CORS allowlist. The Worker does not enforce CORS yet.

Development and production use real Cloudflare KV namespace IDs for `TITLE_CACHE`. The top-level local namespace ID remains a dry-run/local placeholder.

## Environment setup

### Local

- Uses the top-level `wrangler.toml` configuration.
- `ENVIRONMENT=local`.
- `ALLOW_CACHE_OVERRIDES=true` for safe local operator testing.
- `TITLE_CACHE` points at a placeholder namespace ID that Wrangler can use for local/dry-run validation.

### Development

- Worker name: `ohanamovies-api-development`.
- URL: `https://ohanamovies-api-development.ohanamovies-api.workers.dev`.
- `TITLE_CACHE` uses the Cloudflare KV namespace `development-TITLE_CACHE`.
- `ALLOW_CACHE_OVERRIDES=true` for safe operator testing.
- Required Worker secret: `TMDB_API_KEY` or `TMDB_ACCESS_TOKEN`.

### Production

- Worker name: `ohanamovies-api`.
- URL: `https://ohanamovies-api.ohanamovies-api.workers.dev`.
- `TITLE_CACHE` uses the Cloudflare KV namespace `production-TITLE_CACHE`.
- `ALLOW_CACHE_OVERRIDES=false`; keep it disabled unless an intentional production cache operation requires otherwise.
- Required Worker secret: `TMDB_API_KEY` or `TMDB_ACCESS_TOKEN`.

## Deployment automation

GitHub Actions workflow: `.github/workflows/api-worker.yml`.

- `push` to `main` with changes under `api/**` or the workflow file deploys `production`.
- `workflow_dispatch` deploys the selected environment: `production` or `development`.
- The workflow runs `npm ci`, `npm run typecheck`, `npm test`, `npm run wrangler:dry-run`, syncs the TMDB secret into the target Cloudflare Worker environment, then runs `wrangler deploy`.
- Required GitHub Actions secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, and either `TMDB_API_KEY` or `TMDB_ACCESS_TOKEN`.
