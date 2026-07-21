# Sprint 008 — Design Closure Hardening

## Status

complete

## Outcome

The initial API implementation is checked against `api/docs/design.md`, gaps are closed or documented, and the sprint index accurately reflects completion readiness.

## Why now

After the Worker, route, mapper, TMDB client, cache, and Wrangler config exist, the project needs a final design-conformance pass before calling the initial API complete.

## Source requirements

- Entire `api/docs/design.md` initial scope.
- Completion criteria in `api/sprints/index.md`.
- Implementation principles: simple, readable, focused, no speculative future enhancements.

## Starting context

- Sprints 001-007 are complete or explicitly reviewed.
- The API package has real verification scripts and deployment configuration.

## Scope

### In scope

- Audit implemented behavior against every initial-scope design requirement.
- Add missing tests for any uncovered required behavior.
- Update `api/docs/design.md` only if implementation intentionally differs from the design and the difference is accepted.
- Update sprint statuses/index based on evidence.
- Tighten documentation for response shape, errors, cache behavior, and environment setup.
- Confirm no future enhancements slipped into initial implementation.

### Out of scope

- New product capabilities.
- Manual invalidation, background refresh, search, recommendations, personalization, accounts, writes, localization, trailers, or multiple metadata providers.
- Deployment to production unless separately requested.
- Broad refactors not required for design conformance.

## Technical guidance

- Treat this as closure, not a grab bag. If a gap is large, create a follow-up sprint instead of burying it here.
- Prefer tests over prose when proving behavior.
- Do not rewrite completed sprint history to pretend execution matched the original plan; record deviations honestly.
- Keep docs accurate and concise.

## Expected file impact

- API tests for gap coverage
- `api/docs/design.md` if an accepted implementation detail needs to be reflected
- `api/README.md` or API docs if created earlier
- `api/sprints/index.md` status updates
- Possibly future sprint file(s) only for real deferred initial-scope gaps

## Implementation sequence

1. Build a checklist from `api/docs/design.md` and `api/sprints/index.md` completion criteria.
2. Compare implementation and tests to the checklist.
3. Add focused tests or small fixes for missing initial-scope behavior.
4. Update docs and sprint statuses based on evidence.
5. Run the full available API verification suite.
6. Report any remaining blockers or open questions.

## Acceptance criteria

- [x] Every initial-scope design requirement is either implemented and tested, or explicitly documented as blocked with a reason.
- [x] Future enhancements are not included in the initial implementation path.
- [x] API docs match observed behavior for route, responses, cache, and environment setup.
- [x] Sprint index reflects current status and next work accurately.
- [x] Full available API verification passes.

## Completion notes

- Added stale-cache fallback coverage for normal requests when TMDB is unavailable, while preserving strict refresh/bypass behavior.
- Updated API documentation to reflect cache override behavior, stale fallback, default TTL, and schema-versioning decisions.
- Verified the full API suite and Wrangler dry-run validation.

## Required tests

- Full route behavior for `200`, `400`, `404`, and `500`.
- Movie and series normalized response coverage.
- KV cache hit/miss/write/failure/refresh/bypass/restriction coverage.
- No raw TMDB leakage in public success/error contracts.
- Worker configuration/build validation if available.

## Verification commands

Run from `api/`:

```sh
npm run typecheck
npm test
```

Also run any real Wrangler validation/build script added by Sprint 007 and report the exact command.

## Handoff

The SDE agent must report:

- summary of changes
- verification performed
- acceptance criteria status
- deviations from the sprint
- newly discovered risks or follow-up work

## Dependencies unlocked

- Initial API design can be considered implementation-complete if no blockers remain.
- Any future enhancement planning can start from an accurate completed baseline.
