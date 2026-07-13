# Ohana Vision Execution

This is now a **thin execution index**, not a rolling dump. Keep it short so agents do not waste context on obsolete slice logs.

## Objective

Deliver `VISION.md` incrementally: Discover/Search/Settings IA, discovery-first CX, dedicated Search intent, Settings as permanent configuration, and clearer appropriateness/availability/list signals.

## Read path for agents

1. Start here.
2. Read [`docs/vision-execution/current-status.md`](docs/vision-execution/current-status.md) for the active state and next useful slices.
3. Read [`docs/vision-execution/sprint-plan.md`](docs/vision-execution/sprint-plan.md) only when planning or selecting a roadmap slice.
4. Read [`docs/vision-execution/review-index.md`](docs/vision-execution/review-index.md) only when the task touches CEO/PM/QA feedback.
5. Do **not** read archived logs unless auditing history or debugging a regression.

## Current focus

Current sprint: **Sprint 9 — PM/QA trust, retrieval, and accessibility follow-ups**.

Recently landed:

- Exact-title Search ranking now prefers canonical user intent; `/search?q=godfather` puts **The Godfather** (1972) first.
- Discover’s first recommendation row is profile-aware.
- Primary Discover control chrome is normalized to English.
- Movie-detail suitability reasoning now stays visible for Adults/no-limit profiles with explicit **No limit set** category rows.
- Search result cards now annotate abstract availability from existing provider bitmasks only, and their non-destructive hover/active border feedback uses teal/neutral instead of red.

Next useful slices:

1. P0 CEO feedback: fix Discover dropdown filters not showing options. [CEO feedback report](reports/ceo/2026-07-13-dropdown-filters-ceo-feedback.md).
2. Treat Settings-route input labels/accessibility names as an audit-first slice. Visible Settings inputs are label-wrapped; if verification stays clean, record it and spend remaining color-state cleanup on non-destructive red focus indicators rather than inventing new labels.
3. Improve no-profile/wrong-profile copy for list-gated surfaces.
4. Extend QA/modal coverage for movie-detail content, close control, focus/scroll state, suitability, and availability rows.

## Durable agent prompts

- CEO assistant: [`agents/ceo-assistant.md`](agents/ceo-assistant.md)
- PM-tech reviewer: [`agents/pmt.md`](agents/pmt.md)
- Principal engineer: [`agents/principal-engineer.md`](agents/principal-engineer.md)
- QA/CX reviewer: [`agents/qa.md`](agents/qa.md)

## Deferred / do not do yet

- Do not implement true Included/Free/Rent/Buy provider grouping until backend/scraper data supports it.
- Do not implement real person/studio search without backend data.
- Do not implement list ownership/delete semantics beyond current rename/remove-from-profile language.
- Do not rewrite profile/list persistence or KV merge behavior as part of UI cleanup.
- Do not deploy externally unless Alex asks.

## Maintenance rule

Do not append long slice logs here. When detail is no longer immediately useful, move it under [`docs/vision-execution/archive/`](docs/vision-execution/archive/) and keep this file as the current-state router.
