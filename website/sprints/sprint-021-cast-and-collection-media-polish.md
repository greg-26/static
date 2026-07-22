# Sprint 021 — Cast and collection media polish

## Status
ready

## Outcome

Cast entries show profile photos when the API supplies them, and collection movie posters are large enough to be useful without overpowering the movie-detail modal.

## Why now

Working-fork issue [#14](https://github.com/greg-26/static/issues/14) asks for cast profile photos. Issue [#15](https://github.com/greg-26/static/issues/15) asks for larger collection movie posters. The production API already exposes cast `profile` images and the website API normalizer already emits `profileUrl`, so this can be a focused UI polish sprint.

## Source requirements

- Issue #14: add profile photos for cast people; create an API dependency only if unavailable.
- Issue #15: make collection movie posters larger.
- `DESIGN_GUIDELINES.md`: avoid noisy extra boxes; keep detail surfaces scannable.

## Starting context

- Production API smoke for `tt0120737` returns cast entries with `profile.url` and sizes.
- `website/src/lib/ohanaApi.js` normalizes cast `profileUrl`.
- `MovieModal.vue` currently renders cast as text-only cards and collection items as small horizontal cards.

## Scope

### In scope

- Render cast `profileUrl` as a small portrait/avatar image with graceful fallback initials or no-image treatment.
- Keep cast name/role truncation usable on mobile.
- Increase collection poster/card size enough to read the posters while preserving horizontal scrolling.
- Add image loading/fallback behavior that avoids broken boxes.
- Add targeted source QA for cast photo rendering and collection sizing.

### Out of scope

- API changes unless cast `profile` data disappears during implementation verification.
- Cast detail pages, person search, or full cast expansion.
- Carousel behavior for collections.
- Parent-guide changes from Sprint 020.

## Technical guidance

Use the existing `profileUrl` from normalized API detail. Prefer `loading="lazy"`, explicit dimensions/aspect ratio, and `object-fit: cover`. Keep card tap targets and horizontal scroll comfortable on mobile.

## Expected file impact

- `src/components/MovieModal.vue`
- Optional `scripts/qa-sprint21-cast-collection-media.mjs`
- `package.json` script entry if a QA script is added

## Implementation sequence

1. Verify a production API sample still includes cast profile images.
2. Render cast photos with fallback states.
3. Increase collection poster/card size and adjust mobile horizontal scroll spacing.
4. Add targeted QA.
5. Run modal QA and build.

## Acceptance criteria

- [ ] Cast cards show profile photos when `profileUrl` exists.
- [ ] Missing cast photos fall back gracefully without layout jumps or broken images.
- [ ] Collection movie posters are visibly larger and remain portrait-correct.
- [ ] Collection/cast sections remain below where-to-watch/seasons per Sprint 019 ordering.
- [ ] No API dependency issue is created unless the API contract no longer supplies cast profiles.

## Required tests

- Production API sample check for cast profiles.
- Targeted source/style QA.

## Verification commands

```bash
cd website
npm run qa:sprint21
npm run qa:modal
npm run build
git diff --check
```

## Handoff

After Sprint 021, issue #14 should be closed if cast photos render. Issue #15 should be eligible for closure if Sprints 019 and 020 are also complete.

## Dependencies unlocked

- Completes current cast/collection visual polish without needing backend work.
