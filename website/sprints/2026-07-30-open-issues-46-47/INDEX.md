# Sprint set — 2026-07-30 open issues 46–47

## Status

- Planning status: brand-new issue-driven cycle opened at 2026-07-30 09:21 Europe/Madrid after fast-forwarding `main` and archiving the completed #41–#43 sprint set.
- Implementation phase: Sprint 041 complete; Sprint 042 complete.
- Next executable sprint: none — current open-issue tranche is implemented pending any new planner cycle.
- Latest planning update: 2026-07-30 09:21 Europe/Madrid.

## Roadmap

| Sprint | Outcome | Status | Depends on |
| --- | --- | --- | --- |
| [Sprint 041](sprint-041-movie-share-native-sheet.md) | Ensure the movie share button opens the native Web Share sheet on supported mobile browsers, with fallback feedback located next to the action. | `complete` | Current `MovieModal.vue` share button/link generation |
| [Sprint 042](sprint-042-movie-detail-other-metadata.md) | Move country/origin data out of the top metadata row and add a quiet bottom “Other details” section after cast for low-priority metadata. | `complete` | Sprint 041 complete; current Ohana API title detail mapper |

## Issue mapping

| Issue | Sprint coverage | Planning note |
| --- | --- | --- |
| [#46 Country of movie](https://github.com/greg-26/static/issues/46) | [Sprint 042](sprint-042-movie-detail-other-metadata.md) | Country is now treated as low-priority metadata. Put it after Cast in an unboxed/quiet “Other details” cluster; include original title, original language, and exact release date only when API data is available or can be added safely. |
| [#47 Movie share](https://github.com/greg-26/static/issues/47) | [Sprint 041](sprint-041-movie-share-native-sheet.md) | Web Share API must be the primary mobile behavior; copy/prompt is fallback only. Any fallback/status copy must appear adjacent to the share button, not far away from the action. |

## Decisions and assumptions

- `origin` / `greg-26/static` remains the active issue tracker; upstream `ohanamovies/static` was checked and has no open issues.
- Sprints 038–040 are complete and preserved under [`../archive/2026-07-30-open-issues-41-43/`](../archive/2026-07-30-open-issues-41-43/); do not rewrite them as if this feedback existed earlier.
- Sprint numbering continues after Sprint 040. Do not renumber completed or archived sprint files.
- #47 ran before #46 because it is a narrow interaction correction and can be verified independently on mobile.
- #46 should not re-promote country to the top row. The country signal belongs below Cast with other low-priority metadata.
- If Ohana API does not currently expose original title, original language, or exact release date, Sprint 042 may add those fields to the existing title-detail API normalization rather than scraping/static-catalog shortcuts.

## Open questions

- For #46, recommended default: show only fields with trustworthy data; do not render empty labels or invent values. Preferred labels: `Countries`, `Original title`, `Original language`, `Release date`.
- For #47, recommended default: do not call clipboard fallback before attempting `navigator.share`; if native share is unavailable or fails for a non-cancel reason, show a compact fallback state next to the share icon.

## Completion criteria

This open-issue tranche is complete when:

- #47 has implementation evidence from an explicit mocked Web Share verification note, and fallback behavior is documented. ✅ Sprint 041 complete.
- #46 has country moved after Cast and any extra metadata fields are API-backed, quiet, and absent when unavailable. ✅ Sprint 042 complete.
- Website build passes for each implemented sprint, plus any API/title-detail mapper tests touched by Sprint 042. ✅
- Issues #46 and #47 receive implementation evidence comments and are closed only by the implementation completion workflow. ✅

## Maintenance rules

- One active sprint-set folder at a time.
- Keep Sprint 041 scoped to sharing behavior/feedback placement; no unrelated modal redesign.
- Keep Sprint 042 scoped to low-priority metadata placement/API normalization; no broad detail-page hierarchy rewrite.
- Keep `VISION_EXECUTION.md` as a router; sprint state belongs here and in the root `sprints/INDEX.md`.
- Link planner reports from `docs/vision-execution/review-index.md` instead of copying report contents into sprint files.
