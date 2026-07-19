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

Implementation slices 73–87 have landed. The remaining valuable work is real-device validation, not another speculative polish pass.

Landed coverage:

- `npm run qa:modal`
- `npm run qa:sprint9`
- `npm run qa:mobile-touch`
- `npm run qa:dev-routes`
- `npm run qa:phone-touch`
- `npm run build`

## Open scope

1. Run `npm run qa:phone-touch` against the reachable Vite dev server.
2. On a real phone at `http://100.85.92.106:5173/`, record pass/fail findings for:
   - Discover availability/dropdown selected-state readability.
   - Movie-detail profile chips.
   - Maturity evidence rows.
   - Provider chips.
   - List/profile gate copy.
   - Settings → Lists row scanability.
3. Convert concrete failures into the next sprint or a focused fix sprint. Do not reopen completed work without evidence.

## Acceptance

- Phone checklist has a dated report or PMT note with pass/fail evidence.
- Any failure has a linked next sprint or explicit defer decision.
- Dev server remains reviewable by Alex.

## Developer notes for next sprint

Add brief notes here only if they are needed to choose or clarify Sprint 10. Link evidence rather than pasting long findings.
