import assert from "node:assert/strict";
import test from "node:test";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import * as scenarios from "../api/scenarios/index.js";
import { Context } from "../api/routes/convai/llm-usage/_.context.js";

test("local usage context calculates synthetic costs and resolves canonical defaults", async () => {
  const r = await createScenarioRunner();
  await r.run(scenarios.startup);
  const c = r.loadContext("/convai/llm-usage");
  assert.equal(new Context().rates.size, 0);
  const estimate = c.calculate({
    prompt_length: 400,
    number_of_pages: 3,
    rag_enabled: false,
  });
  assert.equal(estimate.llm_prices.length, 4);
  assert.deepEqual(estimate.llm_prices[0], {
    llm: "gemini-3.5-flash",
    price_per_message: 0.003356,
    price_per_minute: 0.010068,
  });
  assert.equal(
    c.calculate({ prompt_length: 400, number_of_pages: 3, rag_enabled: true })
      .llm_prices[0].price_per_message,
    0.002356,
  );
  const agent = r.loadContext("/convai/agents").getAgent("sim-agent")!;
  assert.deepEqual(
    c.forAgent("sim-agent", {}),
    c.calculate({
      prompt_length: agent.conversation_config.agent!.prompt!.prompt!.length,
      number_of_pages: 0,
      rag_enabled: false,
    }),
  );
  await r.run(scenarios.knowledgeBaseReferences);
  assert.deepEqual(
    c.forAgent("sim-agent", { prompt_length: 0, rag_enabled: false }),
    c.calculate({ prompt_length: 0, number_of_pages: 1, rag_enabled: false }),
  );
  for (const body of [
    { prompt_length: -1, number_of_pages: 0, rag_enabled: false },
    { prompt_length: 1, number_of_pages: 0.5, rag_enabled: false },
    {},
  ])
    assert.throws(() => c.calculate(body));
  assert.throws(() => c.forAgent("missing", {}));
  const altered = c.calculate({
    prompt_length: 0,
    number_of_pages: 0,
    rag_enabled: false,
  });
  altered.llm_prices[0].price_per_message = 999;
  assert.equal(
    c.calculate({ prompt_length: 0, number_of_pages: 0, rag_enabled: false })
      .llm_prices[0].price_per_message,
    0.000256,
  );
  const request = {
    prompt_length: 400,
    number_of_pages: 3,
    rag_enabled: false,
  };
  assert.deepEqual(
    c.calculate({ ...request, service_tier: "fast" }),
    c.calculate(request),
  );
  await r.run(scenarios.llmUsageFastTier);
  const standard = c.calculate(request),
    fast = c.calculate({ ...request, service_tier: "fast" });
  assert.equal(
    fast.llm_prices[2].price_per_message,
    standard.llm_prices[2].price_per_message * 2,
  );
  assert.equal(
    fast.llm_prices[0].price_per_message,
    standard.llm_prices[0].price_per_message,
  );
  assert.deepEqual(
    c.forAgent("sim-agent", { ...request, rag_enabled: null }),
    c.calculate({ ...request, rag_enabled: true, service_tier: "fast" }),
  );
  assert.deepEqual(
    c.forAgent("sim-agent", { ...request, service_tier: "standard" }),
    standard,
  );
  r
    .loadContext("/convai/agents")
    .agents.get(
      "sim-agent",
    )!.configuration.conversation_config.agent!.prompt!.prompt = "😀";
  assert.deepEqual(
    c.forAgent("sim-agent", { number_of_pages: 0 }),
    c.calculate({
      prompt_length: 1,
      number_of_pages: 0,
      rag_enabled: true,
      service_tier: "fast",
    }),
  );
  await r.run(scenarios.emptyLlmUsage);
  assert.throws(() => c.calculate(request), { code: "llm_rate_unavailable" });
  await r.run(scenarios.reset);
  assert.deepEqual(c.calculate(request), estimate);
  await r.run(scenarios.emptyLlmCatalog);
  assert.deepEqual(c.calculate(request), { llm_prices: [] });
});

test("validated Dispatcher exposes deterministic calculators without canonical mutations", async () => {
  const h = await createDispatcherHarness();
  const post = async (path: string, body: unknown, status = 200) => {
    const r = await h.request(path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    assert.equal(r.status, status);
    return r;
  };
  const global = "/v1/convai/llm-usage/calculate",
    agent = "/v1/convai/agent/sim-agent/llm-usage/calculate";
  const before = await (await h.request("/v1/convai/agents/sim-agent")).json();
  const body = { prompt_length: 400, number_of_pages: 3, rag_enabled: false };
  const value = await (await post(global, body)).json();
  assert.equal(value.llm_prices[0].price_per_message, 0.003356);
  assert.deepEqual(await (await post(agent, body)).json(), value);
  assert.equal((await (await post(agent, {})).json()).llm_prices.length, 4);
  await post(global, { ...body, prompt_length: -1 }, 400);
  await post(global, { ...body, rag_enabled: "yes" }, 400);
  await post(global, { ...body, service_tier: "invalid" }, 400);
  await post(agent, { prompt_length: 1.5 }, 400);
  await post(agent, { unsupported: true }, 400);
  await post("/v1/convai/agent/missing/llm-usage/calculate", {}, 404);
  assert.deepEqual(
    await (await h.request("/v1/convai/agents/sim-agent")).json(),
    before,
  );
  await h.scenario("knowledgeBaseReferences");
  const canonical = await (await post(agent, { prompt_length: 0 })).json();
  assert.deepEqual(
    canonical,
    await (
      await post(global, {
        prompt_length: 0,
        number_of_pages: 1,
        rag_enabled: false,
      })
    ).json(),
  );
  await h.scenario("llmUsageFastTier");
  assert.deepEqual(
    await (
      await post(agent, { ...body, rag_enabled: null, service_tier: null })
    ).json(),
    await (
      await post(global, { ...body, rag_enabled: true, service_tier: "fast" })
    ).json(),
  );
  await h.scenario("emptyLlmUsage");
  await post(global, body, 400);
  const other = await createDispatcherHarness();
  assert.equal(
    (
      await other.request(global, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      })
    ).status,
    200,
  );
  await h.scenario("reset");
  assert.deepEqual(await (await post(global, body)).json(), value);
  assert.equal(
    (await h.request("/v1/convai/agents/sim-agent", { method: "DELETE" }))
      .status,
    204,
  );
  await post(agent, {}, 404);
});
