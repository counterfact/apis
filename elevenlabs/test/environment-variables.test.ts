import assert from "node:assert/strict";
import test from "node:test";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import { createScenarioRunner } from "../test-support/scenarios.js";
import * as scenarios from "../api/scenarios/index.js";
const path = "/v1/convai/environment-variables";
const inputs = [
  { type: "string", label: "url", values: { production: "https://example.invalid" } },
  { type: "secret", label: "key", values: { production: { secret_id: "sim-secret-ref" } } },
  { type: "auth_connection", label: "auth", values: { production: { auth_connection_id: "sim-auth-connection" } } },
];
test("environment variable Context typed atomic merges and defensive copies", async () => {
  const { Context } = await import("../api/routes/convai/environment-variables/_.context.js");
  const context = new Context();
  assert.equal(context.listVariables().value!.environment_variables.length, 0);
  for (const input of inputs) {
    const source = structuredClone(input);
    const result = context.createVariable(source);
    assert.ok(result.value);
    const id = result.value.id;
    source.values.production = "changed";
    result.value.values.production = "changed";
    assert.deepEqual(context.getVariable(id)!.values, input.values);
    const listed = context.listVariables().value!.environment_variables.at(-1)!;
    listed.values.production = "changed";
    assert.deepEqual(context.getVariable(id)!.values, input.values);
    const patch = { values: { staging: input.values.production } };
    assert.ok(context.updateVariable(id, patch).value);
    patch.values.staging = "changed";
    assert.deepEqual(context.getVariable(id)!.values.staging, input.values.production);
    const baseline = context.getVariable(id);
    assert.deepEqual(context.updateVariable(id, { values: {} }).value, baseline);
    for (const invalid of [null, {}, { values: null }, { values: { staging: null, production: null } }, { values: { staging: null, broken: input.type === "string" ? { secret_id: "x" } : "wrong" } }]) {
      assert.equal(context.updateVariable(id, invalid).error, "invalid_environment_variable");
      assert.deepEqual(context.getVariable(id), baseline);
    }
    assert.ok(context.updateVariable(id, { values: { staging: null } }).value);
    assert.equal(context.getVariable(id)!.values.staging, undefined);
    assert.equal(context.createVariable(input).error, "environment_variable_label_conflict");
  }
  for (const invalid of [null, {}, { ...inputs[0], label: "missing", values: {} }, { ...inputs[0], label: "wrong", values: { production: "" } }, { ...inputs[1], label: "mixed", values: { production: { auth_connection_id: "x" } } }]) assert.equal(context.createVariable(invalid).error, "invalid_environment_variable");
  assert.equal(context.nextVariableNumber, 3);
  assert.equal(context.updateVariable("missing", { values: {} }).error, "environment_variable_not_found");
  assert.equal(context.deleteVariable("missing"), false);
  for (const item of context.listVariables().value!.environment_variables) assert.equal(context.deleteVariable(item.id), true);
});
test("environment variable Dispatcher CRUD filtering pagination reset and isolation", async () => {
  const app = await createDispatcherHarness();
  const second = await createDispatcherHarness();
  const send = (method: string, body: unknown, suffix = "") => app.request(path + suffix, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const list = async (query = "") => {
    const response = await app.request(path + query);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type")!, /application\/json/);
    return response.json();
  };
  const baseline = await list();
  assert.equal(baseline.environment_variables[0].id, "sim-environment-variable");
  const ids: string[] = [];
  for (const [index, input] of inputs.entries()) {
    const response = await send("POST", input);
    assert.equal(response.status, 200);
    const created = await response.json();
    assert.equal(created.id, `sim-environment-variable-created-${index + 1}`);
    assert.deepEqual(created.values, input.values);
    assert.equal(created.created_at_unix_secs, 1_735_689_601 + index);
    assert.equal(created.updated_at_unix_secs, created.created_at_unix_secs);
    assert.equal(created.workspace_id, "sim-workspace");
    ids.push(created.id);
    assert.deepEqual(await (await app.request(path + "/" + created.id)).json(), created);
    const patched = await send("PATCH", { values: { test: input.values.production } }, "/" + created.id);
    assert.equal(patched.status, 200);
    const edited = await patched.json();
    assert.deepEqual(edited.values.test, input.values.production);
    assert.deepEqual(edited.values.production, input.values.production);
    assert.equal(edited.created_at_unix_secs, created.created_at_unix_secs);
    assert.equal(edited.updated_at_unix_secs, 1_735_689_900);
  }
  assert.equal((await send("POST", inputs[0])).status, 409);
  const after = await list();
  for (const input of [{}, { ...inputs[0], label: "bad", values: {} }, { ...inputs[1], label: "bad", values: { production: "wrong" } }]) assert.equal((await send("POST", input)).status, 400);
  for (const [index, id] of ids.entries()) {
    assert.equal((await send("PATCH", { values: { test: null, production: null } }, "/" + id)).status, 400);
    assert.equal((await send("PATCH", { values: { test: null, wrong: index === 0 ? { secret_id: "x" } : "wrong" } }, "/" + id)).status, 400);
  }
  assert.deepEqual(await list(), after);
  assert.equal((await list("?type=secret")).environment_variables.length, 1);
  assert.equal((await list("?label=url")).environment_variables[0].id, ids[0]);
  const filtered = await list("?environment=test");
  assert.equal(filtered.environment_variables.length, 3);
  assert.deepEqual(Object.keys(filtered.environment_variables[0].values), ["test"]);
  const page = await list("?page_size=2");
  assert.equal(page.has_more, true);
  assert.equal(page.next_cursor, "2");
  assert.equal((await list("?page_size=2&cursor=2")).has_more, false);
  assert.deepEqual((await list("?cursor=99")).environment_variables, []);
  for (const query of ["?page_size=0", "?page_size=101", "?cursor=bad", "?type=bad"]) assert.equal((await app.request(path + query)).status, 400);
  for (const id of ids) {
    assert.equal((await send("PATCH", { values: { test: null } }, "/" + id)).status, 200);
    assert.equal((await (await app.request(path + "/" + id)).json()).values.test, undefined);
    const response = await app.request(path + "/" + id, { method: "DELETE" });
    assert.equal(response.status, 204);
    assert.equal(await response.text(), "");
  }
  for (const method of ["GET", "PATCH", "DELETE"]) assert.equal((method === "PATCH" ? await send(method, { values: {} }, "/missing") : await app.request(path + "/missing", { method })).status, 404);
  assert.deepEqual(await list(), baseline);
  assert.deepEqual(await (await second.request(path)).json(), baseline);
  await app.scenario("emptyEnvironmentVariables");
  assert.equal((await list()).environment_variables.length, 0);
  assert.equal((await (await send("POST", inputs[0])).json()).id, ids[0]);
  await app.scenario("reset");
  assert.deepEqual(await list(), baseline);
  assert.equal((await (await send("POST", inputs[0])).json()).id, ids[0]);
  assert.equal((await (await app.request("/v1/workspace/auth-connections")).json()).auth_connections.length, 1);
});
test("environment variable scenarios own metadata and reset", async () => {
  const runner = await createScenarioRunner();
  const context = runner.loadContext("/convai/environment-variables");
  assert.equal(context.listVariables().value!.environment_variables.length, 0);
  await runner.run(scenarios.startup);
  const baseline = context.listVariables();
  context.createVariable(inputs[0]);
  await runner.run(scenarios.emptyEnvironmentVariables);
  assert.equal(context.listVariables().value!.environment_variables.length, 0);
  await runner.run(scenarios.reset);
  assert.deepEqual(context.listVariables(), baseline);
});
