import assert from "node:assert/strict";
import test from "node:test";
import type { minimal_repository } from "../types/components/schemas/minimal-repository.ts";
import { Context } from "../routes/notifications/_.context.ts";

const createContext = () =>
  new Context({
    loadContext: (() => ({})) as never,
    readJson: async () => ({}),
  });

const repositoryFixture = (owner: string, repo: string): minimal_repository =>
  ({
    id: owner.length * 100 + repo.length,
    name: repo,
    full_name: `${owner}/${repo}`,
    owner: { login: owner },
    url: `https://api.github.com/repos/${owner}/${repo}`,
  }) as minimal_repository;

test("saveNotification creates an unread thread with auto-generated fields", () => {
  const context = createContext();
  const notification = context.saveNotification({
    repository: repositoryFixture("counterfact", "platform-api"),
    subject: {
      title: "Issue update",
      url: "https://api.github.com/repos/counterfact/platform-api/issues/1",
      latest_comment_url:
        "https://api.github.com/repos/counterfact/platform-api/issues/comments/1",
      type: "Issue",
    },
  });

  assert.ok(notification.id);
  assert.equal(notification.unread, true);
  assert.ok(notification.url.includes(notification.id));
  assert.ok(notification.subscription_url.includes(notification.id));
  assert.ok(notification.updated_at);
  assert.ok(notification.last_read_at);
});

test("listNotifications returns unread entries when all is false", () => {
  const context = createContext();
  const first = context.saveNotification({
    id: "1",
    repository: repositoryFixture("counterfact", "platform-api"),
    subject: {
      title: "Issue update",
      url: "https://api.github.com/repos/counterfact/platform-api/issues/1",
      latest_comment_url:
        "https://api.github.com/repos/counterfact/platform-api/issues/comments/1",
      type: "Issue",
    },
  });
  const second = context.saveNotification({
    id: "2",
    repository: repositoryFixture("counterfact", "platform-api"),
    subject: {
      title: "PR review",
      url: "https://api.github.com/repos/counterfact/platform-api/pulls/1",
      latest_comment_url:
        "https://api.github.com/repos/counterfact/platform-api/pulls/1/reviews/1",
      type: "PullRequest",
    },
  });
  context.markNotificationRead(second.id);

  const unreadOnly = context.listNotifications({ all: false });
  assert.deepEqual(
    unreadOnly.map((thread) => thread.id),
    [first.id],
  );
});

test("listNotifications filters by repository owner and name", () => {
  const context = createContext();
  context.saveNotification({
    id: "1",
    repository: repositoryFixture("counterfact", "platform-api"),
    subject: {
      title: "Issue update",
      url: "https://api.github.com/repos/counterfact/platform-api/issues/1",
      latest_comment_url:
        "https://api.github.com/repos/counterfact/platform-api/issues/comments/1",
      type: "Issue",
    },
  });
  context.saveNotification({
    id: "2",
    repository: repositoryFixture("counterfact", "actions-demo"),
    subject: {
      title: "Workflow update",
      url: "https://api.github.com/repos/counterfact/actions-demo/actions/runs/1",
      latest_comment_url:
        "https://api.github.com/repos/counterfact/actions-demo/actions/runs/1",
      type: "CheckSuite",
    },
  });

  const filtered = context.listNotifications({
    owner: "counterfact",
    repo: "platform-api",
  });
  assert.deepEqual(
    filtered.map((thread) => thread.id),
    ["1"],
  );
});

test("markNotificationRead marks a thread as read", () => {
  const context = createContext();
  const notification = context.saveNotification({
    repository: repositoryFixture("counterfact", "platform-api"),
    subject: {
      title: "Issue update",
      url: "https://api.github.com/repos/counterfact/platform-api/issues/1",
      latest_comment_url:
        "https://api.github.com/repos/counterfact/platform-api/issues/comments/1",
      type: "Issue",
    },
  });

  assert.equal(context.markNotificationRead(notification.id), true);
  assert.equal(context.getNotification(notification.id)?.unread, false);
});

test("markAllNotificationsRead marks matching notifications as read", () => {
  const context = createContext();
  const first = context.saveNotification({
    id: "1",
    repository: repositoryFixture("counterfact", "platform-api"),
    subject: {
      title: "Issue update",
      url: "https://api.github.com/repos/counterfact/platform-api/issues/1",
      latest_comment_url:
        "https://api.github.com/repos/counterfact/platform-api/issues/comments/1",
      type: "Issue",
    },
  });
  const second = context.saveNotification({
    id: "2",
    repository: repositoryFixture("counterfact", "actions-demo"),
    subject: {
      title: "Workflow update",
      url: "https://api.github.com/repos/counterfact/actions-demo/actions/runs/1",
      latest_comment_url:
        "https://api.github.com/repos/counterfact/actions-demo/actions/runs/1",
      type: "CheckSuite",
    },
  });

  context.markAllNotificationsRead("counterfact", "platform-api");

  assert.equal(context.getNotification(first.id)?.unread, false);
  assert.equal(context.getNotification(second.id)?.unread, true);
});

test("setThreadSubscription stores and returns a subscription", () => {
  const context = createContext();
  const notification = context.saveNotification({
    id: "7",
    repository: repositoryFixture("counterfact", "platform-api"),
    subject: {
      title: "Issue update",
      url: "https://api.github.com/repos/counterfact/platform-api/issues/1",
      latest_comment_url:
        "https://api.github.com/repos/counterfact/platform-api/issues/comments/1",
      type: "Issue",
    },
  });

  const subscription = context.setThreadSubscription(notification.id, {
    ignored: true,
  });

  assert.equal(subscription.ignored, true);
  assert.equal(subscription.subscribed, false);
  assert.equal(
    context.getThreadSubscription(notification.id)?.ignored,
    subscription.ignored,
  );
});
