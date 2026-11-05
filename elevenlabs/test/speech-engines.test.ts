import assert from "node:assert/strict";
import test from "node:test";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import { createScenarioRunner } from "../test-support/scenarios.js";
import * as scenarios from "../api/scenarios/index.js";
const base = "/v1/speech-engine";
const body = () => ({
  name: "New local engine",
  speech_engine: {
    ws_url: "wss://example.invalid/transcript",
    request_headers: { "X-Local": "value" },
  },
  tts: { voice_id: "sim-assistant" },
  tags: ["local"],
});
test("speech engine context starts empty and persists atomic independent configurations", async () => {
  const { Context } = await import("../api/routes/speech-engine/_.context.js");
  assert.equal(new Context().engines.size, 0);
  const r = await createScenarioRunner();
  await r.run(scenarios.startup);
  const c = r.loadContext("/speech-engine");
  const source = body(),
    created = c.create(source);
  source.speech_engine.request_headers["X-Local"] = "mutated";
  assert.equal(
    c.get(created.speech_engine_id).speech_engine.request_headers?.["X-Local"],
    "value",
  );
  const before = c.get(created.speech_engine_id),
    counter = c.nextId;
  for (const value of [
    { name: "" },
    { speech_engine: { ws_url: "https://example.invalid" } },
    { cascade_timeout_seconds: 1 },
    { tags: [5] },
  ])
    assert.throws(() => c.patch(created.speech_engine_id, value));
  assert.deepEqual(c.get(created.speech_engine_id), before);
  assert.equal(c.nextId, counter);
  assert.throws(() => c.create({ speech_engine: { ws_url: "invalid" } }));
  assert.equal(c.nextId, counter);
  const updated = c.patch(created.speech_engine_id, {
    name: null,
    tts: { stability: 0.25 },
    tags: [],
  });
  assert.equal(updated.name, before.name);
  assert.equal(updated.tts.voice_id, "sim-assistant");
  assert.equal(updated.tts.stability, 0.25);
  assert.deepEqual(updated.tags, []);
  assert.ok(
    updated.metadata.updated_at_unix_secs >
      before.metadata.updated_at_unix_secs,
  );
  const noop = c.patch(created.speech_engine_id, {});
  assert.deepEqual(noop, updated);
  const copy = c.duplicate(created.speech_engine_id, { name: "Independent" });
  c.patch(copy.speech_engine_id, {
    speech_engine: { ws_url: "wss://example.invalid/other" },
  });
  assert.equal(
    c.get(created.speech_engine_id).speech_engine.ws_url,
    "wss://example.invalid/transcript",
  );
  copy.tags.push("mutated");
  assert.deepEqual(c.get(copy.speech_engine_id).tags, []);
  assert.throws(() => c.list({ page_size: 0 }));
  assert.throws(() => c.list({ cursor: "bad" }));
  assert.throws(() => c.list({ sort_by: "bad" }));
  c.delete(created.speech_engine_id);
  assert.throws(() => c.get(created.speech_engine_id));
  assert.ok(c.get(copy.speech_engine_id));
  await r.run(scenarios.reset);
  assert.equal(c.engines.size, 1);
  assert.equal(c.nextId, 1);
});
test("speech engine Dispatcher lifecycle, nested configuration, filters, validation and reset", async () => {
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
  assert.equal((await initial.json()).speech_engines.length, 1);
  const result = await send(base, "POST", body());
  assert.equal(result.status, 201);
  const created = await result.json(),
    id = created.speech_engine_id;
  assert.equal(id, "sim-speech-engine-created-1");
  assert.equal(created.tts.voice_id, "sim-assistant");
  assert.equal(created.auth.enable_auth, false);
  const patch = await send(`${base}/${id}`, "PATCH", {
    name: "Updated engine",
    tts: { speed: 1.2 },
    privacy: { record_voice: false },
    tags: [],
  });
  assert.equal(patch.status, 200);
  const updated = await patch.json();
  assert.equal(updated.tts.voice_id, "sim-assistant");
  assert.equal(updated.tts.speed, 1.2);
  assert.equal(updated.privacy.record_voice, false);
  const effects = await send(`${base}/${id}`, "PATCH", {
    tts: { audio_effects: { distance: 0.4 } },
  });
  assert.equal(effects.status, 200);
  assert.deepEqual((await effects.json()).tts.audio_effects, {
    filter_preset_id: null,
    distance: 0.4,
    environment_id: null,
    background_noise_id: null,
    send_level: 1,
    pan: 0,
  });
  const clearEffects = await send(`${base}/${id}`, "PATCH", {
    tts: { audio_effects: null },
  });
  assert.equal(clearEffects.status, 200);
  assert.equal((await clearEffects.json()).tts.audio_effects, null);
  const nulls = await send(`${base}/${id}`, "PATCH", { name: null, tts: null });
  assert.equal(nulls.status, 200);
  assert.equal((await nulls.json()).name, "Updated engine");
  const read = await app.request(`${base}/${id}`);
  assert.equal(read.status, 200);
  assert.equal((await read.json()).name, "Updated engine");
  const duplicate = await send(`${base}/${id}/duplicate`, "POST", {
    name: "Copy engine",
  });
  assert.equal(duplicate.status, 201);
  const copy = await duplicate.json();
  assert.notEqual(copy.speech_engine_id, id);
  assert.deepEqual(copy.tts, { ...updated.tts, audio_effects: null });
  const page = await app.request(
    `${base}?page_size=1&sort_by=name&sort_direction=asc`,
  );
  assert.equal(page.status, 200);
  const p = await page.json();
  assert.equal(p.speech_engines[0].name, "Copy engine");
  assert.equal(p.has_more, true);
  assert.equal(
    (
      await app.request(
        `${base}?cursor=${p.next_cursor}&page_size=1&sort_by=name&sort_direction=asc`,
      )
    ).status,
    200,
  );
  const search = await app.request(`${base}?search=UPDATED`);
  assert.equal(search.status, 200);
  assert.equal((await search.json()).speech_engines.length, 1);
  for (const [p, m, b] of [
    [base, "POST", { speech_engine: { ws_url: "http://example.invalid" } }],
    [`${base}/${id}`, "PATCH", { cascade_timeout_seconds: 16 }],
    [`${base}/${id}`, "PATCH", { tts: { speed: "fast" } }],
    [`${base}/${id}/duplicate`, "POST", { name: "" }],
  ] as const)
    assert.equal((await send(p, m, b)).status, 400);
  assert.equal(
    (await (await app.request(`${base}/${id}`)).json()).tts.speed,
    1.2,
  );
  for (const q of ["page_size=0", "cursor=bad", "sort_by=bad"])
    assert.equal((await app.request(`${base}?${q}`)).status, 400);
  assert.equal(
    (await send(`${base}/${id}/duplicate`, "POST", null)).status,
    201,
  );
  assert.equal((await app.request(`${base}/missing`)).status, 404);
  assert.equal((await send(`${base}/missing`, "PATCH", {})).status, 404);
  assert.equal(
    (await send(`${base}/missing/duplicate`, "POST", {})).status,
    404,
  );
  const deleted = await send(`${base}/${id}`, "DELETE");
  assert.equal(deleted.status, 204);
  assert.equal(await deleted.text(), "");
  assert.equal((await app.request(`${base}/${id}`)).status, 404);
  assert.equal(
    (await app.request(`${base}/${copy.speech_engine_id}`)).status,
    200,
  );
  assert.equal((await app.request("/v1/voices/sim-assistant")).status, 200);
  assert.equal(
    (await (await other.request(base)).json()).speech_engines.length,
    1,
  );
  await app.scenario("emptySpeechEngines", "api");
  assert.equal(
    (await (await app.request(base)).json()).speech_engines.length,
    0,
  );
  await app.scenario("reset", "api");
  assert.equal(
    (await (await app.request(base)).json()).speech_engines.length,
    1,
  );
  assert.equal(
    (await (await send(base, "POST", body())).json()).speech_engine_id,
    id,
  );
});
