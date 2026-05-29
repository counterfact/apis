# Implement Notifications domain in the GitHub API simulator

## Summary

Implement the Notifications domain in the `@counterfact/github` simulator. Notification
polling and thread management are a key part of any GitHub API client, bot, or integration.
Currently all four notification endpoints return random responses.

## Scope

### Route files to implement (currently returning `$.response[200].random()`)

| File | Handlers | Description |
|------|----------|-------------|
| `routes/notifications.ts` | GET, PUT | List notifications; Mark all as read |
| `routes/notifications/threads/{thread_id}.ts` | GET, PATCH, DELETE | Get / mark read / mark done a thread |
| `routes/notifications/threads/{thread_id}/subscription.ts` | GET, PUT, DELETE | Get / set / delete thread subscription |
| `routes/repos/{owner}/{repo}/notifications.ts` | GET, PUT | List / mark-read notifications for a repo |

## Implementation plan

### 1. Add notification state to the root `Context` in `routes/_.context.ts`

Add:

- `notifications: Map<string, thread>` (keyed by thread id)
- `subscriptions: Map<string, thread_subscription>` (keyed by thread id)

Notifications are global (not per-repo), though each thread contains a `repository` reference.

### 2. Add context methods to `Context` in `routes/_.context.ts`

```ts
saveNotification(input: Partial<thread> & {
  subject: thread['subject'];
  repository: minimal_repository;
}): thread
getNotification(id: string): thread | undefined
markNotificationRead(id: string): boolean
markNotificationDone(id: string): boolean
markAllNotificationsRead(owner?: string, repo?: string): void
listNotifications(query?: {
  all?: unknown;
  participating?: unknown;
  per_page?: unknown;
  page?: unknown;
  owner?: string;
  repo?: string;
}): thread[]
getThreadSubscription(threadId: string): thread_subscription | undefined
setThreadSubscription(threadId: string, input: { subscribed: boolean; ignored: boolean }): thread_subscription
deleteThreadSubscription(threadId: string): boolean
```

`saveNotification` auto-generates `id`, `url`, `subscription_url`, `updated_at`,
`last_read_at`, and sets `unread: true`. `listNotifications` filters to unread-only by
default (when `all` is falsy), and can filter by `owner`/`repo` for the per-repo endpoint.

### 3. Implement route handlers

- `GET /notifications` — call `listNotifications(query)`.
- `PUT /notifications` — call `markAllNotificationsRead()`, return 202.
- `GET /notifications/threads/{id}` — get or 404.
- `PATCH /notifications/threads/{id}` — mark read, return 205.
- `DELETE /notifications/threads/{id}` — mark done, return 204.
- `GET/PUT/DELETE /notifications/threads/{id}/subscription` — delegate to subscription methods.
- `GET /repos/{owner}/{repo}/notifications` — call `listNotifications({ owner, repo, ...query })`.
- `PUT /repos/{owner}/{repo}/notifications` — call `markAllNotificationsRead(owner, repo)`, return 202.

### 4. Seed scenario data

Add a `notifications` scenario function in `scenarios/index.ts` that seeds 2–3 unread
notification threads (one for a new issue comment on `counterfact/platform-api`, one for a
pull request review on `counterfact/platform-api`). Add `notifications($)` inside `seedGitHub`.

### 5. Write tests

**Unit tests**:

- `saveNotification` creates an unread thread with auto-generated fields.
- `listNotifications` returns only unread entries when `all` is false.
- `listNotifications` filters by repo when `owner`/`repo` are provided.
- `markNotificationRead` flips `unread` to false.
- `markAllNotificationsRead` marks all matching threads as read.
- `setThreadSubscription` stores and returns the subscription.

**HTTP-level tests**:

- `GET /notifications` returns seeded unread threads.
- `PUT /notifications` returns 202 and marks all threads read.
- `GET /notifications/threads/:id` returns the thread or 404.
- `PATCH /notifications/threads/:id` returns 205.
- `DELETE /notifications/threads/:id` returns 204.
- `GET /notifications/threads/:id/subscription` returns the subscription.
- `PUT /notifications/threads/:id/subscription` sets subscribed state and returns 200.
- `DELETE /notifications/threads/:id/subscription` removes the subscription and returns 204.
- `GET /repos/:owner/:repo/notifications` returns only that repo's notifications.
- `PUT /repos/:owner/:repo/notifications` marks only that repo's threads as read.

## Relevant types

- `types/components/schemas/thread.ts` — `thread`
- `types/components/schemas/thread-subscription.ts` — `thread_subscription`
- `types/components/schemas/minimal-repository.ts` — `minimal_repository`
- `types/paths/notifications.types.ts`
- `types/paths/notifications/threads/{thread_id}.types.ts`
- `types/paths/notifications/threads/{thread_id}/subscription.types.ts`
