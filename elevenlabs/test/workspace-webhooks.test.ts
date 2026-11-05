import assert from "node:assert/strict";
import test from "node:test";
import { Context } from "../api/routes/workspace/webhooks/_.context.js";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import * as scenarios from "../api/scenarios/index.js";

const path = "/v1/workspace/webhooks";
const input = { settings: { auth_type: "hmac" as const, name: "Test", webhook_url: "https://example.invalid/hook", request_headers: { Authorization: "synthetic-token" } } };

test("webhook context owns configuration transitions and returns isolated public projections", () => {
  const context = new Context();
  assert.deepEqual(context.listWebhooks(), { webhooks: [] });
  context.creationTimeUnix = 1735689600;
  const body = structuredClone(input);
  const created = context.createWebhook(body);
  assert.deepEqual(created, { webhook_id: "sim-webhook-created-1", webhook_secret: "sim-webhook-secret-1" });
  body.settings.request_headers.Authorization = "changed";
  const stored = context.webhooks.get(created.webhook_id)!;
  assert.equal(stored.request_headers!.Authorization, "synthetic-token");
  const patch = { name: "Renamed", is_disabled: true, events: ["flows" as const], request_headers: { X: "test" }, retry_enabled: true };
  assert.deepEqual(context.updateWebhook(created.webhook_id, patch), { status: "ok" });
  patch.events.push("flows");
  patch.request_headers.X = "changed";
  assert.deepEqual(stored.events, ["flows"]);
  assert.deepEqual(stored.request_headers, { X: "test" });
  assert.equal(stored.retry_enabled, true);
  const item = context.listWebhooks(true).webhooks[0];
  assert.deepEqual(item, { name: "Renamed", webhook_id: created.webhook_id, webhook_url: input.settings.webhook_url,
    is_disabled: true, is_auto_disabled: false, created_at_unix: 1735689601, auth_type: "hmac", usage: [], events: ["flows"],
    most_recent_failure_error_code: null, most_recent_failure_timestamp: null });
  item.events!.push("agent_qa");
  item.usage!.push({ usage_type: "ConvAI Settings" });
  assert.deepEqual(context.listWebhooks(true).webhooks[0].events, ["flows"]);
  assert.deepEqual(context.listWebhooks(true).webhooks[0].usage, []);
  assert.equal("events" in context.listWebhooks().webhooks[0], false);
  assert.equal("usage" in context.listWebhooks().webhooks[0], false);
  context.updateWebhook(created.webhook_id, { name: "Final", is_disabled: false, events: null, request_headers: null, retry_enabled: null });
  assert.deepEqual(stored.events, ["flows"]);
  assert.deepEqual(stored.request_headers, { X: "test" });
  assert.equal(stored.retry_enabled, true);
  context.updateWebhook(created.webhook_id, { name: "Final", is_disabled: false, events: [], request_headers: {}, retry_enabled: false });
  assert.deepEqual(stored.events, []);
  assert.deepEqual(stored.request_headers, {});
  assert.equal(stored.retry_enabled, false);
  assert.equal(context.updateWebhook("missing", { name: "X", is_disabled: true }), undefined);
  assert.equal(context.deleteWebhook("missing"), undefined);
  assert.deepEqual(context.deleteWebhook(created.webhook_id), { status: "ok" });
  assert.deepEqual(context.listWebhooks(), { webhooks: [] });
  assert.equal(context.createWebhook(input).webhook_id, "sim-webhook-created-2");
});

test("webhook scenarios own fixtures, counters and independent context reset", async () => {
  const runner = await createScenarioRunner();
  const context = runner.loadContext("/workspace/webhooks");
  assert.deepEqual(context.listWebhooks(), { webhooks: [] });
  await runner.run(scenarios.startup);
  const baseline = context.listWebhooks(true);
  assert.equal(baseline.webhooks[0].webhook_id, "sim-webhook");
  context.createWebhook(input);
  await runner.run(scenarios.emptyWebhooks);
  assert.deepEqual(context.listWebhooks(), { webhooks: [] });
  assert.equal(context.createWebhook(input).webhook_id, "sim-webhook-created-1");
  await runner.run(scenarios.reset);
  assert.deepEqual(context.listWebhooks(true), baseline);
  assert.equal(context.createWebhook(input).webhook_id, "sim-webhook-created-1");
});

test("workspace webhook Dispatcher CRUD validates requests, projects metadata and isolates/reset state", async () => {
  const first = await createDispatcherHarness();
  const second = await createDispatcherHarness();
  const send = (method: string, body: unknown, suffix = "") => first.request(path + suffix, {
    method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  const list = async (query = "") => {
    const response = await first.request(path + query);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type")!, /application\/json/);
    return response.json();
  };
  const baseline = await list("?include_usages=true");
  assert.equal(baseline.webhooks.length, 1);
  assert.equal("events" in (await list()).webhooks[0], false);
  assert.equal("usage" in (await list("?include_usages=false")).webhooks[0], false);
  for (const body of [{}, { settings: { ...input.settings, auth_type: "oauth2" } },
    { settings: { ...input.settings, request_headers: { X: 2 } } }]) {
    assert.equal((await send("POST", body)).status, 400);
  }
  assert.deepEqual(await list("?include_usages=true"), baseline);
  const response = await send("POST", input);
  assert.equal(response.status, 200);
  const created = await response.json();
  assert.deepEqual(created, { webhook_id: "sim-webhook-created-1", webhook_secret: "sim-webhook-secret-1" });
  const suffix = `/${created.webhook_id}`;
  const patch = { name: "Edited", is_disabled: true, events: ["speech_to_text", "flows"], retry_enabled: true, request_headers: { X: "new" } };
  assert.equal((await send("PATCH", patch, suffix)).status, 200);
  assert.deepEqual(await (await send("PATCH", patch, suffix)).json(), { status: "ok" });
  const after = await list("?include_usages=true");
  const edited = after.webhooks.find((value: { webhook_id: string }) => value.webhook_id === created.webhook_id);
  assert.equal(edited.name, "Edited");
  assert.equal(edited.is_disabled, true);
  assert.deepEqual(edited.events, ["speech_to_text", "flows"]);
  for (const key of ["webhook_secret", "request_headers", "retry_enabled"]) assert.equal(key in edited, false);
  for (const body of [{}, { name: "X" }, { ...patch, is_disabled: "yes" }, { ...patch, events: ["invalid"] }, { ...patch, request_headers: { X: 5 } }]) {
    assert.equal((await send("PATCH", body, suffix)).status, 400);
  }
  assert.deepEqual(await list("?include_usages=true"), after);
  for (const method of ["PATCH", "DELETE"]) {
    const missing = method === "PATCH" ? await send(method, patch, "/missing") : await first.request(path + "/missing", { method });
    assert.equal(missing.status, 404);
    assert.equal((await missing.json()).detail.status, "webhook_not_found");
  }
  assert.deepEqual(await list("?include_usages=true"), after);
  assert.equal((await send("PATCH", { name: "Enabled", is_disabled: false, events: [] }, suffix)).status, 200);
  assert.deepEqual((await list("?include_usages=true")).webhooks[1].events, []);
  const removed = await first.request(path + suffix, { method: "DELETE" });
  assert.equal(removed.status, 200);
  assert.deepEqual(await removed.json(), { status: "ok" });
  assert.equal((await first.request(path + suffix, { method: "DELETE" })).status, 404);
  assert.deepEqual(await list("?include_usages=true"), baseline);
  assert.deepEqual(await (await second.request(path + "?include_usages=true")).json(), baseline);
  await first.scenario("emptyWebhooks");
  assert.deepEqual(await list(), { webhooks: [] });
  assert.equal((await (await send("POST", input)).json()).webhook_id, "sim-webhook-created-1");
  await first.scenario("reset");
  assert.deepEqual(await list("?include_usages=true"), baseline);
  assert.equal((await (await send("POST", input)).json()).webhook_id, "sim-webhook-created-1");
  assert.equal((await (await first.request("/v1/voices")).json()).voices.length, 2);
});
