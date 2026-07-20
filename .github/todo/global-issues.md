---
title: Implement global Issues listing in the GitHub API simulator
---

## Summary

Implement the global `/issues` endpoint in `@counterfact/github` so `GET /issues` returns deterministic results from simulator state rather than a random response. The per-repo issues domain is already implemented in the repos context; this task wires the global listing on top of it.

## Scope

### Route files to implement

- `routes/issues.ts` — `GET /issues` (list issues across all repos for the authenticated user)

## Implementation plan

1. Add a `listAllIssues` method to `routes/repos/_.context.ts` that aggregates issues across all stored repositories, with optional filtering by `filter`, `state`, `labels`, `sort`, and `direction` query parameters, and pagination via `per_page` / `page`.
2. Add a forwarding method `listAllIssues` in `routes/_.context.ts` delegating to the repos context.
3. Update `routes/issues.ts` to call `$.context.listAllIssues($.query)` and return a `200` JSON response.
4. Add context unit tests verifying that `listAllIssues` aggregates across multiple repos and applies `state` filtering correctly.
5. Add HTTP-level tests for `GET /issues`:
   - Returns issues from all seeded repos.
   - `?state=closed` returns only closed issues.
   - Returns an empty array when no repos have issues.
