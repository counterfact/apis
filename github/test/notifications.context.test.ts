import assert from "node:assert/strict";
import test from "node:test";
import { Context } from "../routes/notifications/_.context.ts";
import type { minimal_repository } from "../types/components/schemas/minimal-repository.ts";

const createContext = () =>
  new Context({
    loadContext: (() => ({})) as never,
    readJson: async () => ({}),
  });

const repository = (name = "platform-api") =>
  ({
    id: name === "platform-api" ? 101 : 102,
    name,
    full_name: `counterfact/${name}`,
    owner: { login: "counterfact" },
    url: `https://api.github.com/repos/counterfact/${name}`,
  }) as minimal_repository;

const save = (
  context: Context,
  id: string | undefined,
  options: { name?: string; reason?: string; updatedAt?: string } = {},
) =>
  context.saveNotification({
    id,
    repository: repository(options.name),
    reason: options.reason,
    updated_at: options.updatedAt,
    subject: {
      title: `Notification ${id ?? "generated"}`,
      type: "Issue",
      url: "https://api.github.com/repos/counterfact/platform-api/issues/1",
      latest_comment_url:
        "https://api.github.com/repos/counterfact/platform-api/issues/comments/1",
    },
  });

test("explicit notification IDs advance generated IDs without overwriting", () => {
  const context = createContext();
  save(context, "101");
  save(context, "103");

  const generated = save(context, undefined);
  assert.equal(generated.id, "104");
  assert.equal(context.getNotification("101")?.id, "101");
  assert.equal(context.listNotifications({ all: true }).length, 3);
});

test("markNotificationRead uses one timestamp for the transition", () => {
  const context = createContext();
  save(context, "1", { updatedAt: "2024-01-01T00:00:00.000Z" });

  assert.equal(context.markNotificationRead("1"), true);
  const notification = context.getNotification("1");
  assert.equal(notification?.unread, false);
  assert.notEqual(notification?.last_read_at, notification?.updated_at);
  assert.equal(context.markNotificationRead("missing"), false);
});

test("notification listing filters unread, participating, repo, and pages", () => {
  const context = createContext();
  save(context, "1", {
    reason: "mention",
    updatedAt: "2026-08-18T13:00:00.000Z",
  });
  save(context, "2", {
    reason: "subscribed",
    updatedAt: "2026-08-18T12:00:00.000Z",
  });
  save(context, "3", {
    name: "actions-demo",
    reason: "review_requested",
    updatedAt: "2026-08-18T11:00:00.000Z",
  });
  context.markNotificationRead("2");

  assert.deepEqual(
    context.listNotifications().map(({ id }) => id),
    ["1", "3"],
  );
  assert.deepEqual(
    context
      .listNotifications({ all: true, participating: true })
      .map(({ id }) => id),
    ["1", "3"],
  );
  assert.deepEqual(
    context
      .listNotifications({ owner: "counterfact", repo: "platform-api" })
      .map(({ id }) => id),
    ["1"],
  );
  assert.deepEqual(
    context
      .listNotifications({ all: true, per_page: 1, page: 2 })
      .map(({ id }) => id),
    ["2"],
  );
  assert.deepEqual(
    context
      .listNotifications({ all: true, since: "2026-08-18T12:30:00.000Z" })
      .map(({ id }) => id),
    ["1"],
  );
  assert.deepEqual(
    context
      .listNotifications({ all: true, before: "2026-08-18T11:30:00.000Z" })
      .map(({ id }) => id),
    ["3"],
  );
  assert.deepEqual(
    context
      .listNotifications({ all: true, since: "2026-08-18T12:00:00.000Z" })
      .map(({ id }) => id),
    ["1"],
  );
  assert.deepEqual(
    context
      .listNotifications({ all: true, before: "2026-08-18T12:00:00.000Z" })
      .map(({ id }) => id),
    ["3"],
  );
});

test("batch read transitions honor the cutoff and share one timestamp", () => {
  const context = createContext();
  save(context, "1", { updatedAt: "2026-08-18T13:00:00.000Z" });
  save(context, "2", { updatedAt: "2026-08-18T12:00:00.000Z" });
  save(context, "3", { updatedAt: "2026-08-18T11:00:00.000Z" });

  const cutoff = "2026-08-18T12:30:00.000Z";
  context.markAllNotificationsRead(undefined, undefined, {
    last_read_at: cutoff,
  });

  assert.equal(context.getNotification("1")?.unread, true);
  assert.equal(context.getNotification("2")?.last_read_at, cutoff);
  assert.equal(context.getNotification("3")?.last_read_at, cutoff);

  const exactCutoff = "2026-08-18T13:00:00.000Z";
  context.markAllNotificationsRead(undefined, undefined, {
    last_read_at: exactCutoff,
  });
  assert.equal(context.getNotification("1")?.unread, true);
});

test("subscription and done operations update related state", () => {
  const context = createContext();
  save(context, "7");

  const subscription = context.setThreadSubscription("7", { ignored: true });
  assert.equal(subscription.ignored, true);
  assert.equal(subscription.subscribed, false);
  assert.equal(context.deleteThreadSubscription("7"), true);
  assert.equal(context.getThreadSubscription("7"), undefined);
  assert.equal(context.markNotificationDone("7"), true);
  assert.equal(context.getNotification("7"), undefined);
});
