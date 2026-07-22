# Sprint 022 — API CORS website origins

## Status
complete — verified 2026-07-22

## Outcome

The deployed Ohana API works from local/Tailscale website review URLs and production website origins without unsafe wildcard CORS.

## Why now

Working-fork issue [#17](https://github.com/greg-26/static/issues/17) is titled API, but it blocks website review: the API works from `https://ohana-tv.pages.dev/discover?movie=tt0120737` but not from the Tailscale/Vite URL `100.85.92.106:5173/discover?movie=tt0120737`, and Alex explicitly wants it to work from that URL and `ohana.tv`.

## Source requirements

- Issue #17: API detail calls must work from the Tailscale/Vite review URL.
- Issue #17: API detail calls must work from `ohana.tv`.
- `VISION_EXECUTION.md`: keep API endpoint configuration overrideable; do not deploy externally unless requested by the implementation workflow/Alex.

## Starting context

- API CORS was updated during Sprint 011 to support production website origins.
- The working repo includes both `website/` and `api/`; this sprint is cross-project but website-driven.

## Scope

### In scope

- Inspect current API CORS allowlist and deployed behavior.
- Add the known Tailscale/Vite dev origin and production website origin(s) required for review.
- Keep local configuration documented; avoid wildcard origins with credentials.
- Add smoke checks for OPTIONS/GET with `Origin: http://100.85.92.106:5173`, `https://ohana.tv`, and the active deployed preview origin if relevant.
- Update API/website docs only where the CORS review contract belongs.

### Out of scope

- Website UI changes.
- New API endpoints or data contracts.
- Cloudflare custom-domain/DNS work unless Alex separately asks.

## Technical guidance

Prefer a small explicit allowlist or environment-configured list. If deployment is required, coordinate with the API deploy path and capture GitHub Actions/Workers evidence. If another API planner sprint owns CORS, mark this sprint superseded by that API sprint and link the evidence instead of duplicating work.

## Expected file impact

- `api/src/*` CORS/origin handling
- API tests for allowed origins
- Possibly `api/README.md` / website `README.md` review notes
- Sprint docs after implementation

## Implementation sequence

1. Inspect API CORS code/tests and deployed headers for the requested origins.
2. Add/adjust allowlist and tests.
3. Run API typecheck/tests/dry-run.
4. Deploy through the established API workflow if needed.
5. Smoke live headers and website modal API fetch from local/Tailscale if practical.
6. Comment/close issue #17 with evidence.

## Acceptance criteria

- [ ] API returns matching `Access-Control-Allow-Origin` for `http://100.85.92.106:5173` when requested from local review.
- [ ] API returns matching `Access-Control-Allow-Origin` for `https://ohana.tv`.
- [ ] Existing Pages/Netlify origins continue to work.
- [ ] No wildcard origin is introduced for credentialed requests.
- [ ] The smoke check uses a real title such as `tt0120737`.

## Required tests

- API CORS unit tests.
- Live or local curl smoke with explicit `Origin` headers.

## Verification commands

```bash
cd api
npm run typecheck
npm test
npm run wrangler:dry-run
cd ..
git diff --check
```

## Handoff

Completed 2026-07-22 by Greg.

Repository state already contained the needed explicit API CORS allowlist and tests before this website cadence run selected Sprint 022. This run verified the implementation rather than duplicating API work.

Evidence:

- `api/wrangler.toml` keeps exact allowed browser origins for production/development, including `https://ohana.tv`, `https://www.ohana.tv`, `https://ohana-tv.pages.dev`, and `http://100.85.92.106:5173`.
- `api/test/worker-shell.test.ts` covers configured-origin echoing for GET responses, OPTIONS preflight behavior, disallowed-origin omission, and wildcard fallback only when no allowlist is configured.
- Live deployed Worker smoke checks against `https://ohanamovies-api.ohanamovies-api.workers.dev/titles/tt0120737?lang=es-ES&country=ES` returned matching `Access-Control-Allow-Origin` for:
  - `http://100.85.92.106:5173`
  - `https://ohana.tv`
  - `https://www.ohana.tv`
  - `https://ohana-tv.pages.dev`

Verification:

```bash
cd api && npm run typecheck
cd api && npm test
cd api && npm run wrangler:dry-run
cd api && cd .. && git diff --check
cd website && npm run build
curl -fsS -o /dev/null -D - -X OPTIONS -H "Origin: http://100.85.92.106:5173" -H "Access-Control-Request-Method: GET" 'https://ohanamovies-api.ohanamovies-api.workers.dev/titles/tt0120737?lang=es-ES&country=ES'
curl -fsS -o /dev/null -D - -H "Origin: http://100.85.92.106:5173" 'https://ohanamovies-api.ohanamovies-api.workers.dev/titles/tt0120737?lang=es-ES&country=ES'
# Repeated the same OPTIONS/GET smoke for https://ohana.tv, https://www.ohana.tv, and https://ohana-tv.pages.dev.
```

All passed on 2026-07-22. Alex confirmed the Tailscale endpoint can load details, and issue #17 was closed with this evidence.

## Dependencies unlocked

- Restores reliable local phone/Tailscale review of API-enriched movie details.
