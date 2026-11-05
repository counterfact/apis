import assert from "node:assert/strict";
import test from "node:test";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import { Context } from "../api/routes/audio-isolation/history/_.context.js";
import * as scenarios from "../api/scenarios/index.js";

test("isolation history context filters, pages, copies and deletes", async () => {
  const r = await createScenarioRunner();
  await r.run(scenarios.startup);
  const c = r.loadContext("/audio-isolation/history");
  assert.deepEqual(new Context().list(), { items: [], has_more: false });
  assert.equal(c.list().items.length, 2);
  assert.equal(c.list({ page_size: 1 }).items[0].id, "sim-isolation-pending");
  assert.equal(
    c.list({ page_size: 1, page: 2 }).items[0].id,
    "sim-isolation-pending",
  );
  assert.equal(
    c.list({ page_size: 1, page: 2, search: "local" }).items[0].id,
    "sim-isolation-podcast",
  );
  assert.equal(
    c.list({ search: "interview" }).items[0].id,
    "sim-isolation-podcast",
  );
  const copy = c.list();
  copy.items[0].title = "mutated";
  assert.equal(c.list().items[0].title, "Local lecture");
  for (const q of [
    { page_size: 0 },
    { page_size: 1001 },
    { page: 0 },
    { page: 1.5 },
    { search: 2 },
  ])
    assert.throws(() => c.list(q));
  const tied = structuredClone(c.records.get("sim-isolation-pending")!);
  tied.item.id = "aaa";
  tied.item.title = null;
  c.records.set("aaa", tied);
  assert.deepEqual(
    c
      .list()
      .items.slice(0, 2)
      .map((x) => x.id),
    ["aaa", "sim-isolation-pending"],
  );
  assert.equal(c.list({ search: "no match" }).has_more, false);
  assert.deepEqual(c.list({ search: "local", page: 99 }).items, []);
  c.records.delete("aaa");
  c.delete("sim-isolation-podcast");
  assert.equal(c.list().items.length, 1);
  assert.throws(() => c.delete("sim-isolation-podcast"));
  await r.run(scenarios.reset);
  assert.equal(c.list().items.length, 2);
});
test("validated Dispatcher isolation history deletion, search and reset", async () => {
  const h = await createDispatcherHarness();
  const read = async (suffix = "", status = 200) => {
    const r = await h.request(`/v1/audio-isolation/history${suffix}`);
    assert.equal(r.status, status);
    return r;
  };
  const page = await (await read("?page_size=1")).json();
  assert.equal(page.items[0].id, "sim-isolation-pending");
  assert.equal(page.has_more, true);
  assert.equal(
    (await (await read("?search=LOCAL&page_size=1&page=2")).json()).items[0].id,
    "sim-isolation-podcast",
  );
  assert.equal(
    (await (await read("?search=interview")).json()).items[0].id,
    "sim-isolation-podcast",
  );
  assert.equal(
    (await (await read("?page_size=1&page=2")).json()).items[0].id,
    "sim-isolation-pending",
  );
  assert.deepEqual(await (await read("?search=local&page=99")).json(), {
    items: [],
    has_more: false,
  });
  await read("?page_size=1001", 400);
  await read("?page=0", 400);
  const deletion = await h.request(
    "/v1/audio-isolation/history/sim-isolation-podcast",
    { method: "DELETE" },
  );
  assert.equal(deletion.status, 204);
  assert.equal(await deletion.text(), "");
  assert.equal((await (await read()).json()).items.length, 1);
  assert.equal(
    (
      await h.request("/v1/audio-isolation/history/sim-isolation-podcast", {
        method: "DELETE",
      })
    ).status,
    404,
  );
  assert.equal(
    (await (await h.request("/v1/history")).json()).history.length,
    2,
  );
  assert.equal((await h.request("/v1/voices/sim-narrator")).status, 200);
  await h.scenario("reset");
  assert.equal((await (await read()).json()).items.length, 2);
  await h.scenario("emptyIsolationHistory");
  assert.deepEqual((await (await read()).json()).items, []);
  const other = await createDispatcherHarness();
  assert.equal(
    (await (await other.request("/v1/audio-isolation/history")).json()).items
      .length,
    2,
  );
});
