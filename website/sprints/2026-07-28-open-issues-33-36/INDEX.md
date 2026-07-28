# Sprint set — 2026-07-28 open issues 33–36

## Status

- Planning status: brand-new issue-driven sprint set created for the current working-fork website issues.
- Implementation phase: Sprint 034 complete; Sprint 035 is next.
- Next executable sprint: [Sprint 035 — List detail management menu](sprint-035-list-detail-management-menu.md).
- Latest planning update: 2026-07-28 15:05 Europe/Madrid.

## Roadmap

| Sprint | Outcome | Status | Depends on |
| --- | --- | --- | --- |
| [Sprint 033](sprint-033-header-brand-back-navigation.md) | Remove the stretched logo and compress header/back navigation into a mobile-first app-bar pattern. | `complete` | None |
| [Sprint 034](sprint-034-discover-list-menu-manage-action.md) | Move Discover row Manage lists from row actions into the list chooser menu. | `complete` | None |
| [Sprint 035](sprint-035-list-detail-management-menu.md) | Add list rename/share/remove actions inside the dedicated list view. | `ready` | Sprint 034 preferred, but not blocking |

## Issue mapping

| Issue | Sprint coverage | Planning note |
| --- | --- | --- |
| [#33 Website - Settings - lists](https://github.com/greg-26/static/issues/33) | [Sprint 035](sprint-035-list-detail-management-menu.md) | Adds the same three-dot list management affordance inside a specific list view. |
| [#34 Website - settings - back buttons](https://github.com/greg-26/static/issues/34) | [Sprint 033](sprint-033-header-brand-back-navigation.md) | Compresses the app header/back treatment and prefers chevron-only back affordances on child pages. |
| [#35 Ohana logo isn't square - remove it for now](https://github.com/greg-26/static/issues/35) | [Sprint 033](sprint-033-header-brand-back-navigation.md) | Removes the stretched header logo while preserving required visible `Ohana TV` brand text where appropriate. |
| [#36 Website - discover - list row - manage link](https://github.com/greg-26/static/issues/36) | [Sprint 034](sprint-034-discover-list-menu-manage-action.md) | Moves Manage lists into the existing From-your-lists chooser menu. |

All open website-scoped issues from `origin` / `greg-26/static` are covered by this sprint set. No open website issue remains intentionally unplanned.

## Decisions and assumptions

- Sprint numbering continues after completed Sprint 032; completed sprint files remain archived and unchanged.
- Header/back compression should preserve the product requirement that top-level app chrome visibly includes `Ohana TV`; child routes may prioritize a compact chevron/back pattern over repeating the brand.
- The list chooser menu should remain the Discover row's single configuration affordance; the row action area should keep only content-navigation actions such as `See all`.
- List management behavior already exists in Settings → Lists and should be reused or extracted rather than reimplemented with divergent copy/state handling.
- No backend/profile persistence changes are planned; all work is static Vue UI behavior around existing list/profile methods.

## Open questions

- None block implementation. Recommended default: use existing `UiChip`, `FilterMenu`, and list menu patterns before adding new primitives.

## Completion criteria

This issue tranche is complete when:

- Issue #35's stretched logo is gone from the app header without losing required `Ohana TV` brand presence. ✅ Sprint 033 complete.
- Issue #34's child-page back/header stack is compressed and mobile-safe. ✅ Sprint 033 complete.
- Issue #36's Discover list row no longer shows a separate Manage lists chip, and the same action is available at the end of the list menu. ✅ Sprint 034 complete.
- Issue #33's dedicated list route exposes rename, copy/share, and remove actions for the current list.
- `npm run build` passes after implementation and each affected flow has been smoke-tested on a narrow/mobile viewport.

## Maintenance rules

- Implement one sprint at a time unless Alex explicitly asks for batching.
- Keep implementation notes in the relevant sprint file; keep this index as the execution overview.
- Do not close issues until implementation evidence exists and the implementation agent has commented with verification.
