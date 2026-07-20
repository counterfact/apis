---
title: Implement Organization Members domain in the GitHub API simulator
---

## Summary

Implement the Organization Members sub-domain in `@counterfact/github` so member management endpoints under `/orgs/{org}` return deterministic, stateful responses rather than random ones. This covers listing/adding/removing members, managing invitations, and handling outside collaborators.

## Scope

### Route files to implement (currently returning `$.response[200].random()`)

| File | Handlers | Description |
|------|----------|-------------|
| `routes/orgs/{org}/members.ts` | GET | List members of an organization |
| `routes/orgs/{org}/members/{username}.ts` | GET, DELETE | Check / remove a member |
| `routes/orgs/{org}/memberships/{username}.ts` | GET, PUT, DELETE | Get / set / remove org membership |
| `routes/orgs/{org}/invitations.ts` | GET, POST | List / create pending invitations |
| `routes/orgs/{org}/invitations/{invitation_id}.ts` | DELETE | Cancel an invitation |
| `routes/orgs/{org}/invitations/{invitation_id}/teams.ts` | GET | List invitation teams |
| `routes/orgs/{org}/failed_invitations.ts` | GET | List failed invitations |
| `routes/orgs/{org}/outside_collaborators.ts` | GET | List outside collaborators |
| `routes/orgs/{org}/outside_collaborators/{username}.ts` | PUT, DELETE | Add / remove outside collaborator |
| `routes/orgs/{org}/public_members.ts` | GET | List public members |
| `routes/orgs/{org}/public_members/{username}.ts` | GET, PUT, DELETE | Check / publicize / conceal membership |

## Implementation plan

### 1. Add member state to `routes/users/_.context.ts`

Extend the existing users context (which already manages users and organizations) to store membership data:

```ts
// New state maps in routes/users/_.context.ts
orgMembers: Map<string, Map<string, org_membership>>  // orgLogin → username → membership
orgInvitations: Map<string, Map<number, organization_invitation>>  // orgLogin → invitationId → invitation
outsideCollaborators: Map<string, Set<string>>  // orgLogin → Set<username>
publicMembers: Map<string, Set<string>>  // orgLogin → Set<username>
```

New methods on `Context`:
```ts
listOrgMembers(org: string, query?: { role?: unknown; per_page?: unknown; page?: unknown }): simple_user[]
isOrgMember(org: string, username: string): boolean
removeOrgMember(org: string, username: string): boolean

getOrgMembership(org: string, username: string): org_membership | undefined
setOrgMembership(org: string, username: string, role: string): org_membership
deleteOrgMembership(org: string, username: string): boolean

listOrgInvitations(org: string, query?: { per_page?: unknown; page?: unknown }): organization_invitation[]
createOrgInvitation(org: string, input: { invitee_id?: number; email?: string; role?: string }): organization_invitation
cancelOrgInvitation(org: string, invitationId: number): boolean

listOutsideCollaborators(org: string, query?: { per_page?: unknown; page?: unknown }): simple_user[]
addOutsideCollaborator(org: string, username: string): void
removeOutsideCollaborator(org: string, username: string): boolean

listPublicMembers(org: string, query?: { per_page?: unknown; page?: unknown }): simple_user[]
isPublicMember(org: string, username: string): boolean
publicizeMembership(org: string, username: string): void
concealMembership(org: string, username: string): void
```

### 2. Wire forwarding methods in `routes/_.context.ts`

Add forwarding methods in the root context delegating to the users context for all the new methods above.

### 3. Implement route handlers

Update each route file to delegate to context methods instead of returning `$.response[200].random()`. Return 204 for membership-check endpoints (member exists) or 404 (not a member).

### 4. Seed scenario data

Extend the `seedGitHub` scenario to add 2–3 members and 1 pending invitation for the `counterfact` org.

### 5. Write tests

**Unit tests** (`test/users.context.test.ts`):
- `setOrgMembership` stores and returns the membership.
- `listOrgMembers` returns only members of the given org.
- `isOrgMember` returns true after `setOrgMembership` and false after `removeOrgMember`.
- `createOrgInvitation` creates a pending invitation; `cancelOrgInvitation` removes it.
- `addOutsideCollaborator` / `removeOutsideCollaborator` manage the collaborator set.

**HTTP-level tests** (`test/routes.test.ts`):
- `GET /orgs/counterfact/members` returns seeded members.
- `GET /orgs/counterfact/members/{username}` returns 204 for a member and 404 for a non-member.
- `DELETE /orgs/counterfact/members/{username}` returns 204 and removes the member.
- `PUT /orgs/counterfact/memberships/{username}` sets membership role and returns 200.
- `GET /orgs/counterfact/invitations` returns pending invitations.
- `POST /orgs/counterfact/invitations` creates an invitation and returns 201.
- `DELETE /orgs/counterfact/invitations/{id}` returns 204 and cancels the invitation.
- `GET /orgs/counterfact/outside_collaborators` returns the collaborator list.

## Relevant types

- `types/components/schemas/org-membership.ts` — `org_membership`
- `types/components/schemas/organization-invitation.ts` — `organization_invitation`
- `types/components/schemas/simple-user.ts` — `simple_user`
