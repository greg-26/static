# Ohana agent working style

This is the lightweight operating model for the Ohana website agent team. Keep files focused; link related context instead of copying it into every prompt.

## Roles

- **PMT** owns product feedback intake, prioritization, PM notes, vision alignment, and links from feedback to sprint(s).
- **PE** owns execution sequencing, risk control, sprint slicing, and making sure feedback becomes small buildable plans.
- **SDE** owns one focused sprint implementation at a time.
- **QA/CX** owns browser evidence, regression checks, and strong-taste CX findings.
- **UX designer** owns durable design/style guidance and uses QA evidence to catch design misses.
- **CEO assistant is deprecated.** Human/product feedback now goes to PMT.

## Feedback → execution flow

1. Alex drops feedback.
2. PMT captures it under `reports/pmt/` and updates `VISION.md` only when the feedback changes durable product acceptance criteria.
3. PMT links each feedback item to the sprint(s) that address it once PE plans the work.
4. PE reviews latest PMT, SDE, QA, and UX notes, then updates the execution plan and current sprint pointers.
5. SDE takes the next focused sprint and implements script-by-script.
6. QA/CX verifies behavior with evidence.
7. UX designer periodically reviews the design using QA evidence, updates `DESIGN_GUIDELINES.md` with durable feedback/questions/misses, and asks PE to prioritize changes when needed.

Human feedback takes priority over routine cron-driven work.

## Sprint rules

- Sprints live in [`sprints/`](./sprints/); each sprint has its own file.
- [`sprints/INDEX.md`](./sprints/INDEX.md) summarizes sprint goals and status.
- Developers may edit the next sprint file with concise feedback or implementation notes.
- If sprint details are unclear and an implementation would require material assumptions, SDE must ask PMT, UX designer, or PE to validate the approach before coding.
- SDE must read `DESIGN_GUIDELINES.md` and `CODING_STANDARDS.md` before UI work.
- Build incrementally, script by script. No giant “while we’re here” passes.

## Automation cadence

These are role wake-ups, not permission to spam commits. Cadences should be staggered so roles do not race each other or produce overlapping planning/implementation commits.

- **SDE every 2 hours:** take the next ready sprint or add a blocker note if no sprint is actionable.
- **PE every 4 hours, offset between SDE runs:** review latest PMT/SDE/QA/UX feedback and update execution plan/sprint pointers. PE should run after SDE has had time to leave evidence, not at the same minute.
- **UX designer every 36 hours:** use QA/CX evidence to review design, update style guidelines with durable feedback/questions/misses, and ask PE to prioritize if needed.

## Team dynamics

- Human feedback interrupts automation; agents should converge on Alex's latest direction before continuing routine work.
- SDE produces implementation evidence; PE synthesizes and sequences it. PE should not rewrite or second-guess active SDE work unless it is clearly unsafe, blocked, or off-plan.
- When two agents touch the same sprint, the later agent must read the earlier agent's committed note/report first, then make the smallest follow-up change needed.
- If timing causes stale assumptions, leave a concise blocker/planning note instead of forcing a commit.
- QA/CX and UX findings are inputs to PE prioritization, not parallel product roadmaps.

## Git/push policy

- Commit local progress when a focused documentation or implementation slice is coherent and verified.
- Push to the working remote for review when Alex asks for the latest setup or a coherent slice is ready.
- Do **not** push every commit to the original/upstream repo; Alex verifies the dev server first.
- External deployment remains out of scope unless Alex explicitly asks.

## Context budget rules

- Read `VISION_EXECUTION.md` only as the router, then `docs/sprints/INDEX.md`, then the current sprint file.
- Open reports only through the review index or explicit sprint links.
- Do not duplicate status across trackers; sprint status belongs in `docs/sprints/INDEX.md` and sprint details belong in the sprint file.
- Do not paste long reports into trackers; summarize consequences and link the source.
- Archive stale detail instead of keeping rolling mega-docs alive.
