# Sprint index

Focused active sprint files live here. Completed or superseded sprint history lives under [`archive/`](archive/) so implementation agents do not mistake old plans for the next executable work.

## Status

- Current planning status: issue-driven website roadmap refreshed from open working-fork issues #7 and #13–#17.
- Current implementation phase: Sprints 10–21 are implemented; Sprints 10–17 are archived.
- Next executable sprint: Sprint 022 — API CORS website origins.
- Latest planning update: 2026-07-22.

## Roadmap

| Sprint | Outcome | Status | Depends on |
| --- | --- | --- | --- |
| 018 | Prevent repeated titles across the first visible positions of Discover rows and document the row-deduplication model. | `complete` — implemented and verified 2026-07-22; addresses working-fork issue #7. | Current Discover row generation remains static/fetch based |
| 019 | Reorder movie-detail content around overview-first reading, add read-more disclosure, improve API hero loading feedback, and restore the TMDB external link affordance. | `complete` — implemented and verified 2026-07-22; addresses the layout/link/loading parts of issue #15. | Sprint 017 imagery hierarchy complete |
| 020 | Restore parent-guide category tags and make the guide score/link rows compact, legible, and link-like. | `complete` — implemented and verified 2026-07-22; addresses issue #16 and the parent-guide link/row parts of issue #15. | Sprint 019 complete |
| 021 | Add cast profile photos and enlarge collection movie posters without making the detail modal noisy on mobile. | `complete` — implemented and verified 2026-07-22; addresses issue #14 and completes the collection-poster part of issue #15. | Sprint 019 complete; API already exposes cast `profile` images |
| 022 | Unblock local/Tailscale and production website API CORS verification by updating API-origin handling and documenting the smoke check. | `ready` — addresses cross-project issue #17. | API Worker deploy path from API Sprint 009; coordinate with API planner if another API sprint is active |
| 017 | Split movie-detail imagery into a horizontal TMDB/API hero image plus a proper portrait poster treatment. | `complete` — implemented and verified 2026-07-22; issue #13 remains open in GitHub and needs implementation-workflow closure/comment evidence. | Sprint 11 API detail foundation complete |

## Sprint files

- Sprint 018: [`sprint-018-discover-visible-row-deduplication.md`](sprint-018-discover-visible-row-deduplication.md)
- Sprint 019: [`sprint-019-movie-detail-overview-loading-links.md`](sprint-019-movie-detail-overview-loading-links.md)
- Sprint 020: [`sprint-020-parent-guide-tags-and-density.md`](sprint-020-parent-guide-tags-and-density.md)
- Sprint 021: [`sprint-021-cast-and-collection-media-polish.md`](sprint-021-cast-and-collection-media-polish.md)
- Sprint 022: [`sprint-022-api-cors-website-origins.md`](sprint-022-api-cors-website-origins.md)
- Archived completed sprints: [`archive/`](archive/)

## Decisions and assumptions

- Working-fork issues (`origin`, currently `greg-26/static`) are the active issue tracker for agent-driven work.
- Upstream/original issues are not touched by automation unless Alex explicitly asks.
- Completed Sprints 10–17 were moved to `sprints/archive/` on 2026-07-22 without rewriting their history or completion evidence.
- Issue #13 is already covered by completed Sprint 017. Do not create a duplicate sprint; the next implementation agent should comment/close with evidence if the current code still satisfies the issue.
- Issue #15 was intentionally split across Sprints 019–021 because it mixes detail ordering, loading state, external links, parent-guide presentation, collection sizing, and cast/media polish.
- Issue #14 does not currently require a new API issue: the production Ohana API response includes cast `profile` images and `website/src/lib/ohanaApi.js` already normalizes `profileUrl`; the UI simply does not render it yet.
- Issue #17 is API-owned but website-relevant because it blocks local/Tailscale website review against the deployed API. Keep it as a small cross-project unblocker instead of mixing CORS changes into UI sprints.

## Open questions

- Discover visible threshold for issue #7: recommended default is the first two poster slots per row for the source-level gate, plus documented code structured so a later viewport-aware removal pass can use fully-visible IntersectionObserver evidence.
- Overview read-more threshold for issue #15: recommended default is a compact 3–4 line clamp on mobile, expanded by an inline button without losing scroll position.
- Parent-guide tags for issue #16: restore concise dimension tags from existing/upstream data if present; if upstream tags are not available in current data, implement the compact row layout and record the missing tag source as a data/API follow-up.
- CORS origins for issue #17: recommended default is to allow `https://ohana.tv`, `https://ohana-tv.netlify.app`, `https://ohana-tv.pages.dev`, and the known Tailscale/dev origins needed for review, without using wildcard credentials.

## Completion criteria

The current planned tranche is complete when:

- Issue #7 is implemented, verified on mobile-width Discover, documented in README/code, and closed by the implementation workflow.
- Issue #13 has a fresh evidence comment/closure if the archived Sprint 017 implementation still satisfies it.
- Issue #15 is fully covered by Sprints 019–021: loading feedback, collection sizing, overview ordering/read-more, external TMDB link/logo, actual parent-guide links, and section order.
- Issue #16 is implemented by Sprint 020 with restored tags and compact parent-guide scoring rows.
- Issue #14 is implemented by Sprint 021 using API cast profile images, or blocked with a new API issue only if the contract regresses.
- Issue #17 is implemented by Sprint 022 with local/Tailscale and production-origin CORS smoke evidence.
- Each implementation sprint runs its listed verification commands and keeps the dev server reviewable for Alex over Tailscale when UI changes are made.

## Maintenance rules

- One sprint = one file.
- Keep each sprint under roughly one screen of required context plus links.
- Prefer links to reports, screenshots, code refs, or archived plans over copying detail.
- When PMT drops feedback and the sprint planner plans it, update the PMT note with links to the sprint(s) that address each item.
- Human feedback has priority over routine automation.
