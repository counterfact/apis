import assert from "node:assert/strict";
import test from "node:test";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import { createScenarioRunner } from "../test-support/scenarios.js";
import * as scenarios from "../api/scenarios/index.js";
const path = "/v1/convai/settings";
const webhook = { url: "https://example.invalid/init", request_headers: { Token: { secret_id: "synthetic" }, Environment: { env_var_label: "token" } } };
const charts = [{ name: "Success", type: "call_success" as const }, { name: "Quality", type: "criteria" as const, criteria_id: "quality" }, { name: "Topic", type: "data_collection" as const, data_collection_id: "topic" }];
const invalidSettings = [null, [], { rag_retention_period_days: 0 }, { rag_retention_period_days: 31 }, { rag_retention_period_days: 1.5 }, { conversation_embedding_retention_days: 366 }, { can_use_mcp_servers: null }, { default_livekit_stack: "other" }, { webhooks: null }, { webhooks: { events: ["other"] } }, { webhooks: { exclude_transcript: "false" } }, { conversation_initiation_client_data_webhook: { url: "partial" } }, { conversation_initiation_client_data_webhook: { url: "x", request_headers: { X: 3 } } }, { rag_retention_period_days: 5, extra: true }];
const invalidDashboards = [null, [], { charts: null }, { charts: [...charts, ...charts] }, { charts: [{ type: "criteria", name: "missing id" }] }, { charts: [{ type: "other", name: "invalid" }] }, { extra: true }];

test("settings Context validates atomic partial changes and returns defensive copies", async () => {
  const { Context } = await import("../api/routes/convai/settings/_.context.js");
  const context = new Context();
  assert.deepEqual(context.getSettings(), {});
  assert.deepEqual(context.getDashboard(), {});
  const input = { conversation_initiation_client_data_webhook: structuredClone(webhook), webhooks: { post_call_webhook_id: "local", events: ["audio"], send_audio: true }, can_use_mcp_servers: true, rag_retention_period_days: 20, conversation_embedding_retention_days: 90, default_livekit_stack: "static" };
  assert.ok(context.updateSettings(input).value);
  input.conversation_initiation_client_data_webhook.request_headers.Token.secret_id = "changed";
  input.webhooks.events.push("audio");
  assert.deepEqual(context.getSettings().conversation_initiation_client_data_webhook, webhook);
  const updated = context.updateSettings({ webhooks: { transcript_format: "json" } }).value!;
  updated.webhooks!.events!.push("audio");
  context.getSettings().webhooks!.events!.push("audio");
  assert.deepEqual(context.getSettings().webhooks!.events, ["audio"]);
  assert.ok(context.updateSettings({ webhooks: { exclude_transcript: true, events: [], send_audio: null, post_call_webhook_id: null }, can_use_mcp_servers: false }).value);
  assert.deepEqual(context.getSettings().webhooks, { post_call_webhook_id: null, events: [], send_audio: null, exclude_transcript: true, transcript_format: "json" });
  assert.equal(context.getSettings().rag_retention_period_days, 20);
  assert.ok(context.updateSettings({ conversation_initiation_client_data_webhook: { url: "replacement", request_headers: {} } }).value);
  assert.deepEqual(context.getSettings().conversation_initiation_client_data_webhook, { url: "replacement", request_headers: {} });
  assert.ok(context.updateSettings({ conversation_initiation_client_data_webhook: null, conversation_embedding_retention_days: null }).value);
  const before = context.getSettings();
  assert.equal(before.conversation_initiation_client_data_webhook, null);
  assert.equal(before.conversation_embedding_retention_days, null);
  for (const body of invalidSettings) {
    assert.equal(context.updateSettings(body).error, "invalid_settings");
    assert.deepEqual(context.getSettings(), before);
  }
  assert.deepEqual(context.updateSettings({}).value, before);
  assert.deepEqual(context.updateSettings({ webhooks: {} }).value, before);
  const dashboardInput = { charts: structuredClone(charts) };
  assert.ok(context.updateDashboard(dashboardInput).value);
  dashboardInput.charts.pop();
  context.getDashboard().charts!.pop();
  assert.deepEqual(context.getDashboard(), { charts });
  for (const body of invalidDashboards) {
    assert.equal(context.updateDashboard(body).error, "invalid_settings");
    assert.deepEqual(context.getDashboard(), { charts });
  }
  assert.deepEqual(context.updateDashboard({ charts: [...charts, { name: "Fourth", type: "call_success" }] }).value!.charts!.length, 4);
  assert.deepEqual(context.updateDashboard({ charts }).value, { charts });
  assert.deepEqual(context.updateDashboard({}).value, { charts });
  assert.deepEqual(context.updateDashboard({ charts: [] }).value, { charts: [] });
  assert.deepEqual(context.getSettings(), before);
});

test("settings Dispatcher persists independent sections, rejects malformed changes, resets and isolates", async () => {
  const app = await createDispatcherHarness();
  const second = await createDispatcherHarness();
  const read = async (url = path) => {
    const response = await app.request(url);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type")!, /application\/json/);
    return response.json();
  };
  const patch = (body: unknown, url = path) => app.request(url, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const baseline = await read();
  const dashboardBaseline = await read(path + "/dashboard");
  assert.equal(baseline.rag_retention_period_days, 10);
  assert.deepEqual(dashboardBaseline, { charts: [{ name: "Call success", type: "call_success" }] });
  let response = await patch({ can_use_mcp_servers: true, rag_retention_period_days: 30, webhooks: { events: ["audio"], transcript_format: "opentelemetry" }, conversation_initiation_client_data_webhook: webhook });
  assert.equal(response.status, 200);
  const changed = await response.json();
  assert.deepEqual(await read(), changed);
  assert.equal(changed.can_use_mcp_servers, true);
  assert.deepEqual(changed.conversation_initiation_client_data_webhook, webhook);
  assert.deepEqual(await read(path + "/dashboard"), dashboardBaseline);
  response = await patch({ charts }, path + "/dashboard");
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { charts });
  assert.deepEqual(await read(path + "/dashboard"), { charts });
  response = await patch({ webhooks: { events: [], send_audio: null }, conversation_initiation_client_data_webhook: null, conversation_embedding_retention_days: null, can_use_mcp_servers: false });
  assert.equal(response.status, 200);
  const cleared = await response.json();
  assert.equal(cleared.can_use_mcp_servers, false);
  assert.equal(cleared.webhooks.transcript_format, "opentelemetry");
  assert.deepEqual(cleared.webhooks.events, []);
  assert.equal(cleared.conversation_initiation_client_data_webhook, null);
  assert.equal(cleared.conversation_embedding_retention_days, null);
  for (const body of invalidSettings) {
    assert.equal((await patch(body)).status, 400);
    assert.deepEqual(await read(), cleared);
  }
  for (const body of invalidDashboards) {
    assert.equal((await patch(body, path + "/dashboard")).status, 400);
    assert.deepEqual(await read(path + "/dashboard"), { charts });
  }
  assert.deepEqual(await (await patch({})).json(), cleared);
  assert.deepEqual(await (await patch({}, path + "/dashboard")).json(), { charts });
  assert.deepEqual(await (await patch({ charts: [] }, path + "/dashboard")).json(), { charts: [] });
  assert.deepEqual(await (await second.request(path)).json(), baseline);
  assert.deepEqual(await (await second.request(path + "/dashboard")).json(), dashboardBaseline);
  await app.scenario("alternateSettings");
  assert.equal((await read()).default_livekit_stack, "static");
  await app.scenario("reset");
  assert.deepEqual(await read(), baseline);
  assert.deepEqual(await read(path + "/dashboard"), dashboardBaseline);
  assert.equal((await (await app.request("/v1/convai/tags")).json()).conversation_tags.length, 1);
});

test("settings scenarios own baseline containers and alternate configuration", async () => {
  const runner = await createScenarioRunner();
  const context = runner.loadContext("/convai/settings");
  assert.deepEqual(context.getSettings(), {});
  assert.deepEqual(context.getDashboard(), {});
  await runner.run(scenarios.startup);
  const baseline = context.getSettings();
  const dashboardBaseline = context.getDashboard();
  await runner.run(scenarios.alternateSettings);
  assert.equal(context.getSettings().default_livekit_stack, "static");
  assert.deepEqual(context.getDashboard().charts, []);
  await runner.run(scenarios.reset);
  assert.deepEqual(context.getSettings(), baseline);
  assert.deepEqual(context.getDashboard(), dashboardBaseline);
});
