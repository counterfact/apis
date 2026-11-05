import assert from "node:assert/strict";
import test from "node:test";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import { createScenarioRunner } from "../test-support/scenarios.js";
import * as scenarios from "../api/scenarios/index.js";

const ids = ["gemini-3.5-flash", "gemini-2.5-flash", "gpt-4o", "gpt-4o-mini"];
const path = "/v1/convai/llm/list";

test("LLM context starts empty, isolates nested catalog data and restores scenario state", async () => {
  const { Context } = await import("../api/routes/convai/llm/_.context.js");
  const empty = new Context();
  assert.equal(empty.models.size, 0);
  assert.equal(empty.deprecationConfig, null);
  const runner = await createScenarioRunner();
  await runner.run(scenarios.startup);
  const context = runner.loadContext("/convai/llm");
  const catalog = context.listModels();
  assert.deepEqual(catalog.llms.map(model => model.llm), ids);
  catalog.llms[0].available_service_tiers.push("fast");
  catalog.llms[3].deprecation_info!.replacement_model = "gpt-4";
  catalog.default_deprecation_config.warning_start_days = 999;
  assert.deepEqual(context.listModels().llms[0].available_service_tiers, ["standard"]);
  assert.equal(context.listModels().llms[3].deprecation_info!.replacement_model, "gpt-4o");
  assert.equal(context.listModels().default_deprecation_config.warning_start_days, 30);
  await runner.run(scenarios.emptyLlmCatalog);
  assert.deepEqual(context.listModels().llms, []);
  await runner.run(scenarios.reset);
  assert.deepEqual(context.listModels().llms.map(model => model.llm), ids);
});

test("Dispatcher LLM catalog is deterministic, agrees with agent fixture and reflects empty/reset scenarios", async () => {
  const app = await createDispatcherHarness();
  const second = await createDispatcherHarness();
  const get = async () => {
    const response = await app.request(path);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type")!, /application\/json/);
    return response.json();
  };
  const catalog = await get();
  assert.deepEqual(catalog.llms.map((model: { llm: string }) => model.llm), ids);
  assert.deepEqual(await get(), catalog);
  assert.equal(catalog.llms[0].supports_image_input, false);
  assert.equal(catalog.llms[3].deprecation_info.replacement_model, "gpt-4o");
  const agentResponse = await app.request("/v1/convai/agents/sim-agent");
  assert.equal(agentResponse.status, 200);
  const agent = await agentResponse.json();
  assert.ok(ids.includes(agent.conversation_config.agent.prompt.llm));
  await app.scenario("emptyLlmCatalog", "api");
  const empty = await get();
  assert.deepEqual(empty.llms, []);
  assert.deepEqual(empty.default_deprecation_config, catalog.default_deprecation_config);
  const isolated = await second.request(path);
  assert.equal(isolated.status, 200);
  assert.deepEqual(await isolated.json(), catalog);
  await app.scenario("reset", "api");
  assert.deepEqual(await get(), catalog);
});
