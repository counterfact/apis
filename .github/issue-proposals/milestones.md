---
title: Implement Milestones domain in the GitHub API simulator
---

## Summary

Implement the Milestones domain in the `@counterfact/github` simulator. Milestones
are used to group issues into sprints or releases and are a natural complement to
the already-implemented Issues domain.

## Scope

### Route files to implement (currently returning `$.response[200].random()`)

| File | Handlers | Description |
|------|----------|-------------|
| `routes/repos/{owner}/{repo}/milestones.ts` | GET, POST | List milestones; Create a milestone |
| `routes/repos/{owner}/{repo}/milestones/{milestone_number}.ts` | GET, PATCH, DELETE | Get / update / delete a milestone |

`/milestones/{milestone_number}/labels` may remain a stub.

## Implementation plan

### 1. Extend `RepoState` in `routes/_.context.ts`

Add:

- `milestones: Map<number, milestone>` (keyed by milestone number)
- `nextMilestoneNumber: number` (start at 1)

### 2. Add context methods to `Context` in `routes/_.context.ts`

```ts
saveMilestone(owner, repo, input: Partial<milestone> & { title: string }): milestone
getMilestone(owner, repo, number: number): milestone | undefined
updateMilestone(owner, repo, number: number, patch: Partial<milestone>): milestone | undefined
deleteMilestone(owner, repo, number: number): boolean
listMilestones(owner, repo, query?: {
  state?: 'open' | 'closed' | 'all';
  direction?: string;
  sort?: string;
  per_page?: unknown;
  page?: unknown;
}): milestone[]
```

`saveMilestone` auto-generates `id`, `node_id`, `number`, `url`, `html_url`, `labels_url`,
`created_at`, `updated_at`, `creator` (default user), `open_issues: 0`, `closed_issues: 0`,
`state: 'open'`. If an input `number` is provided (for seeding), use it directly.

Extend `saveIssue` and `savePullRequest` so that when `milestone` is set, the milestone's
`open_issues` / `closed_issues` counts update atomically.

### 3. Implement route handlers

Validate that the repo exists. For the list endpoint, filter by `state` query parameter.

### 4. Seed scenario data

Add a `milestones` scenario function in `scenarios/index.ts` that seeds two milestones on
`counterfact/platform-api` (e.g. `v1.0` open with a due date and `v0.9` closed). Associate
the existing open issue with the `v1.0` milestone. Add `milestones($)` inside `seedGitHub`.

### 5. Write tests

**Unit tests**:

- `saveMilestone` creates a milestone with auto-generated fields.
- `listMilestones` filters by `state`.
- `updateMilestone` merges patch fields.
- `deleteMilestone` returns `false` when not found.
- `open_issues` count updates when an issue is assigned to a milestone.

**HTTP-level tests**:

- `GET /repos/:owner/:repo/milestones` returns the seeded list (filterable by state).
- `POST /repos/:owner/:repo/milestones` creates and returns 201.
- `GET/PATCH/DELETE /repos/:owner/:repo/milestones/:number` work correctly.
- All routes return 404 when the repository does not exist.

## Relevant types

- `types/components/schemas/milestone.ts` — `milestone`
- `types/paths/repos/{owner}/{repo}/milestones.types.ts`
- `types/paths/repos/{owner}/{repo}/milestones/{milestone_number}.types.ts`
