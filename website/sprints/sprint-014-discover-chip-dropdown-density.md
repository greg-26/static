# Sprint 014 — Discover chip dropdown density

## Status
ready

## Outcome

Discover filter chip dropdowns feel tighter and easier to scan by removing low-value subtitle text from the menu options.

## Why now

Alex added working-fork issue [#10](https://github.com/greg-26/static/issues/10) after Sprint 013 was planned. It is a small, user-visible Discover control polish fix and should land as the next standalone non-API slice after the Search/recents sprint rather than being bundled into API detail work.

## Source requirements

- Issue #10: filter chip dropdowns at the top of Discover have title and subtitle text, making the dropdown too wide; remove the subtitle because it does not add value.
- `VISION.md`: chip text must never wrap; long chip labels should truncate, shorten, or move into a menu/detail surface.
- `DESIGN_GUIDELINES.md`: reduce noise and prefer scannable controls over explanatory copy.
- Current Discover controls live under `HeroSection.vue` and related reusable chip/dropdown primitives.

## Starting context

- Discover uses compact chip/dropdown controls for temporary filters.
- Prior PMT feedback already called out chip/dropdown width, state, and mobile touch polish.
- Sprint 013 is focused on Search/recents and should not absorb Discover filter changes.

## Scope

### In scope

- Remove subtitle/helper text from Discover filter chip dropdown options where it creates wide/fat menus.
- Preserve option labels, selected state, keyboard/touch behavior, and current filter semantics.
- Keep dropdown option layout reusable and compact instead of adding one-off CSS just for this menu.
- Add or update a targeted source/QA check if cheap, focused on absence of subtitle text and preserved dropdown option labels.

### Out of scope

- Changing filter taxonomy, option order, or filter persistence.
- Reworking chip selected/open/disabled states beyond what is required to remove subtitles safely.
- Discover row deduplication from issue #7.
- Closing issue #10; closure belongs to the implementation completion workflow after verification.

## Technical guidance

- Prefer deleting subtitle rendering/data for Discover filter dropdown options over hiding it with CSS.
- If the option component is shared, make subtitle optional and ensure controls without subtitles have sensible spacing.
- Keep labels short and single-line; do not replace subtitles with long label text.
- Verify the dropdown still communicates enough through the chip label and selected option label.

## Expected file impact

- `src/components/HeroSection.vue` or the component that defines Discover filter dropdown options
- Shared chip/dropdown primitive only if subtitle rendering is centralized
- Optional targeted QA/source inspection script
- Sprint docs after implementation

## Implementation sequence

1. Inspect Discover chip/dropdown option data and rendering paths.
2. Remove low-value subtitles from the affected dropdown options.
3. Tighten shared option spacing only if subtitle removal leaves awkward gaps.
4. Verify selected labels, open/close behavior, and current filter application still work.
5. Add/update targeted QA if cheap and run build.
6. Update Sprint 014 evidence and comment/close issue #10 only if fully satisfied.

## Acceptance criteria

- [ ] Discover filter dropdown options no longer show subtitle/helper text that makes menus wide.
- [ ] Option labels remain clear, single-line, and scannable.
- [ ] Current filter selection and persistence behavior is unchanged.
- [ ] Keyboard/touch open, select, and dismiss behavior is not regressed.
- [ ] No unrelated Search, Settings, or movie-detail surfaces change.
- [ ] Issue #10 has implementation evidence comments only after the sprint is complete.

## Required tests

- `npm run build`
- Targeted source/QA inspection for subtitle removal and preserved option labels if cheap.
- Manual smoke: `/discover`, open each filter chip dropdown, select options, mobile-width dropdown scan.

## Verification commands

```bash
cd website
npm run build
```

## Handoff

Report which dropdown subtitles were removed, files changed, verification commands, and whether issue #10 was closed or left open with blockers.

## Dependencies unlocked

- Frees the roadmap to resume API/provider detail work without leaving an easy Discover control annoyance in the queue.
