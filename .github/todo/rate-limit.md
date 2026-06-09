---
title: Implement Rate Limit domain in the GitHub API simulator
---

## Summary

Implement the Rate Limit domain in `@counterfact/github` so `GET /rate_limit` returns deterministic and stateful rate-limit data.

## Scope

### Route files to implement

- `routes/rate_limit.ts` — `GET /rate_limit`

## Implementation plan

1. Add `routes/rate_limit/_.context.ts` for core and resource-specific rate-limit counters.
2. Wire the rate-limit context into `routes/_.context.ts` and `test-support/create-context.ts`.
3. Update `routes/rate_limit.ts` to return context-backed rate-limit payloads.
4. Seed baseline rate-limit state in scenarios and include it in `seedGitHub`.
5. Add context unit tests and HTTP-level tests for deterministic responses and state changes.
