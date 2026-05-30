---
title: Implement Releases domain in the GitHub API simulator
---

## Summary

Implement the Releases domain in the `@counterfact/github` simulator so that clients
can create, read, update, and delete releases backed by stateful context data instead
of random responses.

## Scope

### Route files to implement (currently returning `$.response[200].random()`)

| File | Handlers | Description |
|------|----------|-------------|
| `routes/repos/{owner}/{repo}/releases.ts` | GET, POST | List releases; Create a release |
| `routes/repos/{owner}/{repo}/releases/{release_id}.ts` | GET, PATCH, DELETE | Get / update / delete a release |
| `routes/repos/{owner}/{repo}/releases/latest.ts` | GET | Get the latest published release |
| `routes/repos/{owner}/{repo}/releases/tags/{tag}.ts` | GET | Get a release by tag name |

Assets and reactions sub-routes (`/releases/{release_id}/assets`, `/releases/assets/{asset_id}`,
`/releases/{release_id}/reactions`) may remain as stubs.

## Implementation plan

### 1. Extend `RepoState` in `routes/_.context.ts`

Add two fields to the per-repo state object:

- `releases: Map<number, release>`
- `nextReleaseId: number` (start at 1)

### 2. Add context methods to `Context` in `routes/_.context.ts`

```ts
saveRelease(owner, repo, input: Partial<release> & { tag_name: string }): release
getRelease(owner, repo, id: number): release | undefined
getReleaseByTag(owner, repo, tag: string): release | undefined
getLatestRelease(owner, repo): release | undefined
updateRelease(owner, repo, id: number, patch: Partial<release>): release | undefined
deleteRelease(owner, repo, id: number): boolean
listReleases(owner, repo, query?): release[]
```

`saveRelease` auto-generates `id`, `node_id`, `url`, `html_url`, `assets_url`, `upload_url`,
`tarball_url`, `zipball_url`, `created_at`, `published_at`, and sets `author` to the default
user. `getLatestRelease` returns the most recent non-draft, non-prerelease release, sorted by
latest `created_at` (matching GitHub's API contract for this endpoint).

### 3. Implement route handlers

Each handler should:

- Call `$.context.hasRepository(owner, repo)` and return 404 if missing.
- Delegate to the appropriate context method.
- Return the correct HTTP status (200, 201, 204, 404).

### 4. Seed scenario data

Add a `releases` scenario function in `scenarios/index.ts` that seeds 3 releases on
`counterfact/platform-api`: one stable (`v1.0.0`), one pre-release (`v2.0.0-beta.1`), and
one draft (`v2.0.0`). Add a call to `releases($)` inside `seedGitHub`.

### 5. Write tests

**Unit tests** (in `test/scenarios.test.ts` or a new file):

- `saveRelease` creates a release with auto-generated fields and correct author.
- `listReleases` respects pagination.
- `getLatestRelease` skips draft and pre-release entries.
- `getReleaseByTag` returns the matching release or `undefined`.
- `updateRelease` merges patch fields and returns the updated release.
- `deleteRelease` removes the release and returns `false` when not found.

**HTTP-level tests** (in `test/routes.test.ts`):

- `GET /repos/:owner/:repo/releases` returns the seeded list.
- `POST /repos/:owner/:repo/releases` creates and returns 201.
- `GET /repos/:owner/:repo/releases/:id` returns the release.
- `PATCH /repos/:owner/:repo/releases/:id` updates and returns 200.
- `DELETE /repos/:owner/:repo/releases/:id` returns 204.
- `GET /repos/:owner/:repo/releases/latest` returns the latest stable release.
- `GET /repos/:owner/:repo/releases/tags/:tag` returns the matching release.
- All routes return 404 when the repository does not exist.

## Relevant types

- `types/components/schemas/release.ts` — `release`
- `types/components/schemas/release-asset.ts` — `release_asset`
- `types/paths/repos/{owner}/{repo}/releases.types.ts`
- `types/paths/repos/{owner}/{repo}/releases/{release_id}.types.ts`
- `types/paths/repos/{owner}/{repo}/releases/latest.types.ts`
- `types/paths/repos/{owner}/{repo}/releases/tags/{tag}.types.ts`
