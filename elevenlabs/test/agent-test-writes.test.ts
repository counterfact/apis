import assert from "node:assert/strict";
import test from "node:test";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import * as scenarios from "../api/scenarios/index.js";

const base = "/v1/convai/agent-testing";
const tool = {
  name: "No lookup call",
  type: "tool" as const,
  tool_call_parameters: {
    referenced_tool: { id: "sim-tool", type: "client" as const },
    verify_absence: true,
    parameters: [{ path: "topic", eval: { type: "anything" as const } }],
  },
  check_any_tool_matches: true,
};
const integrationCall = {
  request_id: "synthetic-request", tool_name: "lookup", params_as_json: "{}", tool_has_been_called: true,
  tool_details: { type: "api_integration_webhook" as const, webhook_details: { method: "GET", url: "https://example.invalid" } },
};
const integrationResult = {
  request_id: "synthetic-request", tool_name: "lookup", result_value: "{}", is_error: false,
  tool_has_been_called: true, type: "api_integration_webhook" as const,
};
const nestedTurn = {
  role: "agent" as const, time_in_call_secs: 1, tool_calls: [integrationCall],
  tool_results: [{
    ...integrationResult, type: "workflow" as const,
    result: { steps: [{ type: "nested_tools" as const, node_id: "synthetic-node", step_latency_secs: 0, is_successful: true, requests: [integrationCall], results: [integrationResult] }] },
  }],
};

test("agent test definitions normalize nested transcript input defaults and isolate metadata copies", async () => {
  const runner = await createScenarioRunner();
  await runner.run(scenarios.startup);
  const c = runner.loadContext("/convai/agent-testing");
  const body = { name: "Historical tool input", chat_history: [structuredClone(nestedTurn)], from_conversation_metadata: { conversation_id: "synthetic-conversation", agent_id: "sim-agent", original_agent_reply: [structuredClone(nestedTurn)] } };
  const { id } = c.create(body);
  const definition = c.get(id);
  const call = definition.chat_history![0].tool_calls![0];
  assert.equal(call.tool_details?.type === "api_integration_webhook" && call.tool_details.integration_id, "");
  const workflow = definition.chat_history![0].tool_results![0];
  assert.equal(workflow.type, "workflow");
  if (workflow.type !== "workflow") return assert.fail("Expected workflow result");
  const step = workflow.result!.steps![0];
  assert.equal(step.type, "nested_tools");
  if (step.type !== "nested_tools") return assert.fail("Expected nested tool step");
  assert.equal(step.results[0].type === "api_integration_webhook" && step.results[0].integration_id, "");
  assert.equal(step.results[0].tool_latency_secs, 0);
  assert.deepEqual(step.results[0].dynamic_variable_updates, []);
  assert.deepEqual(definition.from_conversation_metadata!.original_agent_reply, definition.chat_history);
  body.from_conversation_metadata.original_agent_reply[0].tool_calls[0].tool_name = "External mutation";
  call.tool_name = "Output mutation";
  assert.equal(c.get(id).chat_history![0].tool_calls![0].tool_name, "lookup");
  const app = await createDispatcherHarness();
  const response = await app.request(`${base}/sim-test-llm`, {
    method: "PUT", headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: "Nested transcript", chat_history: [nestedTurn] }),
  });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).chat_history[0].tool_calls[0].tool_details.integration_id, "");
});

test("agent test PUT Dispatcher replaces the seeded definition", async () => {
  const app = await createDispatcherHarness();
  const response = await app.request(`${base}/sim-test-llm`, {
    method: "PUT", headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: "Renamed greeting" }),
  });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).name, "Renamed greeting");
  assert.equal((await (await app.request(`${base}/sim-test-llm`)).json()).name, "Renamed greeting");
});

test("agent test write context replaces definitions, preserves identity and rejects mutations atomically", async () => {
  const runner = await createScenarioRunner();
  await runner.run(scenarios.startup);
  const c = runner.loadContext("/convai/agent-testing");
  const request = {
    name: "New response",
    parent_folder_id: "sim-test-folder",
    chat_history: [{ role: "user" as const, message: "Hello", time_in_call_secs: 0 }],
    dynamic_variables: { topic: "greeting" },
    success_examples: [{ response: "Hello", type: "success" as const }],
  };
  const created = c.create(request);
  assert.deepEqual(created, { id: "sim-test-created-1" });
  const detail = c.get(created.id);
  assert.equal(detail.type, "llm");
  assert.equal(detail.type === "llm" && detail.success_condition, "");
  request.chat_history[0].message = "External mutation";
  assert.equal(c.get(created.id).chat_history![0].message, "Hello");
  const metadata = structuredClone(c.tests.get(created.id)!);
  const replaced = c.update(created.id, tool);
  assert.equal(replaced.id, created.id);
  assert.equal(replaced.type, "tool");
  assert.equal("success_examples" in replaced, false);
  assert.deepEqual(replaced.chat_history, []);
  assert.deepEqual(replaced.access_info, metadata.access);
  assert.equal(c.tests.get(created.id)!.created, metadata.created);
  assert.equal(c.tests.get(created.id)!.creator, metadata.creator);
  assert.equal(c.tests.get(created.id)!.parent, null);
  assert.ok(c.tests.get(created.id)!.updated > metadata.updated);
  assert.equal(c.folder("sim-test-folder").children_count, 1);
  const before = structuredClone([...c.tests]);
  const counters = [c.nextId, c.nextMutation];
  for (const invalid of [
    { name: " " },
    { name: "Bad folder", parent_folder_id: "missing" },
    { name: "Bad type", type: "bad" },
    { name: "Mixed", type: "tool", success_condition: "ignored?" },
    { name: "Bad turns", type: "simulation", success_conditions: ["Help"], simulation_max_turns: 0 },
    { name: "No criterion", type: "simulation" },
  ]) {
    assert.throws(() => c.create(invalid as never));
    assert.throws(() => c.update(created.id, invalid as never));
  }
  assert.throws(() => c.update("missing", { name: "Missing" }));
  assert.deepEqual([...c.tests], before);
  assert.deepEqual([c.nextId, c.nextMutation], counters);
  assert.deepEqual(c.create({ name: "Default response" }), { id: "sim-test-created-2" });
  await runner.run(scenarios.reset);
  assert.equal(c.tests.size, 3);
  assert.deepEqual(c.create({ name: "After reset" }), { id: "sim-test-created-1" });
});

test("agent test write Dispatcher persists normal definitions and folder projections without executing tests", async () => {
  const app = await createDispatcherHarness();
  const send = (path: string, method: string, body: unknown) => app.request(path, {
    method, headers: { "content-type": "application/json" }, body: JSON.stringify(body),
  });
  const read = async (path: string) => {
    const response = await app.request(path);
    assert.equal(response.status, 200);
    return response.json();
  };
  const history = await read("/v1/convai/test-invocations/sim-test-invocation");
  const created = await send(`${base}/create`, "POST", { name: "Default response" });
  assert.equal(created.status, 200);
  assert.match(created.headers.get("content-type")!, /application\/json/);
  const { id } = await created.json();
  assert.equal(id, "sim-test-created-1");
  const initial = await read(`${base}/${id}`);
  assert.equal(initial.name, "Default response");
  assert.equal(initial.type, "llm");
  assert.equal(initial.success_condition, "");
  assert.deepEqual(initial.chat_history, []);
  const changed = await send(`${base}/${id}`, "PUT", {
    name: "Updated response", type: "llm", parent_folder_id: "sim-test-folder",
    success_condition: "Reply clearly", environment: "staging",
    chat_history: [{ role: "user", message: "Hello", time_in_call_secs: 0 }],
    success_examples: [{ response: "Hello", type: "success" }],
    failure_examples: [{ response: "Goodbye", type: "failure" }],
    dynamic_variables: { greeting: "Hello" },
  });
  assert.equal(changed.status, 200);
  const updated = await changed.json();
  assert.equal(updated.id, id);
  assert.equal(updated.success_condition, "Reply clearly");
  assert.deepEqual(updated.dynamic_variables, { greeting: "Hello" });
  assert.deepEqual(await read(`${base}/${id}`), updated);
  const summary = (await read(`${base}?parent_folder_id=sim-test-folder&types=llm`)).tests[0];
  assert.equal(summary.id, id);
  assert.equal(summary.name, "Updated response");
  assert.deepEqual(summary.folder_path, [{ id: "sim-test-folder", name: "Tool checks" }]);
  assert.ok(summary.last_updated_at_unix_secs > summary.created_at_unix_secs);
  assert.equal((await read(`${base}/folders/sim-test-folder`)).children_count, 2);
  const toolCreate = await send(`${base}/create`, "POST", tool);
  assert.equal(toolCreate.status, 200);
  const toolId = (await toolCreate.json()).id;
  assert.deepEqual((await read(`${base}/${toolId}`)).tool_call_parameters, tool.tool_call_parameters);
  const replaceTool = await send(`${base}/sim-test-tool`, "PUT", { ...tool, name: "New tool name" });
  assert.equal(replaceTool.status, 200);
  assert.equal((await replaceTool.json()).name, "New tool name");
  assert.equal((await read(`${base}/folders/sim-test-folder`)).children_count, 1);
  const simulation = await send(`${base}/create`, "POST", { name: "Support simulation", type: "simulation", success_conditions: ["Help the customer"] });
  assert.equal(simulation.status, 200);
  const simulationId = (await simulation.json()).id;
  const simulationDefinition = await read(`${base}/${simulationId}`);
  assert.equal(simulationDefinition.type, "simulation");
  assert.equal(simulationDefinition.simulation_max_turns, 5);
  assert.equal(simulationDefinition.evaluation_model, "claude-sonnet-4-6");
  const simulationUpdate = await send(`${base}/${simulationId}`, "PUT", { name: "Legacy criterion", type: "simulation", success_condition: "Offer a next step", simulation_max_turns: 1 });
  assert.equal(simulationUpdate.status, 200);
  assert.equal((await simulationUpdate.json()).success_condition, "Offer a next step");
  const before = await read(base);
  for (const body of [{}, { name: 4 }, { name: " " }, { name: "Missing folder", parent_folder_id: "missing" }, { name: "Invalid type", type: "bad" }]) {
    const expected = (body as { parent_folder_id?: string }).parent_folder_id ? 404 : 400;
    assert.equal((await send(`${base}/create`, "POST", body)).status, expected);
    assert.equal((await send(`${base}/${id}`, "PUT", body)).status, expected);
  }
  assert.equal((await send(`${base}/missing`, "PUT", { name: "Missing" })).status, 404);
  assert.deepEqual(await read(base), before);
  const replacement = await send(`${base}/sim-test-llm`, "PUT", { name: "Renamed greeting" });
  assert.equal(replacement.status, 200);
  assert.equal((await replacement.json()).success_condition, "");
  assert.deepEqual(await read("/v1/convai/test-invocations/sim-test-invocation"), history);
  assert.equal((await app.request(`${base}/sim-test-llm`, { method: "DELETE" })).status, 200);
  assert.deepEqual(await read("/v1/convai/test-invocations/sim-test-invocation"), history);
  assert.equal((await app.request(`${base}/folders/sim-test-folder?force=true`, { method: "DELETE" })).status, 204);
  assert.equal((await app.request(`${base}/${id}`)).status, 404);
  await app.scenario("reset");
  assert.equal((await app.request(`${base}/${toolId}`)).status, 404);
  assert.equal((await read(base)).tests.length, 4);
  assert.equal((await (await send(`${base}/create`, "POST", { name: "Reset" })).json()).id, "sim-test-created-1");
});
