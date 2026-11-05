import assert from "node:assert/strict";
import test from "node:test";
import { createScenarioRunner } from "../test-support/scenarios.js";
import * as scenarios from "../api/scenarios/index.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
const client = { tool_config: { type: "client" as const, name: "show_card", description: "Show a synthetic card." } };
const webhook = { tool_config: { type: "webhook" as const, name: "lookup", description: "Synthetic lookup configuration only.", api_schema: { url: "https://example.invalid/lookup" } } };
const invalid = [{}, { tool_config: { ...client.tool_config, name: " " } }, { tool_config: { ...client.tool_config, response_timeout_secs: -1 } }, { tool_config: { ...webhook.tool_config, api_schema: { url: "bad" } } }];
const unsupported = [{ ...client, response_mocks: [{ response: "mock" }] }, { tool_config: { type: "system", name: "transfer", description: "x", params: {} } }, { tool_config: { ...client.tool_config, assignments: [{ dynamic_variable: "x", value_path: "x" }] } }];

test("tool context owns defaults/copies, stable identity/history and atomic writes with reset counters", async () => {
  const r = await createScenarioRunner();
  await r.run(scenarios.startup);
  const c = r.loadContext("/convai/tools");
  const request = structuredClone(client);
  const created = c.createTool(request).value!;
  assert.equal(created.id, "sim-tool-1");
  assert.equal(created.tool_config.response_timeout_secs, 20);
  assert.equal(created.tool_config.type === "client" && created.tool_config.expects_response, false);
  assert.deepEqual(created.usage_stats, { total_calls: 0, avg_latency_secs: 0 });
  request.tool_config.name = "input external";
  created.tool_config.name = "output external";
  assert.equal(c.getTool("sim-tool-1")!.tool_config.name, "show_card");
  const metadata = structuredClone(c.tools.get("sim-tool")!);
  const updated = c.updateTool("sim-tool", webhook).value!;
  assert.equal(updated.id, "sim-tool");
  assert.equal(updated.tool_config.type === "webhook" && updated.tool_config.api_schema.method, "GET");
  assert.deepEqual(updated.usage_stats, metadata.configuration.usage_stats);
  assert.deepEqual(updated.access_info, metadata.configuration.access_info);
  assert.equal(c.tools.get("sim-tool")!.createdAt, metadata.createdAt);
  assert.equal(c.executions.length, 2);
  const before = structuredClone([...c.tools]);
  for (const body of invalid) for (const result of [c.createTool(body as never), c.updateTool("sim-tool", body as never)]) assert.equal(result.error, "invalid_tool_config");
  for (const body of unsupported) for (const result of [c.createTool(body as never), c.updateTool("sim-tool", body as never)]) assert.equal(result.error, "unsupported_tool_config");
  assert.deepEqual([...c.tools], before);
  assert.equal(c.updateTool("missing", client).error, "tool_not_found");
  assert.equal(c.createTool(client).value!.id, "sim-tool-2");
  await r.run(scenarios.reset);
  assert.equal(c.createTool(client).value!.id, "sim-tool-1");
});

test("tool Dispatcher creates and replaces config with live discovery, preserved references/history and reset", async () => {
  const app = await createDispatcherHarness();
  const send = (url: string, method: string, body: unknown) => app.request(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const read = async (url: string) => { const r = await app.request(url); assert.equal(r.status, 200); return r.json(); };
  const response = await send("/v1/convai/tools", "POST", client);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type")!, /application\/json/);
  const created = await response.json();
  assert.equal(created.id, "sim-tool-1");
  assert.equal(created.tool_config.expects_response, false);
  assert.deepEqual((await read("/v1/convai/tools?search=show_card")).tools, [created]);
  await app.scenario("toolDiscovery");
  const update = await send("/v1/convai/tools/sim-tool", "PATCH", webhook);
  assert.equal(update.status, 200);
  const updated = await update.json();
  assert.equal(updated.id, "sim-tool");
  assert.equal(updated.tool_config.api_schema.method, "GET");
  assert.equal(updated.tool_config.follow_redirects, false);
  assert.equal(updated.usage_stats.total_calls, 2);
  assert.deepEqual(await read("/v1/convai/tools/sim-tool"), updated);
  assert.equal((await read("/v1/convai/tools?used_by_agent_id=sim-agent")).tools[0].tool_config.name, "lookup");
  assert.equal((await read("/v1/convai/tools/sim-tool/dependent-agents")).agents[0].id, "sim-agent");
  assert.equal((await read("/v1/convai/tools/sim-tool/executions")).executions.length, 2);
  assert.equal((await app.request("/v1/convai/tools/sim-tool", { method: "DELETE" })).status, 409);
  const clientAgain = await send("/v1/convai/tools/sim-tool", "PATCH", client);
  assert.equal(clientAgain.status, 200);
  assert.equal((await clientAgain.json()).tool_config.api_schema, undefined);
  const before = await read("/v1/convai/tools");
  for (const body of [...invalid, unsupported[2], { tool_config: { ...client.tool_config, name: 42 } }]) {
    for (const [url, method] of [["/v1/convai/tools", "POST"], ["/v1/convai/tools/sim-tool", "PATCH"]]) assert.equal((await send(url, method, body)).status, 400);
  }
  assert.equal((await send("/v1/convai/tools/missing", "PATCH", client)).status, 404);
  assert.deepEqual(await read("/v1/convai/tools"), before);
  await app.scenario("reset");
  assert.equal((await app.request("/v1/convai/tools/sim-tool-1")).status, 404);
  assert.equal((await (await send("/v1/convai/tools", "POST", webhook)).json()).id, "sim-tool-1");
});


test("tool configuration stores bounded literal schemas and validates timeout edges without consuming IDs", async () => {
  const r = await createScenarioRunner();
  await r.run(scenarios.startup);
  const c = r.loadContext("/convai/tools");
  const parameters = { type: "object" as const, properties: { topic: { type: "string" as const, description: "Topic", enum: ["help"] } }, required: ["topic"] };
  const configured = c.createTool({ tool_config: { ...client.tool_config, expects_response: true, response_timeout_secs: -1, parameters } }).value!;
  assert.equal(configured.tool_config.response_timeout_secs, -1);
  assert.deepEqual(configured.tool_config.type === "client" && configured.tool_config.parameters, parameters);
  parameters.required.push("external");
  const stored = c.getTool(configured.id)!.tool_config;
  assert.deepEqual(stored.type === "client" && stored.parameters?.required, ["topic"]);
  const hook = c.createTool({ tool_config: { ...webhook.tool_config, response_timeout_secs: 300, api_schema: { ...webhook.tool_config.api_schema, method: "POST", request_headers: { "X-Synthetic": "yes" }, request_body_schema: { type: "object", properties: { message: { type: "string" } } } } } }).value!;
  assert.equal(hook.tool_config.type === "webhook" && hook.tool_config.api_schema.method, "POST");
  assert.equal(hook.tool_config.type === "webhook" && hook.tool_config.api_schema.content_type, "application/json");
  for (const timeout of [0, 121, NaN]) assert.equal(c.createTool({ tool_config: { ...client.tool_config, response_timeout_secs: timeout } }).error, "invalid_tool_config");
  for (const timeout of [4, 301]) assert.equal(c.createTool({ tool_config: { ...webhook.tool_config, response_timeout_secs: timeout } }).error, "invalid_tool_config");
  assert.equal(c.createTool(client).value!.id, "sim-tool-3");
});
