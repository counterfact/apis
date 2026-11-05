import assert from "node:assert/strict";
import test from "node:test";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import { createScenarioRunner } from "../test-support/scenarios.js";
import * as scenarios from "../api/scenarios/index.js";
const base = "/v1/convai/mcp-servers";
test("MCP context empty state, copies, atomic updates and approval drift", async () => {
  const { Context } =
    await import("../api/routes/convai/mcp-servers/_.context.js");
  assert.equal(new Context().servers.size, 0);
  const runner = await createScenarioRunner();
  await runner.run(scenarios.startup);
  const c = runner.loadContext("/convai/mcp-servers");
  const created = c.create({
    config: { name: "Local", url: "https://example.invalid/mcp" },
  });
  created.config.name = "Changed";
  assert.equal(c.get(created.id).config.name, "Local");
  const before = c.get(created.id);
  assert.throws(() => c.patch(created.id, { response_timeout_secs: 4 }));
  assert.deepEqual(c.get(created.id), before);
  assert.throws(() =>
    c.create({ config: { name: "Bad", url: "http://example.invalid" } }),
  );
  c.patch("sim-mcp", { approval_policy: "require_approval_per_tool" });
  assert.equal(
    c.tools("sim-mcp").tool_approval_statuses[0].state,
    "not_approved",
  );
  c.approve("sim-mcp", {
    tool_name: "lookup",
    tool_description: "Look up a local record",
    input_schema: { type: "object", properties: {} },
  });
  assert.equal(
    c.tools("sim-mcp").tool_approval_statuses[0].state,
    "up_to_date",
  );
  c.discovered.get("sim-mcp")![0].description = "Changed definition";
  const drift = c.tools("sim-mcp").tool_approval_statuses[0];
  assert.equal(drift.state, "needs_review");
  assert.equal(
    drift.approved_definition?.description,
    "Look up a local record",
  );
  drift.approved_definition!.description = "Mutated copy";
  assert.equal(
    c.tools("sim-mcp").tool_approval_statuses[0].approved_definition
      ?.description,
    "Look up a local record",
  );
  c.createOverride("sim-mcp", {
    tool_name: "lookup",
    response_timeout_secs: 40,
  });
  assert.throws(() => c.createOverride("sim-mcp", { tool_name: "lookup" }));
  c.patchOverride("sim-mcp", "lookup", { response_timeout_secs: null });
  assert.equal(c.getOverride("sim-mcp", "lookup").response_timeout_secs, null);
  assert.throws(() => c.createOverride("sim-mcp", { tool_name: "missing" }));
  const oldOverride = c.getOverride("sim-mcp", "lookup");
  assert.throws(() =>
    c.patchOverride("sim-mcp", "lookup", { response_timeout_secs: 301 }),
  );
  assert.deepEqual(c.getOverride("sim-mcp", "lookup"), oldOverride);
  const beforeId = c.nextId;
  assert.throws(() =>
    c.create({
      config: {
        name: "Bad",
        url: "https://example.invalid",
        tool_config_overrides: [{ tool_name: "lookup" }],
      },
    }),
  );
  assert.equal(c.nextId, beforeId);
  assert.throws(() => c.tools("sim-mcp", "staging"));
  c.removeApproval("sim-mcp", "lookup");
  assert.equal(
    c.tools("sim-mcp").tool_approval_statuses[0].state,
    "not_approved",
  );
  c.delete(created.id);
  assert.throws(() => c.get(created.id));
  await runner.run(scenarios.mcpAgentReference);
  assert.equal(c.get("sim-mcp").dependent_agents?.[0].id, "sim-agent");
  const duplicate = runner
    .loadContext("/convai/agents")
    .duplicateAgent("sim-agent", {}).value!;
  assert.equal(c.get("sim-mcp").dependent_agents?.length, 2);
  assert.throws(() => c.delete("sim-mcp"));
  runner.loadContext("/convai/agents").agents.delete("sim-agent");
  assert.equal(c.get("sim-mcp").dependent_agents?.[0].id, duplicate.agent_id);
  runner.loadContext("/convai/agents").agents.delete(duplicate.agent_id);
  assert.deepEqual(c.get("sim-mcp").dependent_agents, []);
  await runner.run(scenarios.reset);
  assert.equal(c.servers.size, 1);
  assert.equal(c.nextId, 1);
});
test("MCP Dispatcher persists configuration, approvals, overrides and reset", async () => {
  const app = await createDispatcherHarness(),
    other = await createDispatcherHarness();
  const send = (p: string, method: string, body?: unknown) =>
    app.request(p, {
      method,
      ...(body === undefined
        ? {}
        : {
            headers: { "content-type": "application/json" },
            body: JSON.stringify(body),
          }),
    });
  const initial = await app.request(base);
  assert.equal(initial.status, 200);
  assert.equal((await initial.json()).mcp_servers.length, 1);
  const creation = await send(base, "POST", {
    config: {
      name: "New server",
      url: "https://example.invalid/new",
      request_meta: { local: true },
    },
  });
  assert.equal(creation.status, 200);
  const created = await creation.json();
  assert.equal(created.id, "sim-mcp-created-1");
  assert.equal(
    (await (await app.request(`${base}/${created.id}`)).json()).config.name,
    "New server",
  );
  const patch = await send(`${base}/${created.id}`, "PATCH", {
    response_timeout_secs: 60,
    request_meta: { count: 2 },
  });
  assert.equal(patch.status, 200);
  assert.equal((await patch.json()).config.response_timeout_secs, 60);
  assert.equal(
    (
      await send(`${base}/sim-mcp/approval-policy`, "PATCH", {
        approval_policy: "require_approval_per_tool",
      })
    ).status,
    200,
  );
  const tools = await app.request(`${base}/sim-mcp/tools`);
  assert.equal(tools.status, 200);
  assert.equal((await tools.json()).tools[0].name, "lookup");
  assert.equal(
    (
      await send(`${base}/sim-mcp/tool-approvals`, "POST", {
        tool_name: "lookup",
        tool_description: "Look up a local record",
        input_schema: { type: "object", properties: {} },
        approval_policy: "auto_approved",
      })
    ).status,
    200,
  );
  assert.equal(
    (await (await app.request(`${base}/sim-mcp/tools`)).json())
      .tool_approval_statuses[0].state,
    "up_to_date",
  );
  await app.scenario("mcpDefinitionChanged", "api");
  const drift = await (await app.request(`${base}/sim-mcp/tools`)).json();
  assert.equal(drift.tool_approval_statuses[0].state, "needs_review");
  assert.equal(
    drift.tool_approval_statuses[0].approved_definition.description,
    "Look up a local record",
  );
  const override = {
    tool_name: "lookup",
    response_timeout_secs: 45,
    input_overrides: { value: { source: "constant", constant_value: "local" } },
  };
  assert.equal(
    (await send(`${base}/sim-mcp/tool-configs`, "POST", override)).status,
    200,
  );
  const detail = await app.request(`${base}/sim-mcp/tool-configs/lookup`);
  assert.equal(detail.status, 200);
  assert.equal((await detail.json()).response_timeout_secs, 45);
  assert.equal(
    (await send(`${base}/sim-mcp/tool-configs`, "POST", override)).status,
    409,
  );
  const updated = await send(`${base}/sim-mcp/tool-configs/lookup`, "PATCH", {
    response_timeout_secs: null,
    assignments: null,
  });
  assert.equal(updated.status, 200);
  assert.equal(
    (await (await app.request(`${base}/sim-mcp/tool-configs/lookup`)).json())
      .response_timeout_secs,
    null,
  );
  assert.equal(
    (await send(`${base}/sim-mcp/tool-configs/lookup`, "DELETE")).status,
    200,
  );
  assert.equal(
    (await app.request(`${base}/sim-mcp/tool-configs/lookup`)).status,
    404,
  );
  assert.equal(
    (await send(`${base}/sim-mcp/tool-approvals/lookup`, "DELETE")).status,
    200,
  );
  await app.scenario("mcpAgentReference", "api");
  assert.equal((await send(`${base}/sim-mcp`, "DELETE")).status, 409);
  assert.equal(
    (await (await app.request(`${base}/sim-mcp`)).json()).dependent_agents[0]
      .id,
    "sim-agent",
  );
  assert.equal(
    (await app.request("/v1/convai/agents/sim-agent", { method: "DELETE" }))
      .status,
    204,
  );
  assert.equal(
    (await (await app.request(`${base}/sim-mcp`)).json()).dependent_agents
      .length,
    0,
  );
  for (const [p, method, body, status] of [
    [`${base}/missing`, "GET", undefined, 404],
    [
      base,
      "POST",
      { config: { name: "Bad", url: "http://example.invalid" } },
      400,
    ],
    [`${base}/${created.id}`, "PATCH", { response_timeout_secs: 3 }, 400],
    [`${base}/sim-mcp/tool-configs`, "POST", { tool_name: "missing" }, 404],
    [`${base}/sim-mcp/tools?environment=staging`, "GET", undefined, 400],
  ] as const)
    assert.equal((await send(p, method, body)).status, status);
  assert.equal((await send(`${base}/${created.id}`, "DELETE")).status, 200);
  assert.equal((await app.request(`${base}/${created.id}`)).status, 404);
  assert.equal(
    (await (await other.request(base)).json()).mcp_servers.length,
    1,
  );
  await app.scenario("emptyMcpServers", "api");
  assert.equal((await (await app.request(base)).json()).mcp_servers.length, 0);
  await app.scenario("reset", "api");
  assert.equal((await (await app.request(base)).json()).mcp_servers.length, 1);
});
