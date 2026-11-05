import assert from "node:assert/strict";
import test from "node:test";
import { Context } from "../api/routes/sound-generation/_.context.js";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import * as scenarios from "../api/scenarios/index.js";

test("sound context retains copied fixture requests and enforces options/quota atomically", async () => {
  const empty = new Context();
  assert.equal(empty.audio.length, 0);
  assert.equal(empty.requests.size, 0);
  const r = await createScenarioRunner(); await r.run(scenarios.startup);
  const c = r.loadContext("/sound-generation"), root = r.loadContext("/");
  const before = root.getSubscription().character_count;
  const result = c.generate({ text: "A😀B" });
  assert.equal(result.cost, 3);
  assert.equal(root.getSubscription().character_count, before + 3);
  assert.deepEqual([...result.audio.slice(0, 4)], [255, 251, 144, 100]);
  assert.equal(result.audio.length, 8340);
  assert.equal(c.requests.get(result.requestId)?.text, "A😀B");
  result.audio[0] = 0;
  assert.equal(c.requests.get(result.requestId)!.audio[0], 255);
  const count = c.nextRequest, usage = root.getSubscription().character_count;
  for (const body of [{ text: "" }, { text: "Hi", loop: true }, { text: "Hi", duration_seconds: 2 }, { text: "Hi", prompt_influence: 0.5 }, { text: "Hi", model_id: "eleven_text_to_sound_v3" }])
    assert.throws(() => c.generate(body), { status: 400 });
  assert.throws(() => c.generate({ text: "Hi" }, { output_format: "wav_44100" }), { status: 400 });
  assert.equal(c.nextRequest, count); assert.equal(root.getSubscription().character_count, usage);
  c.generate({ text: "Hi", duration_seconds: 23040 / 44100, loop: false, prompt_influence: 0.3 }, { enable_logging: false });
  assert.equal(c.requests.size, 1);
  root.models.delete("eleven_text_to_sound_v2");
  const n = c.nextRequest;
  assert.throws(() => c.generate({ text: "Hi" }), { status: 404 });
  assert.equal(c.nextRequest, n);
  await r.run(scenarios.reset); await r.run(scenarios.quotaExhausted);
  assert.throws(() => c.generate({ text: "Hi" }), { status: 429 });
  assert.equal(c.nextRequest, 0); assert.equal(c.requests.size, 0);
  await r.run(scenarios.reset); assert.equal(root.getSubscription().character_count, before);
});

test("Dispatcher sound fixtures expose exact MPEG/header/quota behavior with reset and isolation", async () => {
  const h = await createDispatcherHarness();
  const post = async (body: unknown, query = "", status = 200) => {
    const response = await h.request(`/v1/sound-generation${query}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    assert.equal(response.status, status, await response.clone().text()); return response;
  };
  const usage = async () => (await (await h.request("/v1/user/subscription")).json()).character_count;
  const before = await usage(), history = await (await h.request("/v1/history")).json();
  const response = await post({ text: "A😀B" });
  assert.equal(response.headers.get("content-type"), "audio/mpeg");
  assert.equal(response.headers.get("character-cost"), "3");
  assert.match(response.headers.get("request-id")!, /^sim-sound-request-/);
  const bytes = new Uint8Array(await response.arrayBuffer()); assert.equal(bytes.length, 8340);
  assert.deepEqual([...bytes.slice(0, 4)], [255, 251, 144, 100]);
  assert.equal(await usage(), before + 3);
  assert.deepEqual(await (await h.request("/v1/history")).json(), history);
  await post({ text: "Hi" }, "?enable_logging=false"); assert.equal(await usage(), before + 5);
  await post({ text: 42 }, "", 400);
  await post({ text: "Hi", loop: true }, "", 400);
  await post({ text: "Hi", duration_seconds: 2 }, "", 400);
  await post({ text: "Hi" }, "?output_format=wav_44100", 400);
  assert.equal(await usage(), before + 5);
  await h.scenario("emptyModels"); await post({ text: "Hi" }, "", 404);
  await h.scenario("reset"); await h.scenario("quotaExhausted"); await post({ text: "Hi" }, "", 429);
  const other = await createDispatcherHarness(); assert.equal((await (await other.request("/v1/user/subscription")).json()).character_count, before);
  await h.scenario("reset"); assert.equal(await usage(), before);
  const again = await post({ text: "Hi" }); assert.equal(again.headers.get("request-id"), "sim-sound-request-1");
});
