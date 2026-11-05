import assert from "node:assert/strict";
import test from "node:test";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import * as scenarios from "../api/scenarios/index.js";

test("music finetune context filters, copies and edits metadata atomically", async () => {
  const r = await createScenarioRunner();
  await r.run(scenarios.startup);
  const c = r.loadContext("/music/finetunes");
  assert.equal(c.list({}).finetunes.length, 3);
  const tie = c.get("sim-music-self");
  c.records.set("sim-music-a-tie", { ...tie, id: "sim-music-a-tie" });
  assert.deepEqual(
    c.list({ created_by: "self", sort: "name" }).finetunes.map((f) => f.id),
    ["sim-music-a-tie", "sim-music-self"],
  );
  assert.deepEqual(
    c.list({ created_by: "self" }).finetunes.map((f) => f.id),
    ["sim-music-a-tie", "sim-music-self"],
  );
  c.records.delete("sim-music-a-tie");
  const listed = c.list({});
  listed.finetunes[0].tags.push("list mutation");
  assert.deepEqual(c.get(listed.finetunes[0].id).tags, ["local"]);

  assert.equal(
    c.list({ visibility: "private", created_by: "self" }).finetunes[0].id,
    "sim-music-self",
  );
  const page = c.list({ page_size: 1, sort: "name", sort_direction: "asc" });
  assert.equal(page.finetunes[0].id, "sim-music-curated");
  assert.equal(
    c.list({
      cursor: page.next_cursor,
      page_size: 1,
      sort: "name",
      sort_direction: "asc",
    }).finetunes[0].id,
    "sim-music-self",
  );
  assert.deepEqual(c.list({ cursor: "99" }).finetunes, []);
  const copy = c.get("sim-music-self");
  copy.tags.push("mutated");
  assert.deepEqual(c.get("sim-music-self").tags, ["local"]);
  const updated = c.update("sim-music-self", {
    name: "Renamed",
    tags: [],
    primary_genre: null,
    visibility: "workspace",
  });
  assert.equal(updated.name, "Renamed");
  assert.equal(updated.primary_genre, null);
  assert.deepEqual(updated.tags, []);
  (updated.tags as string[]).push("returned mutation");
  assert.deepEqual(c.get("sim-music-self").tags, []);
  c.update("sim-music-self", { name: null, tags: null, visibility: null });
  assert.equal(c.get("sim-music-self").name, "Renamed");
  for (const q of [
    { page_size: 151 },
    { cursor: "x" },
    { sort: "x" },
    { created_by: "x" },
  ])
    assert.throws(() => c.list(q));
  for (const body of [{ name: " " }, { visibility: "public" }, { tags: [1] }])
    assert.throws(() => c.update("sim-music-self", body));
  assert.equal(c.get("sim-music-self").name, "Renamed");
  assert.throws(() => c.update("sim-music-curated", { name: "Changed" }), {
    code: "finetune_read_only",
  });
  assert.equal(c.delete("sim-music-self").id, "sim-music-self");
  assert.throws(() => c.get("sim-music-self"), { code: "finetune_not_found" });
  await r.run(scenarios.reset);
  assert.equal(c.list({}).finetunes.length, 3);
});

test("music finetune Dispatcher validates metadata lifecycle, isolation and reset", async () => {
  const h = await createDispatcherHarness();
  const request = async (
    path = "",
    method = "GET",
    body?: unknown,
    status = 200,
  ) => {
    const response = await h.request(`/v1/music/finetunes${path}`, {
      method,
      ...(body === undefined
        ? {}
        : {
            body: JSON.stringify(body),
            headers: { "content-type": "application/json" },
          }),
    });
    assert.equal(response.status, status);
    return response;
  };
  assert.equal((await (await request("?page_size=1")).json()).has_more, true);
  assert.equal(
    (await (await request("?visibility=private&created_by=self")).json())
      .finetunes[0].id,
    "sim-music-self",
  );
  await request("?cursor=invalid", "GET", undefined, 400);
  await request("/missing", "GET", undefined, 404);
  assert.equal(
    (
      await (
        await request("/sim-music-self", "PATCH", {
          name: "HTTP name",
          visibility: "workspace",
        })
      ).json()
    ).name,
    "HTTP name",
  );
  assert.equal(
    (await (await request("?visibility=private")).json()).finetunes.length,
    0,
  );
  await request("/sim-music-self", "PATCH", { tags: [1] }, 400);
  assert.equal(
    (await (await request("/sim-music-self")).json()).name,
    "HTTP name",
  );
  await request("/sim-music-curated", "PATCH", { name: "Forbidden" }, 403);
  await request("/sim-music-workspace", "DELETE", undefined, 403);
  assert.equal(
    (await (await request("/sim-music-self", "DELETE")).json()).id,
    "sim-music-self",
  );
  await request("/sim-music-self", "GET", undefined, 404);
  assert.equal((await (await request()).json()).finetunes.length, 2);
  await h.scenario("reset");
  await request("/sim-music-self");
  await h.scenario("emptyMusicFinetunes");
  assert.deepEqual((await (await request()).json()).finetunes, []);
  const other = await createDispatcherHarness();
  assert.equal(
    (await other.request("/v1/music/finetunes/sim-music-self")).status,
    200,
  );
});
