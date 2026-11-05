import assert from "node:assert/strict";
import test from "node:test";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import * as scenarios from "../api/scenarios/index.js";

test("audio-effects context starts empty and returns sorted defensive catalogs", async () => {
  const { Context } = await import("../api/routes/audio-effects/_.context.js");
  const empty = new Context();
  assert.deepEqual(empty.catalog(), { filter_presets: [], environments: [], background_noises: [] });
  const runner = await createScenarioRunner();
  await runner.run(scenarios.startup);
  const context = runner.loadContext("/audio-effects");
  const catalog = context.catalog();
  assert.deepEqual(catalog.filter_presets.map(item => item.filter_preset_id), ["sim-filter-radio", "sim-filter-soft"]);
  assert.equal(catalog.environments[0].environment_id, "sim-environment-room");
  assert.equal(catalog.background_noises[0].background_noise_id, "sim-noise-rain");
  assert.equal(catalog.filter_presets[1].description, null);
  catalog.filter_presets[0].name = "Changed";
  catalog.environments[0].description = "Changed";
  catalog.background_noises.splice(0);
  assert.equal(context.catalog().filter_presets[0].name, "Simulator radio");
  assert.equal(context.catalog().environments[0].description, "Fictional small-room reverb metadata.");
  assert.equal(context.catalog().background_noises.length, 1);
  await runner.run(scenarios.emptyAudioEffects);
  assert.deepEqual(context.catalog(), empty.catalog());
  await runner.run(scenarios.reset);
  assert.equal(context.catalog().filter_presets.length, 2);
});

test("validated Dispatcher exposes deterministic effects catalog with empty/reset and isolated instances", async () => {
  const harness = await createDispatcherHarness();
  const second = await createDispatcherHarness();
  const read = async () => {
    const response = await harness.request("/v1/audio-effects/catalog");
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type")!, /application\/json/);
    return response.json();
  };
  const catalog = await read();
  assert.deepEqual(catalog.filter_presets.map((item: { filter_preset_id: string }) => item.filter_preset_id), ["sim-filter-radio", "sim-filter-soft"]);
  assert.equal(catalog.filter_presets[1].description, null);
  assert.equal(catalog.environments[0].name, "Simulator room");
  assert.equal(catalog.background_noises[0].name, "Simulator rain");
  assert.deepEqual(await read(), catalog);
  await harness.scenario("emptyAudioEffects");
  assert.deepEqual(await read(), { filter_presets: [], environments: [], background_noises: [] });
  const isolated = await second.request("/v1/audio-effects/catalog");
  assert.equal(isolated.status, 200);
  assert.deepEqual(await isolated.json(), catalog);
  assert.equal((await harness.request("/v1/voices/sim-narrator")).status, 200);
  await harness.scenario("reset");
  assert.deepEqual(await read(), catalog);
});
