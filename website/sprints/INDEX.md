# Sprint index

Focused active sprint plans live in dated sprint-set folders under this directory. Completed or superseded sprint history lives under [`archive/`](archive/) so implementation agents do not mistake old plans for the next executable work.

## Status

- Current planning status: brand-new issue-driven cycle is active in [`2026-07-28-open-issues-33-36/`](2026-07-28-open-issues-33-36/); all current open website-scoped working-fork issues are mapped.
- Current implementation phase: Sprint 035 complete; open-issues #33–#36 tranche is complete.
- Next executable sprint: None — no remaining planned implementation items in the active sprint set.
- Latest planning update: 2026-07-28.

## Roadmap

| Sprint | Outcome | Status | Depends on |
| --- | --- | --- | --- |
| [Sprint 033](2026-07-28-open-issues-33-36/sprint-033-header-brand-back-navigation.md) | Remove the stretched logo and compress header/back navigation into a mobile-first app-bar pattern. | `complete` | None |
| [Sprint 034](2026-07-28-open-issues-33-36/sprint-034-discover-list-menu-manage-action.md) | Move Discover row Manage lists from row actions into the list chooser menu. | `complete` | None |
| [Sprint 035](2026-07-28-open-issues-33-36/sprint-035-list-detail-management-menu.md) | Add list rename/share/remove actions inside the dedicated list view. | `complete` | Sprint 034 preferred, but not blocking |

## Active sprint set

- Sprint-set index: [`2026-07-28-open-issues-33-36/INDEX.md`](2026-07-28-open-issues-33-36/INDEX.md)
- Superseded no-open-issues intake marker: [`archive/2026-07-28-no-open-website-issues/`](archive/2026-07-28-no-open-website-issues/)
- Archived completed sprint set: [`archive/2026-07-28-open-issues-25-32/`](archive/2026-07-28-open-issues-25-32/)
- Earlier archived sprint set: [`archive/2026-07-28-issue-driven-polish/`](archive/2026-07-28-issue-driven-polish/)

## Issue mapping

Open issue query for `origin` / `greg-26/static` found four website-scoped issues during this planning run.

| Issue | Sprint coverage | Planning note |
| --- | --- | --- |
| [#33 Website - Settings - lists](https://github.com/greg-26/static/issues/33) | [Sprint 035](2026-07-28-open-issues-33-36/sprint-035-list-detail-management-menu.md) | Add the same three-dot management affordance inside a specific list view. |
| [#34 Website - settings - back buttons](https://github.com/greg-26/static/issues/34) | [Sprint 033](2026-07-28-open-issues-33-36/sprint-033-header-brand-back-navigation.md) | Compress settings/list child-page chrome and prefer compact chevron back navigation. |
| [#35 Ohana logo isn't square - remove it for now](https://github.com/greg-26/static/issues/35) | [Sprint 033](2026-07-28-open-issues-33-36/sprint-033-header-brand-back-navigation.md) | Remove the stretched header logo while preserving visible `Ohana TV` brand text where required. |
| [#36 Website - discover - list row - manage link](https://github.com/greg-26/static/issues/36) | [Sprint 034](2026-07-28-open-issues-33-36/sprint-034-discover-list-menu-manage-action.md) | Move Manage lists into the existing From-your-lists chooser menu. |

No relevant open website issue remains unplanned.

## Decisions and assumptions

- Working-fork issues (`origin`, currently `greg-26/static`) remain the active issue tracker for agent-driven website work.
- The prior no-open-issues sprint-set marker was moved under `sprints/archive/` when new issues #33–#36 appeared; it remains historical evidence, not active work.
- Sprint numbers continue from the existing completed sequence; do not renumber completed sprints.
- Keep this tranche UI-only and mobile-conscious. Do not change list/profile persistence or static hosting behavior.
- Implement one sprint at a time unless Alex explicitly asks for batching.

## Open questions

- None. Recommended default for implementers: reuse existing `UiChip`, `FilterMenu`, Settings list menu behavior, and route metadata before adding new primitives.

## Completion criteria

The current planned tranche is complete when:

- Issues #33, #34, #35, and #36 each have implementation evidence and issue comments linking the final changes and verification.
- Sprint 033 removes the stretched logo and compresses child-page back/header chrome.
- Sprint 034 moves Discover list management into the list chooser menu. ✅ Sprint 034 complete.
- Sprint 035 adds dedicated list-page rename/share/remove actions. ✅ Sprint 035 complete.
- `npm run build` passes after implementation, and affected flows have a narrow/mobile smoke check recorded. ✅ Build and code-path smoke complete; no browser automation exists for profile/list mutation.

## Maintenance rules

- One sprint = one file inside the active dated folder.
- Keep `VISION_EXECUTION.md` as a router; do not duplicate sprint status there.
- Link reports from `docs/vision-execution/review-index.md` instead of copying report contents into sprint files.
- Human feedback and new issues interrupt routine automation.
