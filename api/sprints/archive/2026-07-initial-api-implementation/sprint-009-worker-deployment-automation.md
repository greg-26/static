# Sprint 009 — Worker Deployment Automation

## Status

complete

## Outcome

Pushing API changes to `origin/main` deploys the Cloudflare Worker backend through GitHub Actions, using real Cloudflare resources and documented environment-specific API URLs.

## Why now

The API implementation is complete, but deployment is still manual. The repository currently documents placeholder KV namespace IDs and explicitly says Worker deployment is not part of the sprint implementation flow, so pushing code does not spin up or update the backend.

## Source requirements

- `api/README.md` deployment notes and environment setup.
- `api/wrangler.toml` environment definitions.
- Existing website Cloudflare Pages workflow as the reference for repo CI conventions, not as an API deployment path.
- Cloudflare Worker deployment requirements: account ID, API token, KV namespaces, secrets, and deployed route/URL.

## Scope

### In scope

- Create real Cloudflare KV namespaces for development and production `TITLE_CACHE`.
- Replace placeholder KV namespace IDs and environment placeholders with real deployment values.
- Configure required GitHub Actions secrets/variables, including Cloudflare account credentials and TMDB secrets for deploy-time setup.
- Add a GitHub Actions workflow that runs on relevant `api/**` changes and deploys the Worker for the intended environment(s).
- Define branch/environment behavior, including whether `main` deploys production directly or uses a protected GitHub Environment.
- Verify deployment with a real request to `GET /titles/{imdbId}` after the workflow completes.
- Document the resulting development and production API base URLs in the API README or deployment docs.

### Out of scope

- Changing API route behavior, response schema, cache semantics, or TMDB mapping logic.
- Website integration changes beyond recording the API URL that the website should consume later.
- New Cloudflare capabilities such as custom domains, durable objects, queues, analytics, or cron refresh jobs unless required for the first deploy.

## Implementation sequence

1. Inspect existing Cloudflare/GitHub deployment conventions in the repo.
2. Create or identify the Cloudflare Worker, KV namespaces, and account/environment identifiers.
3. Set Cloudflare and TMDB credentials in GitHub Actions secrets or protected environment secrets.
4. Update `wrangler.toml` with real namespace IDs and environment values.
5. Add an API deployment workflow for `api/**` pushes and manual dispatch.
6. Run local verification (`npm run typecheck`, `npm test`, `npm run wrangler:dry-run`) before relying on remote deploy.
7. Push and verify the GitHub Actions deployment logs.
8. Call the deployed API URL and confirm a valid normalized response or documented stable error.
9. Document the final API base URL(s), required secrets, and deploy/runbook notes.

## Acceptance criteria

- [x] `wrangler.toml` no longer contains placeholder KV namespace IDs for deployed environments.
- [x] Required Cloudflare and TMDB credentials are configured as GitHub Actions secrets or environment secrets.
- [x] A GitHub Actions workflow deploys the API Worker on relevant `api/**` changes and supports manual dispatch.
- [x] Deployment verification is recorded with the deployed Worker URL and a representative `GET /titles/{imdbId}` check.
- [x] API documentation lists the resulting development and production API base URLs and the deployment path.
- [x] No API implementation behavior changes are included in this sprint unless needed to unblock deployment and explicitly documented.

## Verification commands

Run from `api/` before deployment:

```sh
npm run typecheck
npm test
npm run wrangler:dry-run
```

After deployment, verify the documented API URL with a representative request, for example:

```sh
curl -i "$OHANA_API_BASE_URL/titles/tt0133093"
```

## Blockers / required inputs

None for the first Workers.dev deployment.

Resolved inputs:

- Cloudflare account ID/API token are available as GitHub Actions secrets and local Wrangler auth was sufficient for provisioning.
- Created real KV namespaces: `development-TITLE_CACHE` and `production-TITLE_CACHE`.
- `TMDB_API_KEY` is configured as a GitHub Actions secret and as a Cloudflare Worker secret for development and production.
- Production deploy policy: direct deploy from `main` on `api/**` pushes after checks pass; manual dispatch can deploy production or development.
- API base URLs:
  - Production: `https://ohanamovies-api.ohanamovies-api.workers.dev`
  - Development: `https://ohanamovies-api-development.ohanamovies-api.workers.dev`

Custom domains remain out of scope.

## Handoff

Implementation report:

- Cloudflare resources created: `development-TITLE_CACHE`, `production-TITLE_CACHE`.
- GitHub secrets configured/reused: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `TMDB_API_KEY`.
- Cloudflare Worker secrets configured: `TMDB_API_KEY` for development and production.
- Workflow added: `.github/workflows/api-worker.yml`; `main` + `api/**` pushes deploy production, `workflow_dispatch` can deploy production or development.
- Deployed API URLs:
  - Production: `https://ohanamovies-api.ohanamovies-api.workers.dev`
  - Development: `https://ohanamovies-api-development.ohanamovies-api.workers.dev`
- Deployment-required API code fix: the TMDB client now wraps the default Worker `fetch` instead of storing the unbound global function; this fixed deployed Worker `TypeError` failures without changing the public API schema.
- Verification: `npm run typecheck`, `npm test`, `npm run wrangler:dry-run`, `git diff --check`, and deployed `GET /titles/tt0133093` passed.
- Remaining manual steps: none for Workers.dev deployment; custom domains/DNS remain future work.
