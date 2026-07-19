# Ohana Vision Execution

This is a **thin execution index**, not a rolling dump. Keep it short so agents do not waste context on obsolete slice logs.

## Objective

Deliver `VISION.md` incrementally: Discover/Search/Settings IA, discovery-first CX, dedicated Search intent, Settings as permanent configuration, and clearer appropriateness/availability/list signals.

## Read path for agents

1. Start here.
2. Read [`docs/working-style.md`](docs/working-style.md) for the team operating model.
3. Read [`docs/sprints/INDEX.md`](docs/sprints/INDEX.md) for sprint status.
4. Read only the current sprint file linked from the sprint index.
5. Read [`docs/vision-execution/review-index.md`](docs/vision-execution/review-index.md) only when the sprint/task touches PMT/QA/UX/PE feedback.
6. Do **not** read archived logs unless auditing history or debugging a regression.

## Sprint completion contract

Each sprint must end with a working website version: implementation complete, verification passed, Vite dev server reachable at `http://100.85.92.106:5173/`, execution docs updated so completed items and next steps are clear, and changes committed. Push to the working review remote when Alex asks or a coherent slice is ready; do **not** push every commit to the original/upstream repo.

## Current focus

Current sprint: **Sprint 9 — PM/QA trust, retrieval, and accessibility follow-ups**.

Sprint file: [`docs/sprints/sprint-09-trust-retrieval-accessibility.md`](docs/sprints/sprint-09-trust-retrieval-accessibility.md)

Current next step: run the `npm run qa:phone-touch` checklist on a real phone via `http://100.85.92.106:5173/` and record pass/fail findings for Discover availability/dropdown selected-state readability, movie-detail profile chips, maturity evidence rows, provider chips, list/profile gate copy, and Settings → Lists row scanability.

## Durable agent prompts

- PMT / human feedback intake: [`agents/pmt.md`](agents/pmt.md)
- Principal engineer: [`agents/principal-engineer.md`](agents/principal-engineer.md)
- SDE: [`agents/sde.md`](agents/sde.md)
- UX designer: [`agents/ux-designer.md`](agents/ux-designer.md)
- QA/CX reviewer: [`agents/qa.md`](agents/qa.md)
- Deprecated CEO assistant shim: [`agents/ceo-assistant.md`](agents/ceo-assistant.md)

## Deferred / do not do yet

- Do not implement true Included/Free/Rent/Buy provider grouping until backend/scraper data supports it.
- Do not implement real person/studio search without backend data.
- Do not implement list ownership/delete semantics beyond current rename/remove-from-profile language.
- Do not rewrite profile/list persistence or KV merge behavior as part of UI cleanup.
- Do not deploy externally unless Alex asks.

## Maintenance rule

Do not append long slice logs here. Current work belongs in `docs/sprints/`; reports belong under `reports/`; stale detail belongs under `docs/vision-execution/archive/`.
