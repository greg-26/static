# Sprint 9 — PM/QA trust, retrieval, and accessibility follow-ups

Status: **superseded/archived** — removed from active website planner on 2026-07-22 at Alex's request. Historical implementation evidence is preserved below; no active sprint work should point here.
Owner: historical sprint implementation agent for implementation slices, sprint planner for sequencing, PMT for product priority.

## Goal

Close remaining product-vision and QA findings that affect trust, retrieval, accessibility, and phone/touch confidence without reopening broad redesign work.

## Required reading for this sprint

- [`../../../VISION.md`](../../../VISION.md)
- [`../../../DESIGN_GUIDELINES.md`](../../../DESIGN_GUIDELINES.md)
- [`../../../CODING_STANDARDS.md`](../../../CODING_STANDARDS.md)
- [`../../working-style.md`](../../working-style.md)
- Feedback links in [`../review-index.md`](../review-index.md) only when the task touches that area.

## Current state

Implementation slices 73–87 have landed. Automated readiness is green against the reachable Vite dev server. The concrete mobile polish failure originally tracked on the upstream issue tracker has been fixed locally; the working fork (`greg-26/static`) has no matching Sprint 9 issue to close. Real-phone validation of that fix and the rest of the checklist remains before Sprint 9 can close.

Landed coverage:

- `npm run qa:modal`
- `npm run qa:sprint9`
- `npm run qa:mobile-touch`
- `npm run qa:dev-routes`
- `npm run qa:phone-touch` against `http://100.85.92.106:5173/`
- `npm run build`

## Former open scope

1. Finish real-phone validation at `http://100.85.92.106:5173/`, recording pass/fail findings for:
   - Discover availability/dropdown selected-state readability, including the local chevron/row-height fix.
   - Movie-detail profile chips.
   - Maturity evidence rows.
   - Provider chips.
   - List/profile gate copy.
   - Settings → Lists row scanability.
2. Record a dated validation report/PMT note confirming whether the local chevron/row-height fix is good enough. Do not close upstream/original issues from automation; the working fork has no matching Sprint 9 issue.
3. Convert any remaining concrete failures into Sprint 10 or another focused fix sprint. Do not reopen completed work without evidence.

## Former acceptance

- The local dropdown/mobile polish fix is validated on a real phone, or Alex/PMT explicitly defers it with a linked decision.
- Real-phone checklist has a dated report or PMT note with pass/fail evidence.
- Any remaining failure has a linked next sprint or explicit defer decision.
- Dev server remains reviewable by Alex.

## Historical developer notes

Preserved from the active sprint file for audit/history. Do not treat these as next-work instructions.

- 2026-07-19 15:09 Europe/Madrid — SDE reran `npm run qa:phone-touch` against the reachable Vite server at `http://100.85.92.106:5173/`; all automated readiness checks passed. Remaining blocker is real-phone human/QA validation of the manual checklist items before Sprint 9 can close.
- 2026-07-19 20:07 Europe/Madrid — PE reviewed latest PMT/QA evidence plus open GitHub issues. Human feedback in [issue #6](https://github.com/ohanamovies/static/issues/6) is now the next Sprint 9 fix before closure; keep the slice limited to chevron vertical centering and two-line dropdown row fit.
- 2026-07-19 21:08 Europe/Madrid — SDE implemented the issue #6 polish slice: CSS chevrons are now shape-based/centered instead of glyph-metric dependent, maturity/profile dropdown rows have more height/line-height/padding, and source QA covers both. `npm run qa:mobile-touch`, `npm run qa:phone-touch`, `npm run qa:sprint9`, `npm run qa:modal`, and `npm run build` passed. Real-phone validation of the updated dropdown remains required before Sprint 9 closes.
- 2026-07-20 00:07 Europe/Madrid — PE reviewed open human feedback. [GitHub issue #7](https://github.com/ohanamovies/static/issues/7) is planned as Sprint 10: make the current Where-to-watch country explicit, with Spain read-only unless the data pipeline proves multi-country availability. This does not change Sprint 9 closure criteria.
- 2026-07-20 03:07 Europe/Madrid — SDE wake-up found no implementation slice ready after the issue #6 fix. Dev server responds at `http://100.85.92.106:5173/`; Sprint 9 remains blocked on real-phone human/QA validation of the listed checklist before closure.
- 2026-07-20 04:07 Europe/Madrid — PE reviewed latest PMT/SDE/QA evidence plus open issues #6/#7. Planning remains: close Sprint 9 only after real-phone validation confirms the local issue #6 polish; keep Sprint 10 as the next country-context slice from issue #7.
- 2026-07-20 15:07 Europe/Madrid — SDE verified the working fork issue tracker (`greg-26/static`) has open issues #1 and #2 only; issue #6 is not resolvable there, so Sprint 9 closure/commenting is blocked until the real-phone validation target issue is clarified or validation evidence is provided. Dev server still responds at `http://100.85.92.106:5173/`.
- 2026-07-20 16:07 Europe/Madrid — PE aligned Sprint 9 with the working-fork issue policy: do not touch upstream issue #6 from automation. Sprint 9 closure now needs real-phone validation evidence/PMT decision; no fork issue closure is expected unless PMT creates one.
- 2026-07-20 19:07 Europe/Madrid — SDE found no implementation slice ready: Sprint 9 remains blocked on real-phone validation/PMT decision for the local dropdown/mobile polish fix. Working fork issues are still #1/#2 for Sprint 10 country/source context, not Sprint 9 closure. Dev server responds at `http://100.85.92.106:5173/`.
