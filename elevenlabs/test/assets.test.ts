import assert from "node:assert/strict";
import test from "node:test";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import * as scenarios from "../api/scenarios/index.js";

test("asset context orders, filters, copies and deletes metadata", async () => {
  const r = await createScenarioRunner();
  await r.run(scenarios.startup);
  const c = r.loadContext("/assets");
  const page = c.list({ page_size: 1 });
  assert.equal(page.assets[0].asset_id, "sim-asset-pending");
  assert.equal(page.has_more, true);
  assert.equal(
    c.list({ cursor: page.next_cursor }).assets[0].asset_id,
    "sim-asset-audio",
  );
  assert.equal(
    c.list({ search: "INTRO" }).assets[0].asset_id,
    "sim-asset-audio",
  );
  assert.deepEqual(c.list({ cursor: "99" }).assets, []);
  const copy = c.get("sim-asset-audio");
  copy.name = "Changed";
  const list = c.list({});
  list.assets[0].name = "Changed";
  assert.equal(c.get("sim-asset-audio").name, "Local intro.mp3");
  assert.equal(c.get("sim-asset-pending").content_url, null);
  for (const query of [
    { page_size: 0 },
    { page_size: 101 },
    { cursor: "x" },
    { search: 3 },
  ])
    assert.throws(() => c.list(query));
  c.records.set("aaa", { ...c.get("sim-asset-audio"), asset_id: "aaa" });
  assert.deepEqual(
    c
      .list({})
      .assets.slice(1)
      .map((a) => a.asset_id),
    ["aaa", "sim-asset-audio"],
  );
  c.delete("sim-asset-audio");
  assert.throws(() => c.get("sim-asset-audio"), { code: "asset_not_found" });
  assert.throws(() => c.delete("missing"), { code: "asset_not_found" });
  await r.run(scenarios.reset);
  assert.equal(c.list({}).assets.length, 2);
});

test("asset Dispatcher validates list/read/delete with reset and isolated instances", async () => {
  const h = await createDispatcherHarness();
  const read = async (suffix = "", status = 200) => {
    const r = await h.request(`/v1/assets${suffix}`);
    assert.equal(r.status, status);
    return r;
  };
  const page = await (await read("?page_size=1")).json();
  assert.equal(page.assets[0].asset_id, "sim-asset-pending");
  assert.equal(page.assets[0].content_url, null);
  assert.equal(
    (await (await read(`?cursor=${page.next_cursor}`)).json()).assets[0]
      .asset_id,
    "sim-asset-audio",
  );
  assert.equal((await (await read("?search=INTRO")).json()).assets.length, 1);
  await read("?page_size=0", 400);
  await read("?cursor=no", 400);
  await read("/missing", 404);
  const deleted = await h.request("/v1/assets/sim-asset-audio", {
    method: "DELETE",
  });
  assert.equal(deleted.status, 204);
  assert.equal(await deleted.text(), "");
  await read("/sim-asset-audio", 404);
  assert.equal((await (await read()).json()).assets.length, 1);
  assert.equal(
    (await h.request("/v1/assets/sim-asset-audio", { method: "DELETE" }))
      .status,
    404,
  );
  assert.equal((await h.request("/v1/flows/image")).status, 200);
  await h.scenario("reset");
  await read("/sim-asset-audio");
  await h.scenario("emptyAssets");
  assert.deepEqual((await (await read()).json()).assets, []);
  const other = await createDispatcherHarness();
  assert.equal((await other.request("/v1/assets/sim-asset-audio")).status, 200);
});
