---
title: Implement Meta domain in the GitHub API simulator
---

## Summary

Implement the Meta domain in `@counterfact/github` so `GET /meta` returns stable API metadata and domain values from simulator state.

## Scope

### Route files to implement

- `routes/meta.ts` — `GET /meta`

## Implementation plan

1. Add `routes/meta/_.context.ts` to manage API metadata fixture values.
2. Wire meta context into `routes/_.context.ts` and `test-support/create-context.ts`.
3. Update `routes/meta.ts` to return data from context.
4. Seed realistic metadata via scenarios and include it in `seedGitHub`.
5. Add context unit tests and HTTP-level tests for the meta endpoint.
