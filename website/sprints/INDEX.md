# Sprint index

Focused sprint files live here so agents read only the slice they are working on. This file is the single source of truth for active/next sprint status.

## Status

- Current planning status: issue-driven website roadmap refreshed for open working-fork issues (#6, #7, #8, #9, #10, #11, #12), with Alex's post-Sprint-013 additions mapped into focused follow-up sprints.
- Current implementation phase: Sprint 13 is implemented and verified; Sprint 10 is complete and Sprint 9 has been removed from the active planner and archived as historical evidence.
- Next executable sprint: Sprint 14 — Discover chip dropdown density for issue #10, followed by Sprint 11/12 API detail work unless Alex prioritizes issue #7.
- Latest planning update: 2026-07-22.

## Roadmap

| Sprint | Outcome | Status | Depends on |
| --- | --- | --- | --- |
| 10 | Make Where-to-watch country/source context explicit with Spain read-only provider settings and JustWatch/TMDB attribution. | `complete` — implemented and verified 2026-07-22; addresses working-fork issues #1 and #2. | Alex escalation from 2026-07-21 planning run |
| 11 | Integrate the Ohana API into movie details for overview, cast, and collection context. | `ready/backlog` — addresses the movie-detail API foundation for issue #6, but is temporarily behind Alex's latest non-API polish requests. | Sprint 10 complete |
| 12 | Finish API-enriched detail surfaces for TV seasons and API-state hardening. | `proposed` — completes issue #6 after Sprint 11 foundation. | Sprint 11 complete |
| 13 | Convert Search recent-search chips into focus-gated autocomplete suggestions and align recent/result row radii. | `complete` — implemented and verified 2026-07-22; addresses working-fork issues #8 and #9. | Sprint 10 complete; independent of API Sprints 11/12 |
| 14 | Remove low-value subtitles from Discover filter chip dropdown options so the menus feel less wide/fat. | `ready` — addresses issue #10 as a small Discover control polish slice after Sprint 13. | Sprint 13 complete |
| 15 | Move custom-provider add/manage ownership to Settings and separate custom providers from normal availability in movie details. | `proposed` — addresses issue #11 and prepares the provider detail surface for grouped API availability. | Sprint 10 complete; recommended before Sprint 16 |
| 16 | Break movie-detail provider availability into TMDB-style stream/rent/buy groups with provider icons and graceful fallback. | `proposed` — addresses issue #12 after API enrichment and provider ownership cleanup. | Sprints 11, 12, and 15 complete; UX icon sizing/radius guidance |

## Sprint files

- Sprint 10: [`sprint-010-where-to-watch-country-context.md`](sprint-010-where-to-watch-country-context.md)
- Sprint 11: [`sprint-011-api-detail-foundation.md`](sprint-011-api-detail-foundation.md)
- Sprint 12: [`sprint-012-api-tv-seasons-hardening.md`](sprint-012-api-tv-seasons-hardening.md)
- Sprint 13: [`sprint-013-search-recents-autocomplete-polish.md`](sprint-013-search-recents-autocomplete-polish.md)
- Sprint 14: [`sprint-014-discover-chip-dropdown-density.md`](sprint-014-discover-chip-dropdown-density.md)
- Sprint 15: [`sprint-015-provider-settings-and-custom-sources.md`](sprint-015-provider-settings-and-custom-sources.md)
- Sprint 16: [`sprint-016-provider-availability-breakdown.md`](sprint-016-provider-availability-breakdown.md)

## Decisions and assumptions

- Working-fork issues (`origin`, currently `greg-26/static`) are the active issue tracker for agent-driven work.
- Upstream/original issues are not touched by automation unless Alex explicitly asks.
- Sprint 9 was removed from the active planner on 2026-07-22 at Alex's request; its historical implementation evidence is archived at [`../docs/vision-execution/archive/sprint-09-trust-retrieval-accessibility-archived.md`](../docs/vision-execution/archive/sprint-09-trust-retrieval-accessibility-archived.md).
- Sprint 10 assumes Spain-only provider availability until scraper/data inspection proves multi-country support.
- Sprint 11 assumes the deployed Ohana API title endpoint can be consumed read-only by the static website with graceful fallback to existing catalog fields.
- Sprint 12 keeps TV season rendering separate from the first API integration slice so the movie-detail page remains reviewable after Sprint 11.
- Sprint 13 intentionally jumped ahead of API implementation because Alex's latest two non-API issues were small, user-visible Search/recents fixes with shared code paths; it is complete as of 2026-07-22.
- Sprint 14 is separate from Sprint 13 because Discover chip dropdown density is a different surface from Search recents/autocomplete.
- Sprint 15 moves custom-provider configuration to Settings before Sprint 16 adds richer provider availability grouping, so movie details do not mix configuration controls with availability display.
- Sprint 16 must not fake Stream/Rent/Buy buckets from the legacy provider bitmask; it depends on API/TMDB-style grouped provider data or must report a contract blocker.
- Issue #7 (Discover movie duplication) is open and non-API, but is not part of the Search/recents or chip-density sprints; plan it as a separate Discover deduplication sprint if Alex prioritizes it next.

## Open questions

- API endpoint configuration: use production API by default or an environment-configured base URL? Recommended default: add a small config constant/env fallback and keep local development overrideable.
- API payload limits: cast/collection/seasons may be long. Recommended default: render compact previews first, with progressive disclosure only if the data volume demands it.
- Search recents autocomplete semantics: prefer an input-attached, focus-gated suggestion list over permanent chips; keep mobile keyboard behavior from prior Search polish intact.
- Provider grouping contract: confirm the Ohana API exposes TMDB-style provider buckets and logo paths before Sprint 16 implementation. Recommended default: block Sprint 16 rather than inventing bucket semantics from bitmasks.
- Provider icon styling: Sprint 16 needs UX guidance for icon size and border radius. Recommended default: spawn the UX designer before coding that sprint.

## Completion criteria

The current website issue tranche is complete when:

- Sprint 10 country/source context is implemented, verified, and issues #1 and #2 are commented and closed by the implementation workflow when fully satisfied.
- Sprint 13 Search/recents polish is implemented and verified, and issues #8 and #9 were commented and closed by the implementation workflow.
- Sprint 14 Discover chip dropdown density is implemented and verified, and issue #10 is commented and closed by the implementation workflow when fully satisfied.
- Sprint 11 and Sprint 12 API enrichment are implemented and verified, and issue #6 is commented and closed by the implementation workflow when fully satisfied.
- Sprint 15 provider settings/custom-source ownership is implemented and verified, and issue #11 is commented and closed by the implementation workflow when fully satisfied.
- Sprint 16 provider availability grouping/icons is implemented and verified, and issue #12 is commented and closed by the implementation workflow when fully satisfied or left open with an API contract blocker.
- The dev server remains reviewable for Alex over Tailscale after implementation slices.

## Maintenance rules

- One sprint = one file.
- Keep each sprint under roughly one screen of required context plus links.
- Prefer links to reports, screenshots, code refs, or archived plans over copying detail.
- When PMT drops feedback and the sprint planner plans it, update the PMT note with links to the sprint(s) that address each item.
- Human feedback has priority over routine automation.
