import assert from "node:assert/strict";
import test from "node:test";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import { createScenarioRunner } from "../test-support/scenarios.js";
import * as scenarios from "../api/scenarios/index.js";
const base = "/v1/convai/agent-testing";
test("agent test context empty state, atomic hierarchy operations, copies and reset", async () => {
  const { Context } =
    await import("../api/routes/convai/agent-testing/_.context.js");
  assert.equal(new Context().tests.size, 0);
  assert.equal(new Context().folders.size, 0);
  const runner = await createScenarioRunner();
  await runner.run(scenarios.startup);
  const c = runner.loadContext("/convai/agent-testing");
  const parent = c.createFolder({ name: "Parent" }),
    child = c.createFolder({ name: "Child", parent_folder_id: parent.id });
  assert.deepEqual(
    c.folder(child.id).folder_path.map((p) => p.id),
    [parent.id, child.id],
  );
  const before = c.folder(child.id);
  assert.throws(() =>
    c.move({ entity_ids: [child.id, "missing"], move_to: "sim-test-folder" }),
  );
  assert.deepEqual(c.folder(child.id), before);
  assert.throws(() => c.move({ entity_ids: [parent.id], move_to: child.id }));
  assert.throws(() =>
    c.move({ entity_ids: [parent.id, parent.id], move_to: null }),
  );
  assert.throws(() => c.deleteFolder(parent.id));
  c.move({ entity_ids: ["sim-test-llm"], move_to: child.id });
  assert.equal(c.folder(child.id).children_count, 1);
  c.renameFolder(parent.id, { name: "Renamed" });
  assert.equal(c.folder(child.id).folder_path[0].name, "Renamed");
  const copy = c.get("sim-test-llm");
  copy.name = "Mutated";
  assert.equal(c.get("sim-test-llm").name, "Greeting response");
  assert.throws(() => c.createFolder({ name: "" }));
  assert.throws(() => c.renameFolder(child.id, { name: 3 }));
  c.deleteFolder(parent.id, true);
  assert.throws(() => c.get("sim-test-llm"));
  assert.throws(() => c.folder(child.id));
  assert.equal(c.get("sim-test-tool").type, "tool");
  assert.throws(() =>
    c.summaries({ test_ids: ["sim-test-tool", "sim-test-tool"] }),
  );
  assert.deepEqual(
    Object.keys(c.summaries({ test_ids: ["missing", "sim-test-tool"] }).tests),
    ["sim-test-tool"],
  );
  await runner.run(scenarios.reset);
  assert.equal(c.tests.size, 3);
  assert.equal(c.folders.size, 1);
  assert.equal(c.nextId, 1);
});
test("agent test Dispatcher management persists folders and definitions without test execution", async () => {
  const app = await createDispatcherHarness(),
    other = await createDispatcherHarness();
  const send = (p: string, m: string, b?: unknown) =>
    app.request(p, {
      method: m,
      ...(b === undefined
        ? {}
        : {
            headers: { "content-type": "application/json" },
            body: JSON.stringify(b),
          }),
    });
  const initial = await app.request(base);
  assert.equal(initial.status, 200);
  assert.equal((await initial.json()).tests.length, 4);
  for (const [id, type] of [
    ["sim-test-tool", "tool"],
    ["sim-test-simulation", "simulation"],
  ]) {
    const r = await app.request(`${base}/${id}`);
    assert.equal(r.status, 200);
    assert.equal((await r.json()).type, type);
  }
  const detail = await app.request(`${base}/sim-test-llm`);
  assert.equal(detail.status, 200);
  assert.equal(
    (await detail.json()).success_condition,
    "Give a clear greeting",
  );
  const response = await send(`${base}/folders`, "POST", {
    name: "New folder",
  });
  assert.equal(response.status, 200);
  const folder = await response.json();
  assert.equal(folder.id, "sim-test-folder-created-1");
  const renamed = await send(`${base}/folders/${folder.id}`, "PATCH", {
    name: "Updated folder",
  });
  assert.equal(renamed.status, 200);
  assert.equal((await renamed.json()).name, "Updated folder");
  const moved = await send(`${base}/bulk-move`, "POST", {
    entity_ids: ["sim-test-llm", "sim-test-folder"],
    move_to: folder.id,
  });
  assert.equal(moved.status, 200);
  assert.deepEqual(await moved.json(), {});
  const tree = await app.request(`${base}/folders/${folder.id}`);
  assert.equal(tree.status, 200);
  assert.equal((await tree.json()).children_count, 2);
  const page = await app.request(
    `${base}?parent_folder_id=${folder.id}&sort_mode=folders_first&page_size=1`,
  );
  assert.equal(page.status, 200);
  const p = await page.json();
  assert.equal(p.tests[0].id, "sim-test-folder");
  assert.equal(p.has_more, true);
  const next = await (
    await app.request(
      `${base}?parent_folder_id=${folder.id}&sort_mode=folders_first&page_size=1&cursor=${p.next_cursor}`,
    )
  ).json();
  assert.equal(next.tests[0].id, "sim-test-llm");
  assert.equal(next.has_more, false);
  const byType = await (await app.request(`${base}?types=tool`)).json();
  assert.deepEqual(
    byType.tests.map((t: { id: string }) => t.id),
    ["sim-test-tool"],
  );
  assert.equal(
    (await (await app.request(`${base}?include_folders=false`)).json()).tests
      .length,
    3,
  );
  assert.equal(
    (await (await app.request(`${base}?sharing_mode=shared_with_me`)).json())
      .tests[0].id,
    "sim-test-simulation",
  );
  assert.equal(
    (
      await (
        await app.request(`${base}?created_by_user_id=@me&types=simulation`)
      ).json()
    ).tests.length,
    0,
  );
  assert.equal(
    (await (await app.request(`${base}?search=GREETING`)).json()).tests[0].id,
    "sim-test-llm",
  );
  const sums = await send(`${base}/summaries`, "POST", {
    test_ids: ["sim-test-llm", "missing"],
  });
  assert.equal(sums.status, 200);
  assert.deepEqual(Object.keys((await sums.json()).tests), ["sim-test-llm"]);
  const rejected = await send(`${base}/bulk-move`, "POST", {
    entity_ids: ["sim-test-llm", "missing"],
    move_to: null,
  });
  assert.equal(rejected.status, 404);
  assert.equal(
    (
      await (
        await app.request(`${base}?parent_folder_id=${folder.id}&types=llm`)
      ).json()
    ).tests.length,
    1,
  );
  assert.equal(
    (
      await send(`${base}/bulk-move`, "POST", {
        entity_ids: [folder.id],
        move_to: "sim-test-folder",
      })
    ).status,
    400,
  );
  assert.equal(
    (await send(`${base}/folders/${folder.id}`, "DELETE")).status,
    409,
  );
  for (const [p, m, b] of [
    [`${base}/folders`, "POST", { name: 4 }],
    [`${base}/folders/${folder.id}`, "PATCH", { name: "" }],
    [
      `${base}/summaries`,
      "POST",
      { test_ids: ["sim-test-llm", "sim-test-llm"] },
    ],
  ] as const)
    assert.equal((await send(p, m, b)).status, 400);
  for (const q of [
    "page_size=0",
    "cursor=bad",
    "types=bad",
    "include_folders=bad",
    "sharing_mode=bad",
  ])
    assert.equal((await app.request(`${base}?${q}`)).status, 400);
  const removed = await send(`${base}/sim-test-simulation`, "DELETE");
  assert.equal(removed.status, 200);
  assert.deepEqual(await removed.json(), {});
  assert.equal((await app.request(`${base}/sim-test-simulation`)).status, 404);
  const deleted = await send(
    `${base}/folders/${folder.id}?force=true`,
    "DELETE",
  );
  assert.equal(deleted.status, 204);
  assert.equal(await deleted.text(), "");
  assert.equal((await app.request(`${base}/sim-test-tool`)).status, 404);
  assert.equal(
    (await app.request(`${base}/folders/sim-test-folder`)).status,
    404,
  );
  assert.equal((await (await other.request(base)).json()).tests.length, 4);
  await app.scenario("emptyAgentTests", "api");
  assert.equal((await (await app.request(base)).json()).tests.length, 0);
  await app.scenario("reset", "api");
  assert.equal((await (await app.request(base)).json()).tests.length, 4);
});
