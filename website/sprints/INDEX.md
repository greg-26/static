# Sprint index

Focused sprint files live here so agents read only the slice they are working on. This file is the single source of truth for active/next sprint status.

## Status

- Current planning status: issue-driven website roadmap refreshed for all open working-fork issues (#1, #2, #6).
- Current implementation phase: Sprint 9 remains blocked on real-phone validation/PMT decision, but Alex's latest issue-driven planning request escalates Sprint 10 as the next executable implementation slice.
- Next executable sprint: Sprint 10 — Where-to-watch country and source context.
- Latest planning revision: 2026-07-21.

## Roadmap

| Sprint | Outcome | Status | Depends on |
| --- | --- | --- | --- |
| 9 | PM/QA trust, retrieval, accessibility, and phone-touch validation follow-ups. | `blocked` — automated readiness green; local dropdown/mobile polish needs real-phone validation. No matching issue exists on the working fork, so closure is blocked on validation evidence/PMT decision. | Earlier redesign implementation slices |
| 10 | Make Where-to-watch country/source context explicit with Spain read-only provider settings and JustWatch/TMDB attribution. | `ready` — addresses working-fork issues #1 and #2. | Alex escalation from 2026-07-21 planning run; no code dependency on Sprint 9 validation |
| 11 | Integrate the Ohana API into movie details for overview, cast, and collection context. | `proposed` — addresses the movie-detail API foundation for issue #6. | Sprint 10 complete |
| 12 | Finish API-enriched detail surfaces for TV seasons and API-state hardening. | `proposed` — completes issue #6 after Sprint 11 foundation. | Sprint 11 complete |

## Sprint files

- Sprint 9: [`sprint-09-trust-retrieval-accessibility.md`](sprint-09-trust-retrieval-accessibility.md)
- Sprint 10: [`sprint-010-where-to-watch-country-context.md`](sprint-010-where-to-watch-country-context.md)
- Sprint 11: [`sprint-011-api-detail-foundation.md`](sprint-011-api-detail-foundation.md)
- Sprint 12: [`sprint-012-api-tv-seasons-hardening.md`](sprint-012-api-tv-seasons-hardening.md)

## Decisions and assumptions

- Working-fork issues (`origin`, currently `greg-26/static`) are the active issue tracker for agent-driven work.
- Upstream/original issues are not touched by automation unless Alex explicitly asks.
- This planning run treats Alex's issue-driven request as explicit escalation to make Sprint 10 executable despite Sprint 9's real-phone validation blocker.
- Sprint 10 assumes Spain-only provider availability until scraper/data inspection proves multi-country support.
- Sprint 11 assumes the deployed Ohana API title endpoint can be consumed read-only by the static website with graceful fallback to existing catalog fields.
- Sprint 12 keeps TV season rendering separate from the first API integration slice so the movie-detail page remains reviewable after Sprint 11.

## Open questions

- Sprint 9 closure: real-phone validation or PMT decision is still needed for the local dropdown/mobile polish fix. Recommended default: leave Sprint 9 blocked and do not let it block issue-driven Sprint 10.
- API endpoint configuration: use production API by default or an environment-configured base URL? Recommended default: add a small config constant/env fallback and keep local development overrideable.
- API payload limits: cast/collection/seasons may be long. Recommended default: render compact previews first, with progressive disclosure only if the data volume demands it.

## Completion criteria

The current website issue tranche is complete when:

- Sprint 10 country/source context is implemented, verified, and issues #1 and #2 are commented and closed by the implementation workflow when fully satisfied.
- Sprint 11 and Sprint 12 API enrichment are implemented and verified, and issue #6 is commented and closed by the implementation workflow when fully satisfied.
- Sprint 9 validation evidence is accepted or explicitly deferred by PMT/Alex.
- The dev server remains reviewable for Alex over Tailscale after implementation slices.

## Maintenance rules

- One sprint = one file.
- Keep each sprint under roughly one screen of required context plus links.
- Prefer links to reports, screenshots, code refs, or archived plans over copying detail.
- When PMT drops feedback and the sprint planner plans it, update the PMT note with links to the sprint(s) that address each item.
- Human feedback has priority over routine automation.
