# API Sprint Planner Report — 2026-07-22

## Inputs inspected

- `api/AGENTS.md`
- `api/agents/sprint-planner.md`
- `api/docs/design.md`
- current API code/tests/docs/config under `api/`
- current API sprint archive/project structure under `api/sprints/`
- open GitHub issues in `greg-26/static`

## Open issue mapping

| Issue | API relevance | Planned coverage |
|---|---|---|
| [#17 API - cors?](https://github.com/greg-26/static/issues/17) | Direct API issue. Browser CORS access fails from Alex's Vite/LAN origin and should work from `ohana.tv`. | Planned in Sprint 014 under `api/sprints/projects/2026-07-api-cors-access/`. |
| [#14 Website - movie details](https://github.com/greg-26/static/issues/14) | Website issue asks for cast profile photos and says to create an API dependency if unavailable. Current API schema already exposes `cast[].profile`. | No API sprint planned unless frontend implementation proves the API payload lacks required image data. |
| #7, #13, #15, #16 | Website/CX issues without clear API backend scope. | Not planned for API. |

## Sprint structure decision

- Existing completed Sprints 001-009 are already separated under `api/sprints/archive/2026-07-initial-api-implementation/`.
- Completed issue wave Sprints 010-013 remain under `api/sprints/projects/2026-07-api-feature-wave/` and are marked complete.
- New issue-driven API work starts in `api/sprints/projects/2026-07-api-cors-access/` with Sprint 014.

## Next executable sprint

Sprint 014 — CORS Origin Policy and Dev Access.

Primary goal: ensure configured Ohana and local browser origins receive matching CORS headers, disallowed origins do not receive misleading allow-origin headers, and README/tests/config document the exact-origin policy.

## Blockers

None for planning. Implementation has one non-blocking assumption: `100.85.92.106:5173` is treated as `http://100.85.92.106:5173` because CORS origins require a scheme and Vite usually serves HTTP locally.
