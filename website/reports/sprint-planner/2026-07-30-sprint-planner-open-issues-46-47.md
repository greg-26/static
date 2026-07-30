# Sprint planner report — 2026-07-30 open issues 46–47

Date: 2026-07-30 09:21 Europe/Madrid
Scope: Brand-new Ohana static website planning cycle for the working fork (`origin` / `greg-26/static`).

## Inputs inspected

- `website/README.md`, `website/AGENTS.md`, `website/agents/sprint-planner.md`
- `VISION.md`, `DESIGN_GUIDELINES.md`, `CODING_STANDARDS.md`, `VISION_EXECUTION.md`
- `docs/working-style.md`, `sprints/INDEX.md`, active/completed sprint set #41–#43, archived sprint sets, and latest planner reports linked from `docs/vision-execution/review-index.md`
- Current website code relevant to `MovieModal.vue` share behavior, top metadata country display, cast placement, and Ohana API title detail normalization
- `gh issue list -R greg-26/static --state open` — returned #46 and #47
- `gh issue list -R ohanamovies/static --state open` — returned no open issues
- Git status/remotes and safe fast-forward from `origin/main`

## Git and issue state

- Worktree was clean before edits.
- Local `main` was behind `origin/main` by two scraped-data commits and was fast-forwarded safely before planning edits.
- Open working-fork website issues:
  - [#46 Country of movie](https://github.com/greg-26/static/issues/46)
  - [#47 Movie share](https://github.com/greg-26/static/issues/47)
- Upstream `ohanamovies/static` currently has no open issues.

## Archive action

The completed active sprint set was moved out of the active sprint area without rewriting history:

- from `website/sprints/2026-07-30-open-issues-41-43/`
- to `website/sprints/archive/2026-07-30-open-issues-41-43/`

It remains available as completed planning/execution history.

## New active sprint folder

Created a brand-new active sprint-set folder:

- `website/sprints/2026-07-30-open-issues-46-47/`

Created sprint files:

- `sprint-041-movie-share-native-sheet.md`
- `sprint-042-movie-detail-other-metadata.md`

## Issue mapping

| Issue | Sprint coverage | Planning decision |
| --- | --- | --- |
| [#46 Country of movie](https://github.com/greg-26/static/issues/46) | Sprint 042 | Move country below Cast into quiet low-priority metadata; add original title/language/exact release date only when API-backed. |
| [#47 Movie share](https://github.com/greg-26/static/issues/47) | Sprint 041 | Native Web Share sheet is primary on supported mobile browsers; copy/manual link is fallback only and feedback belongs next to the share action. |

No relevant open website issue remains unplanned.

## Roadmap changes

- Updated root `sprints/INDEX.md` to point at the new active sprint set.
- Marked Sprint 041 as the next executable sprint.
- Preserved completed #41–#43 history under `archive/2026-07-30-open-issues-41-43/`.
- Added this planner report to `docs/vision-execution/review-index.md`.
- Left `VISION_EXECUTION.md` unchanged because it remains the correct thin router to `sprints/INDEX.md`; active status changed in the index, not the front door.

## PMT/design notes

No separate PMT note was needed. The two GitHub issues are direct product feedback and are now linked to sprint coverage in the sprint index and issue comments.

Design constraints carried forward:

- Share should use platform convention first, not a copy-first workaround.
- Country/origin metadata is useful but low priority; it should not compete with title, rating, share, suitability, or availability.
- Extra metadata must stay quiet and API-backed; no guessed labels or empty rows.

## Issue comments

Each open origin issue was queued for a scoped issue-reply agent comment and kept open for implementation evidence/closure:

- #46 → Sprint 042
- #47 → Sprint 041

## Next executable sprint

Sprint 041 — Movie share native sheet hardening.

Recommended next action: implementation agent should take Sprint 041 only, verify native Web Share behavior on supported mobile or with a controlled mock, run the website build, and comment/close #47 only after evidence confirms the feedback is satisfied.

## Verification

Planning-only verification targets:

```bash
git diff --check
python3 - <<'PY'
from pathlib import Path
import re, sys
paths = [
    Path('website/sprints/INDEX.md'),
    Path('website/sprints/2026-07-30-open-issues-46-47/INDEX.md'),
    *Path('website/sprints/2026-07-30-open-issues-46-47').glob('sprint-*.md'),
    Path('website/docs/vision-execution/review-index.md'),
]
fail = []
for path in paths:
    text = path.read_text()
    for target in re.findall(r'\[[^\]]+\]\(([^)]+)\)', text):
        if '://' in target or target.startswith('#'):
            continue
        target = target.split('#', 1)[0]
        if target and not (path.parent / target).resolve().exists():
            fail.append(f'{path}: missing {target}')
if fail:
    print('\n'.join(fail))
    sys.exit(1)
print('markdown paths ok')
PY
```

## Blockers

None for planning. Sprint 041 requires mobile/native-share verification; Sprint 042 may require API/title-detail field exposure if original title, language, or exact release date are not currently returned.
