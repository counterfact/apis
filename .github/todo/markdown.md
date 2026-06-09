---
title: Implement Markdown domain in the GitHub API simulator
---

## Summary

Implement the Markdown domain in `@counterfact/github` so markdown rendering endpoints return deterministic output from simulator logic rather than random responses.

## Scope

### Route files to implement

- `routes/markdown.ts` — markdown rendering operations

## Implementation plan

1. Add `routes/markdown/_.context.ts` for markdown rendering behavior and validation rules.
2. Wire markdown context into `routes/_.context.ts` and `test-support/create-context.ts`.
3. Update `routes/markdown.ts` to delegate behavior to context methods.
4. Add startup fixtures or helper scenario setup as needed for deterministic rendering tests.
5. Add context unit tests and HTTP-level route tests for success and invalid-input behavior.
