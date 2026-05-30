---
title: Refactor repos domain into routes/repos/_.context.ts
---

## Summary

The Releases domain has already been fully implemented — context methods
(`saveRelease`, `getRelease`, `getReleaseByTag`, `getLatestRelease`,
`updateRelease`, `deleteRelease`, `listReleases`), route handlers, scenario
seed data, and tests all exist.

However, the implementations live inside `routes/_.context.ts`, which now
exceeds 1 900 lines. Following the same pattern used for the Gists domain
(`routes/gists/_.context.ts`) and the Users domain
(`routes/users/_.context.ts`), all per-repository state and methods should
be extracted into a new **`routes/repos/_.context.ts`** domain context.
This will keep the root context as a thin coordinator and make each domain
independently testable.

## Scope

Extract all of the following from `routes/_.context.ts` into the new
`routes/repos/_.context.ts`:

- `RepoState` type and the `reposByKey` map
- All counter fields: `nextRepoId`, `nextIssueId`, `nextIssueCommentId`,
  `nextPullId`, `nextReviewId`, `nextWorkflowId`, `nextRunId`, `nextJobId`
- Helper functions scoped to repo data: `makeBranch`, `makeCommit`,
  `makeReadme`, `repoKey`, `syncRepoCounts`
- All context methods: `saveRepository`, `getRepository`, `hasRepository`,
  `updateRepository`, `deleteRepository`, `listRepositories`,
  `listUserRepositories`, `listRepositoriesForOwner`,
  `getRepositoryReadme`, `getRepositoryBranch`,
  `saveIssue`, `getIssue`, `listIssues`, `saveIssueComment`,
  `listIssueComments`,
  `savePullRequest`, `getPullRequest`, `listPullRequests`,
  `savePullRequestReview`, `listPullRequestReviews`,
  `saveWorkflow`, `listWorkflows`, `saveWorkflowRun`, `listWorkflowRuns`,
  `saveWorkflowJob`, `listWorkflowJobs`,
  `saveRelease`, `getRelease`, `getReleaseByTag`, `getLatestRelease`,
  `updateRelease`, `deleteRelease`, `listReleases`,
  `searchRepositories`, `searchIssuesAndPullRequests`

## Implementation plan

### 1. Create `routes/repos/_.context.ts`

Move all imports, types, helpers, and the `Context` class listed above
from `routes/_.context.ts` into a new `routes/repos/_.context.ts`.

The new `Context` class must use `$.loadContext('/users')` to access user
and organization data (same as the root context does today), so it needs
the same `UsersContext` type reference.

```ts
// routes/repos/_.context.ts
import type { Context$ } from "../../types/_.context.js";
import { toSimpleUser, type Context as UsersContext } from "../users/_.context.js";
// ... all other imports and the full Context class
```

### 2. Update `routes/_.context.ts` to delegate

The root context becomes a coordinator that loads the repos context at
`/repos` and forwards every repos-related method to it, exactly as it
already does for gists and users.

```ts
// routes/_.context.ts
import type { Context as ReposContext } from "./repos/_.context.js";

export class Context {
  constructor(private readonly $: Context$) {}

  private reposContext(): ReposContext {
    return this.$.loadContext("/repos") as ReposContext;
  }

  saveRepository(...args) { return this.reposContext().saveRepository(...args); }
  hasRepository(...args) { return this.reposContext().hasRepository(...args); }
  listRepositories(...args) { return this.reposContext().listRepositories(...args); }
  // ... all other forwarding methods
}
```

### 3. Update `test-support/create-context.ts`

Register the new repos context in the `loadContext` switch so that the
test harness wires it up:

```ts
import { Context as ReposContext } from "../routes/repos/_.context.js";

case "/repos":
  created = new ReposContext({ loadContext, readJson: async () => ({}) });
  break;
```

### 4. Add `test/repos.context.test.ts`

Create a new unit-test file that instantiates `ReposContext` directly
(without going through the root context) and covers the already-tested
scenarios currently found in `test/context.test.ts`. The existing
`test/context.test.ts` integration tests may remain as-is to confirm the
delegation still works end-to-end.

### 5. Verify existing tests still pass

Run `npm test` to confirm no regressions. The public surface of
`$.context` in route files does not change, so no route handler edits
should be required.

## Relevant files

- `routes/_.context.ts` — source of the extraction
- `routes/repos/_.context.ts` — new file
- `routes/gists/_.context.ts` — reference pattern
- `routes/users/_.context.ts` — reference pattern
- `test-support/create-context.ts` — needs `/repos` registration
- `test/repos.context.test.ts` — new test file
- `test/context.test.ts` — existing root-context integration tests
