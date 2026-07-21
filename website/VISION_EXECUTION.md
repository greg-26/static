# Ohana Vision Execution

Thin front door for execution work. Do not put sprint status, slice logs, or active findings here.

## Objective

Deliver `VISION.md` incrementally: Discover/Search/Settings IA, discovery-first CX, dedicated Search intent, Settings as permanent configuration, and clearer appropriateness/availability/list signals.

## Start here

1. Read [`docs/working-style.md`](docs/working-style.md) for team roles, cadence, feedback flow, and push policy.
2. Read [`sprints/INDEX.md`](sprints/INDEX.md) for the single source of truth on active/next sprint status.
3. Open only the sprint file linked by the index.
4. Open [`docs/vision-execution/review-index.md`](docs/vision-execution/review-index.md) only when the sprint/task points to PMT/QA/UX/PE feedback.
5. Do **not** read archived logs unless auditing history or debugging a regression.

## Durable prompts

- PMT / human feedback intake: [`agents/pmt.md`](agents/pmt.md)
- Principal engineer: [`agents/principal-engineer.md`](agents/principal-engineer.md)
- SDE: [`agents/sde.md`](agents/sde.md)
- UX designer: [`agents/ux-designer.md`](agents/ux-designer.md)
- QA/CX reviewer: [`agents/qa.md`](agents/qa.md)
- Deprecated CEO assistant shim: [`agents/ceo-assistant.md`](agents/ceo-assistant.md)

## Standing constraints

- Do not push every commit to the original/upstream repo; Alex verifies the dev server first.
- Do not implement true Included/Free/Rent/Buy provider grouping until backend/scraper data supports it.
- Do not implement real person/studio search without backend data.
- Do not implement list ownership/delete semantics beyond current rename/remove-from-profile language.
- Do not rewrite profile/list persistence or KV merge behavior as part of UI cleanup.
- Do not deploy externally unless Alex asks.

## Maintenance rule

One responsibility per file:

- Sprint status and next work → [`sprints/INDEX.md`](sprints/INDEX.md) and the current sprint file.
- Team process and cadence → [`docs/working-style.md`](docs/working-style.md).
- Feedback/report links → [`docs/vision-execution/review-index.md`](docs/vision-execution/review-index.md).
- Product acceptance criteria → [`VISION.md`](VISION.md).
- Design rules → [`DESIGN_GUIDELINES.md`](DESIGN_GUIDELINES.md).
