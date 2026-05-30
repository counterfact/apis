---
title: Implement Commits domain in the GitHub API simulator
---

## Summary

Implement the Commits domain in the `@counterfact/github` simulator. Commit listing
and lookup are fundamental operations needed by code review tools, changelogs, and
CI/CD integrations. The simulator already generates branch commit objects internally
(via `makeCommit`) — this issue exposes those through the public API.

All state and logic must live in **`routes/repos/_.context.ts`** — the
domain-specific context file for repository features — rather than in the root
`routes/_.context.ts`. Follow the pattern established by `routes/gists/_.context.ts`
and `routes/users/_.context.ts`.

## Scope

### Route files to implement (currently returning `$.response[200].random()`)

| File | Handlers | Description |
|------|----------|-------------|
| `routes/repos/{owner}/{repo}/commits.ts` | GET | List commits |
| `routes/repos/{owner}/{repo}/commits/{ref}.ts` | GET | Get a commit by ref/SHA |
| `routes/repos/{owner}/{repo}/commits/{commit_sha}/comments.ts` | GET, POST | List / create commit comments |
| `routes/repos/{owner}/{repo}/commits/{ref}/status.ts` | GET | Get combined commit status |
| `routes/repos/{owner}/{repo}/commits/{ref}/statuses.ts` | GET | List commit statuses |

`/commits/{commit_sha}/branches-where-head`, `/commits/{commit_sha}/pulls`,
`/commits/{ref}/check-runs`, `/commits/{ref}/check-suites`, and the `/git/commits`
low-level object endpoints may remain as stubs for now.

## Implementation plan

### 1. Extend `RepoState` in `routes/repos/_.context.ts`

Add:

- `commits: Map<string, commit>` (keyed by SHA)
- `commitStatuses: Map<string, status[]>` (keyed by SHA)
- `commitComments: Map<string, commit_comment[]>` (keyed by SHA)
- `nextCommitCommentId: number`

> If `routes/repos/_.context.ts` does not yet exist, create it following the
> same pattern as `routes/gists/_.context.ts` and wire it into the root context
> and `test-support/create-context.ts`. See the "Refactor repos domain" issue
> for a detailed guide.

The existing `makeBranch(owner, repo, branch, actor)` already creates a commit object via
`makeCommit`. Thread that commit into the new `commits` map when `saveRepository` is called
and branches are initialized.

### 2. Add context methods to `Context` in `routes/repos/_.context.ts`

```ts
getCommit(owner, repo, ref: string): commit | undefined
listCommits(owner, repo, query?: { sha?: string; per_page?: unknown; page?: unknown }): commit[]
saveCommitStatus(owner, repo, sha: string, status: {
  state: string;
  context: string;
  description?: string;
  target_url?: string;
}): status
listCommitStatuses(owner, repo, sha: string): status[]
getCombinedStatus(owner, repo, ref: string): combined_commit_status
saveCommitComment(owner, repo, sha: string, input: {
  body: string;
  path?: string;
  line?: number;
}): commit_comment
listCommitComments(owner, repo, sha: string): commit_comment[]
```

`listCommits` returns commits for the default branch (or the branch specified by `sha`),
ordered newest-first, with pagination support. `getCombinedStatus` derives its `state`
from the individual statuses for that ref (failure > error > pending > success > no status),
and populates `combined_commit_status.statuses` with `simple_commit_status` entries.

Also add forwarding methods in `routes/_.context.ts` so that route files can call
`$.context.getCommit(...)` etc. without changes.

### 3. Implement route handlers

Validate that the repository exists. For `GET /commits/{ref}`, resolve branch names and
short SHAs (prefix match) in addition to full SHAs.

### 4. Seed scenario data

Add a `commitStatuses` scenario function in `scenarios/index.ts` that adds CI status
objects (`ci/lint` success, `ci/test` success) to the `main` branch HEAD commit on
`counterfact/actions-demo`. Add `commitStatuses($)` inside `seedGitHub`.

### 5. Write tests

**Unit tests** (`test/repos.context.test.ts` or a new `test/commits.context.test.ts`
that instantiates `routes/repos/_.context.ts` `Context` directly):

- `getCommit` resolves a commit by SHA.
- `listCommits` respects pagination and `sha` filter.
- `getCombinedStatus` returns `success` when all statuses pass and `failure` when any fail.
- `saveCommitComment` creates a comment with auto-generated id and timestamps.

**HTTP-level tests** (`test/routes.test.ts`):

- `GET /repos/:owner/:repo/commits` returns a list of commits.
- `GET /repos/:owner/:repo/commits/:ref` returns the commit for a branch name.
- `GET /repos/:owner/:repo/commits/:sha/comments` returns the comment list.
- `POST /repos/:owner/:repo/commits/:sha/comments` creates a comment and returns 201.
- `GET /repos/:owner/:repo/commits/:ref/status` returns the combined status.
- `GET /repos/:owner/:repo/commits/:ref/statuses` returns individual statuses.
- All routes return 404 when the repository does not exist.

## Relevant types

- `types/components/schemas/commit.ts` — `commit`
- `types/components/schemas/combined-commit-status.ts` — `combined_commit_status`
- `types/components/schemas/status.ts` — `status`
- `types/components/schemas/simple-commit-status.ts` — `simple_commit_status`
- `types/components/schemas/commit-comment.ts` — `commit_comment`
- `types/paths/repos/{owner}/{repo}/commits.types.ts`
- `types/paths/repos/{owner}/{repo}/commits/{ref}.types.ts`
- `types/paths/repos/{owner}/{repo}/commits/{commit_sha}/comments.types.ts`
- `types/paths/repos/{owner}/{repo}/commits/{ref}/status.types.ts`
