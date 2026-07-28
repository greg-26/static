# Sprint planner report — 2026-07-28 open issues 33–36

Date: 2026-07-28 15:05 Europe/Madrid
Scope: Ohana static website planning cycle for the working fork (`origin` / `greg-26/static`).

## Inputs inspected

- `README.md`, `AGENTS.md`, `agents/sprint-planner.md`
- `VISION.md`, `DESIGN_GUIDELINES.md`, `CODING_STANDARDS.md`, `VISION_EXECUTION.md`
- `docs/working-style.md`, `sprints/INDEX.md`, current/archived sprint folders, and latest linked planning reports from `docs/vision-execution/review-index.md`
- Current source locations related to the new issues: `src/App.vue`, `src/components/FromYourLists.vue`, `src/components/SettingsView.vue`, `src/views/ListView.vue`, and related grep results for logo/back/list actions
- Open GitHub issues from the working repository via `gh issue list --repo greg-26/static --state open --json number,title,url,labels,body --limit 100`
- Git status/remotes and fast-forward pull from `origin/main`

## Git and issue state

- Worktree was clean before edits.
- `git pull --ff-only --rebase=false` reported the branch was already up to date.
- Four open website-scoped issues were found: #33, #34, #35, and #36.

## Archive action

The previous no-open-issues active marker was moved out of the active sprint area without rewriting its historical report:

- from `website/sprints/2026-07-28-no-open-website-issues/`
- to `website/sprints/archive/2026-07-28-no-open-website-issues/`

Completed Sprint 023–032 history remains archived and unchanged.

## New active sprint folder

Created a brand-new active sprint-set folder:

- `website/sprints/2026-07-28-open-issues-33-36/`

It contains three small executable sprint files:

- `sprint-033-header-brand-back-navigation.md`
- `sprint-034-discover-list-menu-manage-action.md`
- `sprint-035-list-detail-management-menu.md`

## Issue mapping

| Issue | Sprint coverage | Planning decision |
| --- | --- | --- |
| [#33 Website - Settings - lists](https://github.com/greg-26/static/issues/33) | Sprint 035 | Add a compact rename/share/remove menu inside the dedicated list view. |
| [#34 Website - settings - back buttons](https://github.com/greg-26/static/issues/34) | Sprint 033 | Compress settings/list child-page chrome and use a chevron-first back pattern. |
| [#35 Ohana logo isn't square - remove it for now](https://github.com/greg-26/static/issues/35) | Sprint 033 | Remove the stretched header logo while preserving required visible `Ohana TV` brand text. |
| [#36 Website - discover - list row - manage link](https://github.com/greg-26/static/issues/36) | Sprint 034 | Move `Manage lists` into the existing From-your-lists chooser menu. |

No open website-scoped issue remains unplanned.

## Roadmap changes

- Updated root `sprints/INDEX.md` to point at the new sprint-set folder and Sprint 033 as next executable.
- Created the new sprint-set `INDEX.md` with issue mapping, assumptions, and completion criteria.
- Added this planner report to `docs/vision-execution/review-index.md`.
- Left `VISION_EXECUTION.md` unchanged because its router/status model did not change; the active route still points implementers to `sprints/INDEX.md`.

## Issue comments

Planner issue comments were arranged for each open issue, linking the issue to the planned sprint(s). These are planning comments only; no issues were closed.

## Next executable sprint

Sprint 033 — Header brand and back-navigation compression.

Recommended implementation order:

1. Sprint 033: fix shared app chrome/logo/back navigation first.
2. Sprint 034: move Discover list management into the list chooser menu.
3. Sprint 035: add list-page three-dot management actions.

## Verification

Planning-only verification target:

```bash
git diff --check
```

A markdown path sanity check should verify all new relative sprint/report links resolve before commit.

## Blockers

None. Implementation can start with Sprint 033.
