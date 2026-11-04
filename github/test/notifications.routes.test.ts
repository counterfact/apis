import assert from "node:assert/strict";
import test from "node:test";
import { startCounterfactServer } from "../test-support/counterfact-server.ts";
import type { thread } from "../types/components/schemas/thread.ts";
import type { thread_subscription } from "../types/components/schemas/thread-subscription.ts";

test("notification HTTP workflow preserves global and repo-scoped state", async () => {
  const server = await startCounterfactServer();

  try {
    const listed = await server.fetch("/notifications");
    assert.equal(listed.status, 200);
    const initial = (await listed.json()) as thread[];
    assert.deepEqual(
      initial.map(({ id }) => id),
      ["101", "102", "103"],
    );
    assert.deepEqual(
      (
        (await (
          await server.fetch(
            "/notifications?all=true&since=2026-08-18T12:30:00.000Z",
          )
        ).json()) as thread[]
      ).map(({ id }) => id),
      ["101"],
    );

    const threadResponse = await server.fetch("/notifications/threads/101");
    assert.equal(threadResponse.status, 200);
    assert.equal(((await threadResponse.json()) as thread).id, "101");
    const missingThread = await server.fetch("/notifications/threads/999999");
    assert.equal(missingThread.status, 404);
    assert.deepEqual(await missingThread.json(), {
      message: "Not Found",
      status: "404",
    });

    const missingSubscription = await server.fetch(
      "/notifications/threads/999999/subscription",
    );
    assert.equal(missingSubscription.status, 404);
    assert.deepEqual(await missingSubscription.json(), {
      message: "Not Found",
      status: "404",
    });

    const subscriptionResponse = await server.fetch(
      "/notifications/threads/101/subscription",
    );
    assert.equal(subscriptionResponse.status, 200);
    assert.equal(
      ((await subscriptionResponse.json()) as thread_subscription).ignored,
      false,
    );

    const updatedSubscription = await server.fetch(
      "/notifications/threads/101/subscription",
      {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ignored: true }),
      },
    );
    assert.equal(updatedSubscription.status, 200);
    assert.equal(
      ((await updatedSubscription.json()) as thread_subscription).subscribed,
      false,
    );

    const repoList = await server.fetch(
      "/repos/counterfact/platform-api/notifications",
    );
    assert.equal(repoList.status, 200);
    assert.equal(((await repoList.json()) as thread[]).length, 3);

    const marked = await server.fetch("/notifications/threads/101", {
      method: "PATCH",
    });
    assert.equal(marked.status, 205);
    assert.equal(
      ((await (await server.fetch("/notifications")).json()) as thread[])
        .length,
      2,
    );
    assert.equal(
      (
        (await (
          await server.fetch("/notifications?all=true")
        ).json()) as thread[]
      ).length,
      3,
    );

    const markedRepo = await server.fetch(
      "/repos/counterfact/platform-api/notifications",
      { method: "PUT" },
    );
    assert.equal(markedRepo.status, 205);
    assert.deepEqual(
      (await (await server.fetch("/notifications")).json()) as thread[],
      [],
    );

    const deletedSubscription = await server.fetch(
      "/notifications/threads/101/subscription",
      { method: "DELETE" },
    );
    assert.equal(deletedSubscription.status, 204);
    assert.equal(
      (await server.fetch("/notifications/threads/101/subscription")).status,
      404,
    );

    const deletedThread = await server.fetch("/notifications/threads/102", {
      method: "DELETE",
    });
    assert.equal(deletedThread.status, 204);
    assert.equal(
      (await server.fetch("/notifications/threads/102")).status,
      404,
    );
  } finally {
    await server.stop();
  }
});
