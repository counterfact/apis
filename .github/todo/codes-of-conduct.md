---
title: Implement Codes of Conduct domain in the GitHub API simulator
---

## Summary

Implement the Codes of Conduct domain in `@counterfact/github` so `GET /codes_of_conduct` and `GET /codes_of_conduct/{key}` return deterministic fixture data rather than random responses.

## Scope

### Route files to implement

- `routes/codes_of_conduct.ts` — list all codes of conduct
- `routes/codes_of_conduct/{key}.ts` — get a specific code of conduct by key

## Implementation plan

1. Add `routes/codes_of_conduct/_.context.ts` with a `Context` class that manages a map of key → `code_of_conduct` objects. Seed with the real well-known CoC entries: `mit`, `lgpl-2.1`, `mpl-2.0`, `agpl-3.0`, `unlicense`, `apache-2.0`, `gpl-2.0`, `gpl-3.0`, `bsd-2-clause`, `bsd-3-clause`, `cc0-1.0`, and `contributor_covenant`.
2. Wire the codes_of_conduct context into `routes/_.context.ts` (load via `$.loadContext('/codes_of_conduct')`) and register it in `test-support/create-context.ts` under the `/codes_of_conduct` path.
3. Update `routes/codes_of_conduct.ts` to return `listCodesOfConduct()` from context.
4. Update `routes/codes_of_conduct/{key}.ts` to return the matching CoC or 404.
5. Seed CoC fixtures via a scenario helper and call it inside `seedGitHub`.
6. Add context unit tests and HTTP-level route tests covering list, get-by-key, and 404 for unknown keys.
