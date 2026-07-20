---
title: Implement Gitignore domain in the GitHub API simulator
---

## Summary

Implement the Gitignore domain in `@counterfact/github` so `GET /gitignore/templates` and `GET /gitignore/templates/{name}` return deterministic fixture data rather than random responses.

## Scope

### Route files to implement

- `routes/gitignore/templates.ts` — list all available template names
- `routes/gitignore/templates/{name}.ts` — get a specific gitignore template by name

## Implementation plan

1. Add `routes/gitignore/_.context.ts` with a `Context` class that manages a map of template name → `gitignore_template` objects. Seed with a small but representative set of real templates (e.g. Node, Python, Ruby, Go, Java).
2. Wire the gitignore context into `routes/_.context.ts` (load via `$.loadContext('/gitignore')`) and register it in `test-support/create-context.ts` under the `/gitignore` path.
3. Update `routes/gitignore/templates.ts` to return `Object.keys(templates)` from context.
4. Update `routes/gitignore/templates/{name}.ts` to return the matching template or 404.
5. Seed templates via a scenario helper and call it inside `seedGitHub`.
6. Add context unit tests and HTTP-level route tests covering list, get-by-name, and 404 for unknown templates.
