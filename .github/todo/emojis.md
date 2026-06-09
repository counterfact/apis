---
title: Implement Emojis domain in the GitHub API simulator
---

## Summary

Implement the Emojis domain in `@counterfact/github` so `GET /emojis` returns deterministic simulator data instead of random responses.

## Scope

### Route files to implement

- `routes/emojis.ts` — `GET /emojis`

## Implementation plan

1. Add a dedicated context at `routes/emojis/_.context.ts` to manage emoji fixtures and retrieval.
2. Wire the emojis context into `routes/_.context.ts` and `test-support/create-context.ts`.
3. Update `routes/emojis.ts` to delegate to context methods.
4. Add an `emojis` scenario in `scenarios/index.ts` and include it in `seedGitHub`.
5. Add context unit tests in `test/emojis.context.test.ts` and HTTP-level tests in `test/routes.test.ts`.
