---
title: Implement remaining Search domain endpoints in the GitHub API simulator
---

## Summary

Complete the Search domain in `@counterfact/github`. The `/search/repositories` and `/search/issues` endpoints already delegate to the repos context. The remaining five endpoints — code, commits, labels, topics, and users — still return random responses. Implement them by wiring into the existing repos and users contexts.

## Scope

### Route files to implement (currently returning `$.response[200].random()`)

| File | Handler | Description |
|------|---------|-------------|
| `routes/search/users.ts` | GET | Search users and organizations |
| `routes/search/commits.ts` | GET | Search commits |
| `routes/search/labels.ts` | GET | Search labels within a repository |
| `routes/search/topics.ts` | GET | Search topics |
| `routes/search/code.ts` | GET | Search code (file contents) |

Note: `routes/search/repositories.ts` and `routes/search/issues.ts` are already implemented via the repos context and do not need changes.

## Implementation plan

### 1. Add search methods to `routes/repos/_.context.ts`

Add the following methods (reuse existing data maps; no new state needed):

```ts
searchUsers(query: { q: unknown; per_page?: unknown; page?: unknown }): { total_count: number; incomplete_results: boolean; items: simple_user[] }
searchCommits(query: { q: unknown; per_page?: unknown; page?: unknown }): { total_count: number; incomplete_results: boolean; items: commit[] }
searchLabels(query: { repository_id: unknown; q: unknown; per_page?: unknown; page?: unknown }): { total_count: number; incomplete_results: boolean; items: label_search_result_item[] }
searchTopics(query: { q: unknown; per_page?: unknown; page?: unknown }): { total_count: number; incomplete_results: boolean; items: topic_search_result_item[] }
searchCode(query: { q: unknown; per_page?: unknown; page?: unknown }): { total_count: number; incomplete_results: boolean; items: code_search_result_item[] }
```

- `searchUsers`: filter `users` and `organizations` maps by matching login or name against the `q` string.
- `searchCommits`: filter commits across all repos; match against commit message.
- `searchLabels`: filter labels for the given `repository_id`; match name or description against `q`.
- `searchTopics`: return an empty result set initially; topic state can be extended later.
- `searchCode`: return an empty result set initially; file content state can be extended later.

All methods should apply basic pagination via `per_page` and `page`.

### 2. Add forwarding methods in `routes/_.context.ts`

Wire `searchUsers`, `searchCommits`, `searchLabels`, `searchTopics`, and `searchCode` in the root context, delegating to the repos context (where users and orgs data also reside via the users context delegate).

### 3. Implement route handlers

Update each route to call the corresponding context method and return a `200` JSON response with the search result payload.

### 4. Write tests

**HTTP-level tests** (`test/routes.test.ts`):
- `GET /search/users?q=octocat` returns users matching the query.
- `GET /search/commits?q=fix` returns commits matching the message.
- `GET /search/labels?repository_id=…&q=bug` returns matching labels.
- `GET /search/topics?q=api` returns an empty result without error.
- `GET /search/code?q=hello` returns an empty result without error.

## Relevant types

- `types/components/schemas/user-search-result-item.ts`
- `types/components/schemas/commit-search-result-item.ts`
- `types/components/schemas/label-search-result-item.ts`
- `types/components/schemas/topic-search-result-item.ts`
- `types/components/schemas/code-search-result-item.ts`
