# Sprint index

Focused active sprint plans live in dated sprint-set folders under this directory. Completed or superseded sprint history lives under [`archive/`](archive/) so implementation agents do not mistake old plans for the next executable work.

## Status

- Current planning status: brand-new issue-driven cycle in [`2026-07-30-open-issues-46-47/`](2026-07-30-open-issues-46-47/) is ready after archiving the completed #41–#43 sprint set.
- Current implementation phase: Sprint 041 complete; Sprint 042 ready.
- Next executable sprint: [Sprint 042 — Movie Detail Other Metadata](2026-07-30-open-issues-46-47/sprint-042-movie-detail-other-metadata.md).
- Latest planning update: 2026-07-30 09:21 Europe/Madrid.

## Roadmap

| Sprint | Outcome | Status | Depends on |
| --- | --- | --- | --- |
| [Sprint 041](2026-07-30-open-issues-46-47/sprint-041-movie-share-native-sheet.md) | Ensure the movie share button opens the native Web Share sheet on supported mobile browsers, with fallback feedback located next to the action. | `complete` | Current `MovieModal.vue` share button/link generation |
| [Sprint 042](2026-07-30-open-issues-46-47/sprint-042-movie-detail-other-metadata.md) | Move country/origin data out of the top metadata row and add a quiet bottom “Other details” section after cast for low-priority metadata. | `ready` | Sprint 041 complete; current Ohana API title detail mapper |

## Active sprint set

- Sprint-set index: [`2026-07-30-open-issues-46-47/INDEX.md`](2026-07-30-open-issues-46-47/INDEX.md)
- Archived completed sprint set: [`archive/2026-07-30-open-issues-41-43/`](archive/2026-07-30-open-issues-41-43/)
- Superseded no-open-issues marker: [`archive/2026-07-29-no-open-website-issues/`](archive/2026-07-29-no-open-website-issues/)
- Earlier archived sprint set: [`archive/2026-07-28-open-issues-37-39/`](archive/2026-07-28-open-issues-37-39/)
- Earlier archived sprint set: [`archive/2026-07-28-open-issues-33-36/`](archive/2026-07-28-open-issues-33-36/)
- Earlier archived no-open-issues marker: [`archive/2026-07-28-no-open-website-issues/`](archive/2026-07-28-no-open-website-issues/)
- Earlier archived sprint set: [`archive/2026-07-28-open-issues-25-32/`](archive/2026-07-28-open-issues-25-32/)
- Earlier archived sprint set: [`archive/2026-07-28-issue-driven-polish/`](archive/2026-07-28-issue-driven-polish/)

## Issue mapping

`origin` / `greg-26/static` is the active tracker for this planning cycle. `upstream` / `ohanamovies/static` was also checked and has no open issues.

| Issue | Sprint coverage | Planning note |
| --- | --- | --- |
| [#46 Country of movie](https://github.com/greg-26/static/issues/46) | [Sprint 042](2026-07-30-open-issues-46-47/sprint-042-movie-detail-other-metadata.md) | Move country below Cast into quiet low-priority metadata; add original title/language/exact release date only when API-backed. |
| [#47 Movie share](https://github.com/greg-26/static/issues/47) | [Sprint 041](2026-07-30-open-issues-46-47/sprint-041-movie-share-native-sheet.md) | Native Web Share sheet is primary; copy/manual link is fallback only and feedback must stay near the share action. |

## Decisions and assumptions

- Working-fork issues (`origin`, currently `greg-26/static`) are the active issue tracker for agent-driven website work.
- The previous active folder [`archive/2026-07-30-open-issues-41-43/`](archive/2026-07-30-open-issues-41-43/) is preserved as completed history because Sprints 038–040 are complete.
- Sprint numbers continue after completed Sprint 040; do not renumber completed or archived sprint files.
- #47 landed first so the interaction regression is isolated before metadata layout changes.
- Country/origin is low-priority context and should no longer appear in the top metadata row.
- New metadata fields should use the existing Ohana API detail flow, not a new client-side TMDB call.

## Open questions

- For #46, recommended default is to render only API-backed values. If original title/language/exact release date are unavailable, leave them absent and document that in the issue comment.
- For #47, recommended default is to attempt `navigator.share({ title, url })` before any fallback and avoid over-restrictive `navigator.canShare` gating.

## Completion criteria

This open-issue tranche is complete when:

- #47 has explicit mocked Web Share evidence that supported browsers attempt the native share sheet before fallback, with fallback behavior verified separately. ✅ Sprint 041 complete.
- #46 has implementation evidence that country moved after Cast and optional metadata is API-backed/quiet.
- Website build passes for implemented slices, plus API/title-detail mapper tests if Sprint 042 changes API code.
- Issues #46 and #47 each have implementation evidence comments and are closed by the implementation completion workflow.

## Maintenance rules

- One active sprint-set folder at a time.
- Keep sprint files scoped to their issue(s); no unrelated movie-detail redesign.
- Keep `VISION_EXECUTION.md` as a router; do not duplicate sprint status there.
- Link reports from `docs/vision-execution/review-index.md` instead of copying report contents into sprint files.
- Human feedback and new issues interrupt routine automation.
