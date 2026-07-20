---
title: Implement Authenticated User domain in the GitHub API simulator
---

## Summary

Implement the Authenticated User domain in `@counterfact/github` so all `/user` endpoints return deterministic, stateful responses backed by simulator logic. This covers the authenticated user's profile, emails, SSH keys, GPG keys, followers/following, starred repos, and org memberships.

## Scope

### Route files to implement (currently returning `$.response[200].random()`)

| File | Handlers | Description |
|------|----------|-------------|
| `routes/user.ts` | GET, PATCH | Get / update authenticated user profile |
| `routes/user/emails.ts` | GET, POST, DELETE | List / add / delete email addresses |
| `routes/user/public_emails.ts` | GET | List public emails |
| `routes/user/email/visibility.ts` | PATCH | Set email visibility |
| `routes/user/followers.ts` | GET | List followers |
| `routes/user/following.ts` | GET | List users the authenticated user follows |
| `routes/user/following/{username}.ts` | GET, PUT, DELETE | Check / follow / unfollow a user |
| `routes/user/keys.ts` | GET, POST | List / add SSH keys |
| `routes/user/keys/{key_id}.ts` | GET, DELETE | Get / delete an SSH key |
| `routes/user/gpg_keys.ts` | GET, POST | List / add GPG keys |
| `routes/user/gpg_keys/{gpg_key_id}.ts` | GET, DELETE | Get / delete a GPG key |
| `routes/user/ssh_signing_keys.ts` | GET, POST | List / add SSH signing keys |
| `routes/user/ssh_signing_keys/{ssh_signing_key_id}.ts` | GET, DELETE | Get / delete an SSH signing key |
| `routes/user/starred.ts` | GET | List starred repositories |
| `routes/user/starred/{owner}/{repo}.ts` | GET, PUT, DELETE | Check / star / unstar a repo |
| `routes/user/subscriptions.ts` | GET | List subscriptions |
| `routes/user/orgs.ts` | GET | List orgs for the authenticated user |
| `routes/user/repos.ts` | GET | List repos for the authenticated user |
| `routes/user/issues.ts` | GET | List issues assigned to the authenticated user |
| `routes/user/social_accounts.ts` | GET, POST, DELETE | List / add / delete social accounts |

## Implementation plan

### 1. Create `routes/user/_.context.ts`

Create a new context file for the authenticated user domain. The simulator has a single "authenticated" user whose state is maintained here.

State to manage:
- `profile: private_user` — the authenticated user's full profile
- `emails: Map<string, email>` — keyed by email address
- `sshKeys: Map<number, key>` — keyed by key id
- `gpgKeys: Map<number, gpg_key>` — keyed by key id
- `sshSigningKeys: Map<number, ssh_signing_key>` — keyed by key id
- `following: Set<string>` — logins the authenticated user follows
- `starredRepos: Set<string>` — `{owner}/{repo}` keys
- `socialAccounts: Map<string, social_account>` — keyed by URL

Wire the new context into `routes/_.context.ts` and register it in `test-support/create-context.ts` under the `/user` path.

### 2. Add context methods

```ts
getProfile(): private_user
updateProfile(patch: Partial<private_user>): private_user

listEmails(): email[]
addEmail(address: string, options?: { primary?: boolean; visibility?: string }): email
deleteEmail(address: string): boolean

listPublicEmails(): email[]
setEmailVisibility(visibility: string): void

listSshKeys(): key[]
addSshKey(input: { title: string; key: string }): key
getSshKey(id: number): key | undefined
deleteSshKey(id: number): boolean

listGpgKeys(): gpg_key[]
addGpgKey(input: { armored_public_key: string; name?: string }): gpg_key
getGpgKey(id: number): gpg_key | undefined
deleteGpgKey(id: number): boolean

listSshSigningKeys(): ssh_signing_key[]
addSshSigningKey(input: { title: string; key: string }): ssh_signing_key
getSshSigningKey(id: number): ssh_signing_key | undefined
deleteSshSigningKey(id: number): boolean

isFollowing(username: string): boolean
follow(username: string): void
unfollow(username: string): void
listFollowing(query?: { per_page?: unknown; page?: unknown }): simple_user[]
listFollowers(query?: { per_page?: unknown; page?: unknown }): simple_user[]

isStarred(owner: string, repo: string): boolean
starRepo(owner: string, repo: string): void
unstarRepo(owner: string, repo: string): void
listStarredRepos(query?: { per_page?: unknown; page?: unknown }): repository[]

listOrgMemberships(): organization_simple[]
listUserRepos(query?: { type?: unknown; per_page?: unknown; page?: unknown }): repository[]

listSocialAccounts(): social_account[]
addSocialAccounts(accounts: Array<{ provider: string; account_id: string }>): social_account[]
deleteSocialAccounts(accounts: Array<{ provider: string; account_id: string }>): boolean
```

Add forwarding methods in `routes/_.context.ts` for each method above.

### 3. Implement route handlers

Delegate to the authenticated user context in each route file. For `following/{username}`, return 204 (is following) or 404 (not following). For `starred/{owner}/{repo}`, return 204 (starred) or 404 (not starred).

### 4. Seed scenario data

Add a `authenticatedUser($)` scenario function in `scenarios/index.ts` that:
- Sets up a default authenticated user profile (login `octocat`, name `The Octocat`, etc.)
- Seeds a few email addresses (one primary, one secondary)
- Seeds one or two SSH keys

Call `authenticatedUser($)` inside `seedGitHub`.

### 5. Write tests

**Unit tests** (`test/user.context.test.ts`):
- `getProfile` returns the seeded profile.
- `updateProfile` merges patch fields into the profile.
- `addEmail` / `listEmails` / `deleteEmail` manage the email map.
- `follow` / `unfollow` / `isFollowing` manage the following set.
- `starRepo` / `unstarRepo` / `isStarred` manage starred repos.

**HTTP-level tests** (`test/routes.test.ts`):
- `GET /user` returns the seeded authenticated user profile.
- `PATCH /user` updates and returns the profile.
- `GET /user/emails` returns seeded emails.
- `POST /user/emails` adds a new email; `DELETE /user/emails` removes it.
- `GET /user/followers` returns an array (possibly empty).
- `GET /user/following` returns users being followed.
- `PUT /user/following/{username}` follows; `DELETE` unfollows; `GET` returns 204/404.
- `GET /user/starred` returns starred repos.
- `PUT /user/starred/{owner}/{repo}` stars; `DELETE` unstars; `GET` returns 204/404.
- `GET /user/keys` returns SSH keys; `POST` adds one; `DELETE /user/keys/{id}` removes it.

## Relevant types

- `types/components/schemas/private-user.ts` — `private_user`
- `types/components/schemas/email.ts` — `email`
- `types/components/schemas/key.ts` — `key`
- `types/components/schemas/gpg-key.ts` — `gpg_key`
- `types/components/schemas/ssh-signing-key.ts` — `ssh_signing_key`
- `types/components/schemas/simple-user.ts` — `simple_user`
- `types/components/schemas/social-account.ts` — `social_account`
