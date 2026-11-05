import assert from "node:assert/strict";
import test from "node:test";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import { Context } from "../api/routes/voices/pvc/_.context.js";
import * as scenarios from "../api/scenarios/index.js";

test("PVC context stores metadata atomically on canonical voices", async () => {
  const empty = new Context();
  assert.equal(empty.nextVoice, 0);
  assert.equal(empty.root, undefined);
  assert.throws(() => empty.create({ name: "Before init", language: "en" }));
  const r = await createScenarioRunner();
  await r.run(scenarios.startup);
  const c = r.loadContext("/voices/pvc");
  const root = r.context;
  const input = {
    name: "Local professional",
    language: "en",
    labels: { accent: "american" },
    description: "Metadata",
  };
  const id = c.create(input).voice_id;
  assert.equal(id, "sim-pvc-created-1");
  input.labels.accent = "changed";
  assert.equal(root.getVoice(id)!.labels.accent, "american");
  assert.equal(root.getVoice(id)!.category, "professional");
  assert.deepEqual(root.getVoice(id)!.samples, []);
  assert.deepEqual(root.getVoice(id)!.high_quality_base_model_ids, []);
  c.update(id, {
    name: "Updated",
    language: "es",
    labels: { accent: "spanish" },
    description: null,
  });
  assert.deepEqual(root.getVoice(id)!.labels, {
    accent: "spanish",
    language: "es",
  });
  assert.equal(root.getVoice(id)!.fine_tuning!.language, "es");
  assert.equal(root.getVoice(id)!.description, null);
  c.update(id, { labels: null });
  assert.equal(root.getVoice(id)!.labels.accent, "spanish");
  c.update(id, { language: "fr" });
  assert.equal(root.getVoice(id)!.labels.language, "fr");
  const copy = root.getVoice(id)!;
  copy.labels.accent = "Changed";
  assert.equal(root.getVoice(id)!.labels.accent, "spanish");
  c.update(id, { language: "es" });
  const unowned = structuredClone(root.getVoice(id)!);
  unowned.voice_id = "unowned";
  unowned.is_owner = false;
  root.voices.set("unowned", unowned);
  assert.throws(() => c.update("unowned", { name: "Denied" }), {
    code: "voice_not_owned",
  });
  root.voices.delete("unowned");
  for (const body of [
    { name: " " },
    { language: "" },
    { labels: { language: "de" } },
    { samples: [] },
  ])
    assert.throws(() => c.update(id, body));
  assert.equal(root.getVoice(id)!.name, "Updated");
  for (const body of [
    { name: "", language: "en" },
    { name: "Bad", language: "en", labels: { language: "es" } },
  ])
    assert.throws(() => c.create(body));
  assert.equal(
    c.create({ name: "Next", language: "en" }).voice_id,
    "sim-pvc-created-2",
  );
  root.voices.set("sim-pvc-created-3", {
    ...root.getVoice(id)!,
    voice_id: "sim-pvc-created-3",
    name: "Existing",
  });
  assert.equal(
    c.create({ name: "After collision", language: "en" }).voice_id,
    "sim-pvc-created-4",
  );
  assert.equal(root.getVoice("sim-pvc-created-3")!.name, "Existing");
  const beforeCount = root.voices.size,
    beforeId = c.nextVoice;
  assert.throws(() =>
    c.create({ name: "Bad", language: "en", labels: { language: "de" } }),
  );
  assert.equal(root.voices.size, beforeCount);
  assert.equal(c.nextVoice, beforeId);
  assert.throws(() => c.update("sim-narrator", {}), {
    code: "voice_not_professional",
  });
  assert.throws(() => c.update("missing", {}), { code: "voice_not_found" });
  root.editSettings(id, { stability: 0.2 });
  c.update(id, { description: "Edited" });
  assert.equal(root.getVoice(id)!.settings!.stability, 0.2);
  await r.run(scenarios.reset);
  assert.equal(root.getVoice(id), undefined);
  assert.equal(
    c.create({ name: "Again", language: "en" }).voice_id,
    "sim-pvc-created-1",
  );
});

test("PVC Dispatcher creation/edit share owned voice lifecycle across API versions", async () => {
  const h = await createDispatcherHarness();
  const post = async (path: string, body: unknown, status = 200) => {
    const response = await h.request(`/v1/voices/pvc${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    assert.equal(response.status, status);
    return response;
  };
  const id = (
    await (
      await post("", {
        name: "HTTP professional",
        language: "en",
        labels: { accent: "american" },
      })
    ).json()
  ).voice_id;
  assert.equal(id, "sim-pvc-created-1");
  const voice = await (await h.request(`/v1/voices/${id}`)).json();
  assert.equal(voice.category, "professional");
  assert.deepEqual(voice.samples, []);
  assert.equal(
    (
      await (
        await h.request("/v2/voices?category=professional&language=en")
      ).json()
    ).total_count,
    1,
  );
  await post(`/${id}`, {
    name: "Renamed",
    language: "es",
    labels: { accent: "spanish" },
    description: null,
  });
  assert.equal(
    (await (await h.request(`/v1/voices/${id}`)).json()).name,
    "Renamed",
  );
  assert.equal(
    (
      await (
        await h.request("/v2/voices?category=professional&language=en")
      ).json()
    ).total_count,
    0,
  );
  assert.equal(
    (
      await (
        await h.request("/v2/voices?category=professional&language=es")
      ).json()
    ).total_count,
    1,
  );
  await post(`/${id}`, { labels: { language: "de" } }, 400);
  await post(`/${id}`, { name: 3 }, 400);
  await post("/sim-narrator", {}, 409);
  await post("/missing", {}, 404);
  assert.equal(
    (
      await h.request(`/v1/voices/collections/sim-collection/voice/${id}`, {
        method: "POST",
      })
    ).status,
    200,
  );
  assert.equal(
    (
      await (
        await h.request(
          `/v2/voices?collection_id=sim-collection&category=professional`,
        )
      ).json()
    ).total_count,
    1,
  );
  assert.equal(
    (await h.request(`/v1/voices/${id}`, { method: "DELETE" })).status,
    200,
  );
  await post(`/${id}`, {}, 404);
  await h.scenario("reset");
  assert.equal(
    (await (await post("", { name: "Reset", language: "en" })).json()).voice_id,
    "sim-pvc-created-1",
  );
  await h.scenario("emptyPvcVoices");
  assert.equal(
    (await (await h.request("/v2/voices?category=professional")).json())
      .total_count,
    0,
  );
  assert.equal((await h.request("/v1/voices/sim-narrator")).status, 200);
  const other = await createDispatcherHarness();
  assert.equal(
    (await (await other.request("/v2/voices?category=professional")).json())
      .total_count,
    0,
  );
});
