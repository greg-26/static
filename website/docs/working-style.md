# Ohana agent working style

This is the lightweight operating model for the Ohana website agent team. Keep files focused; link related context instead of copying it into every prompt.

## Roles

- **PMT** owns product feedback intake, prioritization, PM notes, vision alignment, and links from feedback to sprint(s).
- **Sprint planner** owns execution sequencing, risk control, sprint slicing, issue-to-sprint mapping, and making sure feedback becomes small buildable plans.
- **Sprint implementation agent** owns one focused sprint implementation at a time.
- **QA/CX** owns browser evidence, regression checks, and strong-taste CX findings.
- **UX designer** owns durable design/style guidance and uses QA evidence to catch design misses.

## Feedback → execution flow

1. Alex drops feedback.
2. PMT captures it under `reports/pmt/` and updates `VISION.md` only when the feedback changes durable product acceptance criteria.
3. PMT links each feedback item to the sprint(s) that address it once the sprint planner plans the work.
4. The sprint planner reviews latest PMT, implementation, QA/CX, UX notes, and open issues, then updates the execution plan and current sprint pointers.
5. The sprint planner spins out a scoped issue-reply agent to comment on open issues with the sprint number(s) that address them.
6. The sprint implementation agent takes the next focused sprint and implements it script-by-script.
7. When sprint work fully satisfies issues, the implementation agent spins out a scoped issue-closure agent to comment with evidence and close them.
8. QA/CX verifies behavior with evidence.
9. UX designer periodically reviews the design using QA evidence, updates `DESIGN_GUIDELINES.md` with durable feedback/questions/misses, and asks the sprint planner to prioritize changes when needed.

Human feedback takes priority over routine cron-driven work.

## Sprint rules

- Sprints live in [`sprints/`](../sprints/); each sprint has its own file.
- [`sprints/INDEX.md`](../sprints/INDEX.md) is the execution overview and should follow the API sprint pattern: status summary, roadmap table, decisions/assumptions, open questions, and completion criteria.
- Allowed sprint statuses are `proposed`, `ready`, `in-progress`, `blocked`, `complete`, and `superseded`.
- Developers may edit the next sprint file with concise feedback or implementation notes.
- If sprint details are unclear and an implementation would require material assumptions, the implementation agent must ask PMT, UX designer, or the sprint planner to validate the approach before coding.
- The implementation agent must read `DESIGN_GUIDELINES.md` and `CODING_STANDARDS.md` before UI work.
- Build incrementally, script by script. No giant “while we’re here” passes.

## Automation cadence

These are role wake-ups, not permission to spam commits. Cadences should be staggered so roles do not race each other or produce overlapping planning/implementation commits.

- **Sprint implementation agent every 2 hours:** take the next `ready` sprint whose dependencies are `complete`, or add a blocker note if no sprint is actionable.
- **Sprint planner every 4 hours, offset between implementation runs:** review latest PMT/implementation/QA/UX feedback plus open issues, update sprint pointers, and map issues to sprint numbers.
- **UX designer every 36 hours:** use QA/CX evidence to review design, update style guidelines with durable feedback/questions/misses, and ask the sprint planner to prioritize if needed.

## Team dynamics

- Human feedback interrupts automation; agents should converge on Alex's latest direction before continuing routine work.
- The implementation agent produces implementation evidence; the sprint planner synthesizes and sequences it. The planner should not rewrite or second-guess active implementation work unless it is clearly unsafe, blocked, or off-plan.
- When two agents touch the same sprint, the later agent must read the earlier agent's committed note/report first, then make the smallest follow-up change needed.
- If timing causes stale assumptions, leave a concise blocker/planning note instead of forcing a commit.
- QA/CX and UX findings are inputs to sprint planning, not parallel product roadmaps.

## Git/push policy

- Commit local progress when a focused documentation or implementation slice is coherent and verified.
- Push to the working remote for review when Alex asks or a coherent slice is ready.
- Do **not** push every commit to the original/upstream repo; Alex verifies the dev server first.
- External deployment remains out of scope unless Alex explicitly asks.

## GitHub issues

- Treat the fork/working repository (`origin`, currently `greg-26/static`) as the active issue tracker for agent-driven work. Do not use the original/upstream issue tracker unless Alex explicitly asks.
- Never delete issues. Completed work must be traceable.
- Sprint planner: for every open issue, comment with the sprint number(s) that address it, using a separate scoped issue-reply agent.
- Sprint implementation agent: after related sprint(s) complete and verification passes, use a separate scoped issue-closure agent to comment with evidence and close fully satisfied issues.
- Closing comments must include what changed, commit(s) or files involved, verification run, and any remaining caveat.
- If evidence is incomplete or manual validation is still needed, leave the issue open and comment/update the blocker instead of closing it.
- Telegram cron highlights should mention issue comments/closures or blockers so Alex can keep an eye on progress.

## Context budget rules

- Read `VISION_EXECUTION.md` only as the router, then `sprints/INDEX.md`, then the current sprint file.
- Open reports only through the review index or explicit sprint links.
- Do not duplicate status across trackers; sprint status belongs in `sprints/INDEX.md` and sprint details belong in the sprint file.
- Do not paste long reports into trackers; summarize consequences and link the source.
- Archive stale detail instead of keeping rolling mega-docs alive.
