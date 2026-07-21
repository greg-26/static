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
- **Deployed API:** deploy the Worker after replacing the placeholder KV namespace IDs and setting the TMDB secret for the target environment:

  ```sh
  npx wrangler deploy --env development
  npx wrangler deploy --env production
  ```

  The deployed Worker URL is the API base. A push to `origin/main` does not currently deploy this Worker automatically; deployment wiring is tracked as follow-up planning.

## Endpoint

```http
GET /titles/{imdbId}
```

Example:

```sh
curl "https://api.ohana.example/titles/tt0133093"
```

Cache operator modes are available outside production by default:

```sh
curl "https://api.ohana.example/titles/tt0133093?cache=refresh"
curl "https://api.ohana.example/titles/tt0133093?cache=bypass"
```

- `cache=refresh` skips cache read, fetches from TMDB, and writes a fresh successful response.
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
  "collection": null,
  "streamingProviders": null
}
```

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

The committed KV namespace IDs and CORS origins are placeholders until real Cloudflare resources and website origins are chosen.

## Environment setup

### Local

- Uses the top-level `wrangler.toml` configuration.
- `ENVIRONMENT=local`.
- `ALLOW_CACHE_OVERRIDES=true` for safe local operator testing.
- `TITLE_CACHE` points at a placeholder namespace ID that Wrangler can use for local/dry-run validation.

### Development

Before deploying with `--env development`:

1. Create a development KV namespace for `TITLE_CACHE`.
2. Replace `env.development.kv_namespaces[0].id` in `wrangler.toml`.
3. Set the development TMDB secret:

   ```sh
   npx wrangler secret put TMDB_API_KEY --env development
   ```

4. Replace the placeholder `CORS_ALLOWED_ORIGINS` value with the development website origin when CORS is implemented.

### Production

Before deploying with `--env production`:

1. Create a production KV namespace for `TITLE_CACHE`.
2. Replace `env.production.kv_namespaces[0].id` in `wrangler.toml`.
3. Set the production TMDB secret:

   ```sh
   npx wrangler secret put TMDB_API_KEY --env production
   ```

4. Replace the placeholder `CORS_ALLOWED_ORIGINS` value with the production website origin when CORS is implemented.
5. Keep `ALLOW_CACHE_OVERRIDES=false` unless an intentional production cache operation requires otherwise.

Deployment is intentionally not part of the sprint implementation flow.
