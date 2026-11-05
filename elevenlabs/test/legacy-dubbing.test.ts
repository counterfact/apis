import assert from "node:assert/strict";
import test from "node:test";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import { createScenarioRunner } from "../test-support/scenarios.js";
import * as scenarios from "../api/scenarios/index.js";
test("legacy context filters copies exports and deletion", async () => {
  const r = await createScenarioRunner();
  await r.run(scenarios.startup);
  const c = r.loadContext("/dubbing");
  assert.equal(c.list({}).dubs.length, 2);
  assert.equal(
    c.list({ dubbing_statuses: "dubbed" }).dubs[0].dubbing_id,
    "sim-legacy-dub",
  );
  assert.equal(c.list({ filter_by_creator: "others" }).dubs.length, 1);
  const page = c.list({ page_size: 1 });
  assert.equal(page.next_cursor, "1");
  assert.equal(c.list({ cursor: page.next_cursor }).dubs.length, 1);
  assert.equal(
    c.list({ dubbing_status: "dubbed", dubbing_statuses: "dubbing" }).dubs
      .length,
    0,
  );
  assert.equal(
    c.list({ order_by: "name", order_direction: "ASCENDING" }).dubs[0]
      .dubbing_id,
    "sim-legacy-dub",
  );
  c.records.get("sim-legacy-pending")!.metadata.created_at =
    c.records.get("sim-legacy-dub")!.metadata.created_at;
  assert.equal(
    c.list({ order_direction: "ASCENDING" }).dubs[0].dubbing_id,
    "sim-legacy-dub",
  );
  const copy = c.transcript("sim-legacy-dub", "es", "json");
  copy.json!.utterances[0].text = "Changed";
  assert.equal(
    c.transcript("sim-legacy-dub", "es", "json").json!.utterances[0].text,
    "Texto local",
  );
  const value = c.get("sim-legacy-dub");
  value.target_languages.push("xx");
  assert.deepEqual(c.get("sim-legacy-dub").target_languages, ["es"]);
  assert.match(
    c.transcript("sim-legacy-dub", "source", "srt").srt!,
    /00:00:00,000 --> 00:00:02,000/,
  );
  assert.equal(
    c.transcript("sim-legacy-dub", "es", "json").json!.utterances[0].text,
    "Texto local",
  );
  assert.throws(() => c.transcript("sim-legacy-pending", "source", "srt"), {
    code: "dubbing_not_dubbed",
  });
  for (const query of [
    { cursor: "bad" },
    { page_size: 201 },
    { order_by: "bad" },
    { dubbing_models: "bad" },
  ])
    assert.throws(() => c.list(query));
  c.delete("sim-legacy-dub");
  assert.equal(c.list({}).dubs.length, 1);
  assert.throws(() => c.get("sim-legacy-dub"), { code: "dubbing_not_found" });
  await r.run(scenarios.reset);
  assert.equal(c.list({}).dubs.length, 2);
});
test("legacy Dispatcher metadata and both transcript routes share deletion/reset", async () => {
  const h = await createDispatcherHarness();
  const read = async (path: string, status = 200) => {
    const r = await h.request(`/v1/dubbing${path}`);
    assert.equal(r.status, status);
    return r;
  };
  const list = await (await read("?page_size=1")).json();
  assert.equal(list.dubs.length, 1);
  assert.equal(list.has_more, true);
  assert.equal(
    (
      await (
        await read(
          "?dubbing_statuses=dubbed&dubbing_models=dubbing_v1&target_language_codes=es&creation_sources=dubbing_api&filter_by_creator=personal",
        )
      ).json()
    ).dubs[0].dubbing_id,
    "sim-legacy-dub",
  );
  const srt = await read("/sim-legacy-dub/transcript/source");
  assert.match(srt.headers.get("content-type")!, /text\/plain/);
  assert.match(await srt.text(), /Local source/);
  assert.match(
    await (
      await read("/sim-legacy-dub/transcript/es?format_type=webvtt")
    ).text(),
    /^WEBVTT/,
  );
  const json = await (
    await read("/sim-legacy-dub/transcript/es?format_type=json")
  ).json();
  assert.equal(json.language, "es");
  assert.deepEqual(
    (await (await read("/sim-legacy-dub/transcripts/es/format/json")).json())
      .json,
    json,
  );
  assert.match(
    (await (await read("/sim-legacy-dub/transcripts/source/format/srt")).json())
      .srt,
    /Local source/,
  );
  await read("/sim-legacy-pending/transcript/source", 425);
  await read("/sim-legacy-dub/transcript/fr", 404);
  await read("?cursor=x", 400);
  await read("/sim-legacy-dub/transcripts/es/format/bad", 400);
  const deleted = await h.request("/v1/dubbing/sim-legacy-dub", {
    method: "DELETE",
  });
  assert.equal(deleted.status, 200);
  assert.deepEqual(await deleted.json(), { status: "ok" });
  await read("/sim-legacy-dub", 404);
  await read("/sim-legacy-dub/transcript/es", 404);
  assert.equal((await (await read("")).json()).dubs.length, 1);
  assert.equal(
    (await h.request("/v1/dubbing/resource/sim-dubbing-resource")).status,
    200,
  );
  await h.scenario("reset");
  await read("/sim-legacy-dub");
  await h.scenario("emptyLegacyDubbing");
  assert.deepEqual((await (await read("")).json()).dubs, []);
  const other = await createDispatcherHarness();
  assert.equal((await other.request("/v1/dubbing/sim-legacy-dub")).status, 200);
});
