---
title: Implement Licenses domain in the GitHub API simulator
---

## Summary

Implement the Licenses domain in `@counterfact/github` so license listing and lookup endpoints return deterministic simulator data.

## Scope

### Route files to implement

- `routes/licenses.ts` — `GET /licenses`

## Implementation plan

1. Add `routes/licenses/_.context.ts` to store and query known SPDX-style license entries.
2. Wire the licenses context into `routes/_.context.ts` and `test-support/create-context.ts`.
3. Update `routes/licenses.ts` to use context-backed list logic.
4. Seed representative license fixtures in scenarios and include them in `seedGitHub`.
5. Add context unit tests in `test/licenses.context.test.ts` and HTTP-level route tests.
