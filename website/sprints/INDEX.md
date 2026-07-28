# Sprint index

Focused active sprint plans live in dated sprint-set folders under this directory. Completed or superseded sprint history lives under [`archive/`](archive/) so implementation agents do not mistake old plans for the next executable work.

## Status

- Current planning status: brand-new issue-intake cycle is active in [`2026-07-28-no-open-website-issues/`](2026-07-28-no-open-website-issues/); the working fork currently has no open website-scoped issues.
- Current implementation phase: no active implementation sprint; Sprints 023–032 are complete and archived by sprint set.
- Next executable sprint: none — wait for the next website-scoped GitHub issue, PMT feedback item, or Alex request.
- Latest planning update: 2026-07-28.

## Roadmap

| Sprint | Outcome | Status | Depends on |
| --- | --- | --- | --- |
| _None_ | No open website-scoped issue is available to plan. | `blocked` | New website issue or PMT-approved feedback |

## Active sprint set

- Sprint-set index: [`2026-07-28-no-open-website-issues/INDEX.md`](2026-07-28-no-open-website-issues/INDEX.md)
- Archived completed sprint set: [`archive/2026-07-28-open-issues-25-32/`](archive/2026-07-28-open-issues-25-32/)
- Earlier archived sprint set: [`archive/2026-07-28-issue-driven-polish/`](archive/2026-07-28-issue-driven-polish/)

## Issue mapping

`gh issue list --state open --json number,title,url,labels,body --limit 100` returned no open issues for `origin` / `greg-26/static` during this planning run.

| Issue | Sprint coverage | Planning note |
| --- | --- | --- |
| _None_ | _None_ | No relevant open website issue exists, so there is nothing to map or intentionally leave unplanned. |

## Decisions and assumptions

- Working-fork issues (`origin`, currently `greg-26/static`) remain the active issue tracker for agent-driven website work.
- The completed Sprint 028–032 issue-driven sprint set was moved under `sprints/archive/` without rewriting its historical evidence.
- This is a brand-new active sprint-set folder, but it intentionally contains no sprint files because there are no open website-scoped issues to plan.
- Do not create make-work. The next sprint should be driven by a new website issue, PMT-approved feedback item, or explicit Alex request.
- Sprint numbers continue from the existing sequence when new work is planned; do not renumber completed sprints.

## Open questions

- None. The only blocker is lack of open website-scoped intake.

## Completion criteria

The current intake cycle is complete when:

- A new website-scoped issue or PMT-approved feedback item is mapped to one or more small executable sprints, with issue comments linking issue → sprint(s); or
- A later planner run confirms the working fork still has no open website-scoped issues and preserves the no-ready-sprint state.

## Maintenance rules

- One sprint = one file inside the active dated folder when executable work exists.
- Keep `VISION_EXECUTION.md` as a router; do not duplicate sprint status there.
- Link reports from `docs/vision-execution/review-index.md` instead of copying report contents into sprint files.
- Human feedback and new issues interrupt routine automation.
