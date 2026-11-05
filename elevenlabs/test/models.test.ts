import assert from "node:assert/strict";
import test from "node:test";
import { Context } from "../api/routes/_.context.js";
import { reset, startup } from "../api/scenarios/index.js";
import { runScenario } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";

const expectedIds = ["eleven_multilingual_v2", "eleven_flash_v2_5", "eleven_v3", "eleven_multilingual_ttv_v2", "eleven_ttv_v3"];

test("model catalog starts empty, isolates returned objects, and reset restores fixtures", async () => {
  const context = new Context();
  assert.deepEqual(context.listModels(), []);
  await runScenario(context, startup);
  const models = context.listModels();
  assert.deepEqual(models.map((model) => model.model_id), expectedIds);
  models[0].languages[0].name = "Changed outside context";
  models[0].model_rates.character_cost_multiplier = 99;
  models.pop();
  assert.equal(context.listModels().length, 5);
  assert.equal(context.listModels()[0].languages[0].name, "English");
  assert.equal(context.listModels()[0].model_rates.character_cost_multiplier, 1);
  context.models.clear();
  assert.deepEqual(context.listModels(), []);
  await runScenario(context, reset);
  assert.deepEqual(
    context.listModels().map((model) => model.model_id),
    expectedIds,
  );
});

test("Dispatched model discovery is deterministic, reflects scenario state, and agrees with voices", async () => {
  const { scenario, request } = await createDispatcherHarness();
  const getModels = async () => {
    const response = await request("/v1/models");
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type")!, /application\/json/);
    return response.json();
  };
  const models = await getModels();
  assert.deepEqual(
    models.map((model: { model_id: string }) => model.model_id),
    expectedIds,
  );
  assert.deepEqual(await getModels(), models);
  assert.equal(models[0].can_do_text_to_speech, true);
  assert.equal(models[1].maximum_text_length_per_request, 40000);
  assert.deepEqual(
    models[0].languages.map(
      (language: { language_id: string }) => language.language_id,
    ),
    ["en", "es"],
  );
  assert.equal(models[1].model_rates.character_cost_multiplier, 0.5);
  const voicesResponse = await request("/v1/voices");
  assert.equal(voicesResponse.status, 200);
  const { voices } = await voicesResponse.json();
  for (const voice of voices) {
    for (const id of voice.high_quality_base_model_ids) {
      assert.ok(expectedIds.includes(id));
    }
  }
  const deleted = await request("/v1/voices/sim-narrator", {
    method: "DELETE",
  });
  assert.equal(deleted.status, 200);
  assert.deepEqual(await getModels(), models);
  await scenario("emptyModels", "api");
  assert.deepEqual(await getModels(), []);
  await scenario("reset", "api");
  assert.deepEqual(await getModels(), models);
  const restoredVoices = await request("/v1/voices");
  assert.equal(restoredVoices.status, 200);
  assert.equal((await restoredVoices.json()).voices.length, 2);
});
