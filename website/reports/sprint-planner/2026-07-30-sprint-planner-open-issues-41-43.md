# Sprint planner report — 2026-07-30 open issues 41–43

Date: 2026-07-30 00:09 Europe/Madrid
Scope: Corrective Ohana static website planning cycle for the working fork (`origin` / `greg-26/static`).

## Inputs inspected

- `website/README.md`, `website/AGENTS.md`, `website/agents/sprint-planner.md`
- `VISION.md`, `DESIGN_GUIDELINES.md`, `CODING_STANDARDS.md`, `VISION_EXECUTION.md`
- `docs/working-style.md`, `sprints/INDEX.md`, the active no-open-issues marker, archived sprint sets, and linked review/planning reports from `docs/vision-execution/review-index.md`
- Current website/API/scraper code relevant to movie detail, Ohana API title enrichment, TMDB country fields, and scraper `originCountries`
- `gh issue list -R greg-26/static --state open` — returned #41, #42, #43
- `gh issue list -R ohanamovies/static --state open` — returned no open issues
- Git status/remotes and safe fast-forward from `origin/main`

## Correction

The previous planner result was wrong for the active tracker: it treated the issue set as empty even though the working origin fork has three open website issues.

Correct issue source for this planning cycle:

- Active: `origin` / `greg-26/static`
- Sanity check only: `upstream` / `ohanamovies/static`

## Git and issue state

- Worktree was clean before edits.
- Local `main` was behind `origin/main` by two commits and was fast-forwarded safely before planning edits.
- Open working-fork issues:
  - [#41 Country of movie](https://github.com/greg-26/static/issues/41)
  - [#42 Share movie icon button](https://github.com/greg-26/static/issues/42)
  - [#43 Movie detail page clutter](https://github.com/greg-26/static/issues/43)
- Upstream `ohanamovies/static` currently has no open issues.

## Archive/supersede action

The incorrect active no-open-issues marker was moved out of the active sprint area without rewriting history:

- from `website/sprints/2026-07-29-no-open-website-issues/`
- to `website/sprints/archive/2026-07-29-no-open-website-issues/`

It remains available as superseded planning history.

## New active sprint folder

Created a brand-new active sprint-set folder:

- `website/sprints/2026-07-30-open-issues-41-43/`

Created sprint files:

- `sprint-038-movie-detail-suitability-clutter.md`
- `sprint-039-movie-detail-share-action.md`
- `sprint-040-title-country-api-and-detail.md`

## Issue mapping

| Issue | Sprint coverage | Planning decision |
| --- | --- | --- |
| [#41 Country of movie](https://github.com/greg-26/static/issues/41) | Sprint 040 | API-first country/origin metadata via Ohana title detail, then quiet website detail display. |
| [#42 Share movie icon button](https://github.com/greg-26/static/issues/42) | Sprint 039 | Direct top-right share icon using Web Share API with clipboard fallback; no 3-dot menu for one action. |
| [#43 Movie detail page clutter](https://github.com/greg-26/static/issues/43) | Sprint 038 | First executable sprint: remove redundant copy/pills and improve maturity category spacing before adding more UI. |

## Roadmap changes

- Updated root `sprints/INDEX.md` to point at the new active sprint set.
- Marked Sprint 038 as the next executable sprint.
- Preserved the completed #37–#39 history under `archive/2026-07-28-open-issues-37-39/`.
- Added this planner report to `docs/vision-execution/review-index.md`.
- Left `VISION_EXECUTION.md` unchanged because it is still the correct thin router to `sprints/INDEX.md`; the active route changed in the index, not in the front door.

## PMT/design notes

No separate PMT note was needed. The three GitHub issues are direct product feedback and are now linked to sprint coverage in the sprint index and issue comments.

Design constraints carried forward:

- Detail page should get quieter before new metadata/actions land.
- Country metadata must not become another boxed section.
- Share should be a direct action, not a menu created only to hold one item.

## Issue comments

Each open origin issue was commented with its planned sprint coverage and kept open for implementation evidence/closure:

- #41 → Sprint 040
- #42 → Sprint 039
- #43 → Sprint 038

## Next executable sprint

Sprint 038 — Movie detail suitability clutter cleanup.

Recommended next action: implementation agent should take Sprint 038 only, run the website build, and comment/close #43 only after evidence confirms the feedback is satisfied.

## Verification

Planning-only verification targets:

```bash
git diff --check
python3 - <<'PY'
from pathlib import Path
import re, sys
paths = [
    Path('website/sprints/INDEX.md'),
    Path('website/sprints/2026-07-30-open-issues-41-43/INDEX.md'),
    *Path('website/sprints/2026-07-30-open-issues-41-43').glob('sprint-*.md'),
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

None for planning. Implementation of Sprint 040 may need API deployment/cache awareness after code lands, but that is not a planning blocker.
