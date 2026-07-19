# Sprint 9 — PM/QA trust, retrieval, and accessibility follow-ups

Status: **Active / validation remaining**
Owner: SDE for implementation slices, PE for sequencing, PMT for product priority.

## Goal

Close remaining product-vision and QA findings that affect trust, retrieval, accessibility, and phone/touch confidence without reopening broad redesign work.

## Required reading for this sprint

- [`../../VISION.md`](../../VISION.md)
- [`../../DESIGN_GUIDELINES.md`](../../DESIGN_GUIDELINES.md)
- [`../../CODING_STANDARDS.md`](../../CODING_STANDARDS.md)
- [`../working-style.md`](../working-style.md)
- Feedback links in [`../vision-execution/review-index.md`](../vision-execution/review-index.md) only when the task touches that area.

## Current state

Implementation slices 73–87 have landed. Automated readiness is green against the reachable Vite dev server. Real-device/human feedback found one concrete mobile polish failure: chip dropdown chevrons are vertically misaligned and two-line maturity/profile menu rows are cramped/cut off ([GitHub issue #6](https://github.com/ohanamovies/static/issues/6)).

Landed coverage:

- `npm run qa:modal`
- `npm run qa:sprint9`
- `npm run qa:mobile-touch`
- `npm run qa:dev-routes`
- `npm run qa:phone-touch` against `http://100.85.92.106:5173/`
- `npm run build`

## Open scope

1. Fix [GitHub issue #6](https://github.com/ohanamovies/static/issues/6) in Sprint 9 before closure:
   - Center chip/dropdown chevrons vertically with the chip label.
   - Give two-line maturity/profile dropdown rows enough mobile height/line-height/padding without making the menu bloated.
   - Verify on an iPhone-width viewport by opening Discover and the maturity/profile dropdown.
2. Finish real-phone validation at `http://100.85.92.106:5173/`, recording pass/fail findings for:
   - Discover availability/dropdown selected-state readability, including issue #6 after the fix.
   - Movie-detail profile chips.
   - Maturity evidence rows.
   - Provider chips.
   - List/profile gate copy.
   - Settings → Lists row scanability.
3. Convert any remaining concrete failures into Sprint 10 or another focused fix sprint. Do not reopen completed work without evidence.

## Acceptance

- Issue #6 is fixed or explicitly deferred by Alex/PMT with a linked decision.
- Real-phone checklist has a dated report or PMT note with pass/fail evidence.
- Any remaining failure has a linked next sprint or explicit defer decision.
- Dev server remains reviewable by Alex.

## Developer notes for next sprint

Add brief notes here only if they are needed to choose or clarify Sprint 10. Link evidence rather than pasting long findings.

- 2026-07-19 15:09 Europe/Madrid — SDE reran `npm run qa:phone-touch` against the reachable Vite server at `http://100.85.92.106:5173/`; all automated readiness checks passed. Remaining blocker is real-phone human/QA validation of the manual checklist items before Sprint 9 can close.
- 2026-07-19 20:07 Europe/Madrid — PE reviewed latest PMT/QA evidence plus open GitHub issues. Human feedback in [issue #6](https://github.com/ohanamovies/static/issues/6) is now the next Sprint 9 fix before closure; keep the slice limited to chevron vertical centering and two-line dropdown row fit.
- 2026-07-19 21:08 Europe/Madrid — SDE implemented the issue #6 polish slice: CSS chevrons are now shape-based/centered instead of glyph-metric dependent, maturity/profile dropdown rows have more height/line-height/padding, and source QA covers both. `npm run qa:mobile-touch`, `npm run qa:phone-touch`, `npm run qa:sprint9`, `npm run qa:modal`, and `npm run build` passed. Real-phone validation of the updated dropdown remains required before Sprint 9 closes.
