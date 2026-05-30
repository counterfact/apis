# Implement Labels domain in the GitHub API simulator

## Summary

Implement the Labels domain in the `@counterfact/github` simulator. Labels are
tightly coupled with the already-implemented Issues and Pull Requests, and are needed
to make the issues API feel complete when working with issue management tooling.

## Scope

### Route files to implement (currently returning `$.response[200].random()`)

| File | Handlers | Description |
|------|----------|-------------|
| `routes/repos/{owner}/{repo}/labels.ts` | GET, POST | List labels; Create a label |
| `routes/repos/{owner}/{repo}/labels/{name}.ts` | GET, PATCH, DELETE | Get / update / delete a label |
| `routes/repos/{owner}/{repo}/issues/{issue_number}/labels.ts` | GET, POST, PUT, DELETE | List / add / replace / remove labels on an issue |
| `routes/repos/{owner}/{repo}/issues/{issue_number}/labels/{name}.ts` | DELETE | Remove a label from an issue |

Runner labels (`orgs/{org}/actions/runners/.../labels` and `repos/.../actions/runners/.../labels`)
and search labels may remain as stubs.

## Implementation plan

### 1. Extend `RepoState` in `routes/_.context.ts`

Add `labels: Map<string, label>` to the per-repo state (keyed by label name, which is unique
per repo in the GitHub API).

### 2. Add context methods to `Context` in `routes/_.context.ts`

```ts
saveLabel(owner, repo, input: { name: string; color: string; description?: string }): label
getLabel(owner, repo, name: string): label | undefined
updateLabel(owner, repo, name: string, patch: Partial<label>): label | undefined
deleteLabel(owner, repo, name: string): boolean
listLabels(owner, repo, query?): label[]
addLabelToIssue(owner, repo, issueNumber: number, names: string[]): label[]
removeLabelFromIssue(owner, repo, issueNumber: number, name: string): boolean
replaceIssueLabels(owner, repo, issueNumber: number, names: string[]): label[]
listIssueLabels(owner, repo, issueNumber: number): label[]
```

`saveLabel` generates `id`, `node_id`, `url`, and `default: false`. The existing `saveIssue`
already accepts `labels` — update it to store label objects resolved from the repo's label
store when labels are provided as `{ name, color }` objects.

### 3. Implement route handlers

Each handler should validate that the repository (and issue where applicable) exists,
then delegate to context methods and return correct HTTP statuses.

### 4. Seed scenario data

Add a `labels` scenario function in `scenarios/index.ts` that seeds standard labels
(e.g. `bug`, `enhancement`, `documentation`, `question`) on `counterfact/platform-api`
and attaches the `enhancement` label to the existing open issue. Add `labels($)` inside
`seedGitHub`.

### 5. Write tests

**Unit tests**:

- `saveLabel` creates a label with auto-generated fields.
- `listLabels` returns all labels for a repo.
- `updateLabel` (rename) updates the key correctly.
- `deleteLabel` returns `false` when not found.
- `addLabelToIssue` adds labels and returns current label list.
- `removeLabelFromIssue` removes a single label.
- `replaceIssueLabels` replaces all labels atomically.

**HTTP-level tests**:

- `GET /repos/:owner/:repo/labels` returns seeded labels.
- `POST /repos/:owner/:repo/labels` creates a label and returns 201.
- `GET/PATCH/DELETE /repos/:owner/:repo/labels/:name` work correctly.
- `GET /repos/:owner/:repo/issues/:number/labels` returns the issue's labels.
- `POST /repos/:owner/:repo/issues/:number/labels` adds labels.
- `PUT /repos/:owner/:repo/issues/:number/labels` replaces all labels.
- `DELETE /repos/:owner/:repo/issues/:number/labels/:name` removes one label.
- All routes return 404 when the repo or issue does not exist.

## Relevant types

- `types/components/schemas/label.ts` — `label`
- `types/paths/repos/{owner}/{repo}/labels.types.ts`
- `types/paths/repos/{owner}/{repo}/labels/{name}.types.ts`
- `types/paths/repos/{owner}/{repo}/issues/{issue_number}/labels.types.ts`
