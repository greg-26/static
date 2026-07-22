# Sprint 020 — Parent-guide tags and density

## Status
complete — implemented and verified 2026-07-22; issue #16 closure delegated to the issue workflow.

## Outcome

The movie-detail parent guide regains useful per-dimension content tags and presents scores, progress bars, and guide links in compact rows that scan well on mobile.

## Why now

Working-fork issue [#16](https://github.com/greg-26/static/issues/16) specifically calls out missing parent-guide tags and a too-tall two-line score presentation. Issue [#15](https://github.com/greg-26/static/issues/15) also asks the IMDb guide and Common Sense Media links to look like actual links instead of chips.

## Source requirements

- Issue #16: restore content tags for each parent-guide dimension; upstream may show the prior model.
- Issue #16: make the two lines after the progress bar a single compact line, likely using `justify-content: space-between`.
- Issue #15: parent-guide IMDb/CSM links should be actual blue text links, not chips.
- `DESIGN_GUIDELINES.md`: suitability should explain why a title fits/fails the active profile.

## Starting context

- `MovieModal.vue` currently contains compatibility/parent-guide score UI and external guide links.
- Upstream may contain prior tag logic; inspect before inventing a replacement.

## Scope

### In scope

- Inspect upstream/current data and code for parent-guide dimension tags.
- Restore tags when source data exists; otherwise preserve a clear TODO/data blocker note with evidence.
- Combine score/label copy below each progress bar into a single compact line.
- Convert IMDb guide and CSM actions into normal external text links with clear focus/tap states.
- Keep cross-profile chip drill-down behavior intact.

### Out of scope

- Reordering modal sections; Sprint 019 owns it.
- Changing maturity scoring semantics or profile persistence.
- Adding new ratings data not present in current/upstream/API data.

## Technical guidance

Do not reintroduce dense tables or boxed explanations. Tags should be short, wrap only when necessary, and support scanning. If tags are sourced from upstream, port the smallest compatible data path and document it near the normalization code.

## Expected file impact

- `src/components/MovieModal.vue`
- Possible maturity/extra-detail helper module if existing data supports tags there
- Optional targeted QA script for parent-guide tags/rows/links

## Implementation sequence

1. Inspect upstream/current implementation for prior parent-guide tag fields and rendering.
2. Restore or normalize tags with minimal data-shape changes.
3. Redesign parent-guide row footer into a single compact line.
4. Restyle guide links as actual blue links with accessible tap/focus states.
5. Add targeted QA for tag rendering, row density, score visibility, and link style.
6. Run build and modal QA.

## Acceptance criteria

- [ ] Parent-guide dimensions show restored content tags when tag data exists.
- [ ] Each parent-guide dimension uses one compact score/detail line after the progress bar.
- [ ] The numeric score remains easy to see on mobile and preserves one-decimal display where available.
- [ ] IMDb guide and CSM are styled/announced as normal external links, not chips.
- [ ] Existing maturity/profile compatibility behavior is preserved.

## Required tests

- Targeted parent-guide source/style QA.
- Manual smoke on at least one title with populated parent-guide data.

## Verification commands

```bash
cd website
npm run qa:sprint20
npm run qa:modal
npm run build
git diff --check
```

## Handoff

Do not close issue #15 yet unless Sprint 021 is also complete. Close issue #16 when this sprint is fully verified.

### 2026-07-22 implementation notes

- Restored parent-guide tags by falling back from local `/extra.json` to the canonical `https://ohana.tv/extra.json` enrichment source when local enrichment is absent.
- Confirmed the canonical enrichment source has populated category tags for `tt0111161` (`SEXUAL_CONTENT`, `VIOLENCE`, `PROFANITY`, `ALCOHOL_DRUGS`; violence examples include `blood`, `gore`, `intense`).
- Kept profile drill-down behavior intact; the selected detail profile still affects only local compatibility reasoning.
- Reworked each parent-guide row into label/score, progress bar, one compact status/detail line, then horizontally-scannable tags.
- Restyled IMDb guide and CSM actions as normal blue underlined external text links with focus states, not chip pills.

Verification passed:

```bash
npm run qa:sprint20
npm run qa:modal
npm run build
git diff --check
```

## Dependencies unlocked

- Completes the parent-guide half of the current movie-detail feedback tranche.
