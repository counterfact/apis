import assert from "node:assert/strict";
import test from "node:test";
import { notifications, repositories } from "../scenarios/index.ts";
import { createContext } from "../test-support/create-context.ts";
import type { Scenario$ } from "../types/_.context.ts";

test("notifications scenario is additive and idempotent", () => {
  const context = createContext();
  const $ = {
    context,
    loadContext: () => context,
    route: () => ({}),
    routes: {},
  } as unknown as Scenario$;
  repositories($);
  const repository = context.getRepository("counterfact", "platform-api")!;
  context.saveNotification({
    id: "101",
    repository,
    subject: {
      title: "Unrelated",
      type: "Issue",
      url: "https://api.github.com/repos/counterfact/platform-api/issues/999",
      latest_comment_url:
        "https://api.github.com/repos/counterfact/platform-api/issues/comments/999",
    },
  });

  notifications($);
  const once = context.listNotifications({ all: true, per_page: 100 });
  notifications($);
  const twice = context.listNotifications({ all: true, per_page: 100 });

  assert.equal(context.getNotification("101")?.subject.title, "Unrelated");
  assert.equal(once.length, 4);
  assert.equal(twice.length, 4);
  assert.deepEqual(
    twice.map(({ id, subject }) => [id, subject.url]),
    once.map(({ id, subject }) => [id, subject.url]),
  );
});
