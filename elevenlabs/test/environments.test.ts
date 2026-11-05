import assert from "node:assert/strict";
import test from "node:test";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import { createScenarioRunner } from "../test-support/scenarios.js";
import * as scenarios from "../api/scenarios/index.js";
const path = "/v1/convai/environments";
const variablePath = "/v1/convai/environment-variables";

test("environment Context validates atomically, orders production first, and cleans live variable maps", async () => {
  const { Context } = await import("../api/routes/convai/environments/_.context.js");
  const { Context: Variables } = await import("../api/routes/convai/environment-variables/_.context.js");
  const context = new Context();
  const variables = new Variables();
  assert.deepEqual(context.listEnvironments(), { environments: [] });
  context.variableStore = () => variables.variables;
  context.environments.set("staging", { name: "staging" });
  context.environments.set("production", { name: "production" });
  assert.deepEqual(context.listEnvironments().environments.map(item => item.name), ["production", "staging"]);
  const source = { name: "test" };
  const created = context.createEnvironment(source).value!;
  source.name = "changed";
  created.name = "changed";
  context.listEnvironments().environments[0].name = "changed";
  assert.deepEqual(context.listEnvironments().environments.map(item => item.name), ["production", "staging", "test"]);
  const before = context.listEnvironments();
  for (const invalid of [null, [], {}, { name: null }, { name: 1 }, { name: "" }, { name: "   " }, { name: "x", extra: true }]) assert.equal(context.createEnvironment(invalid).error, "invalid_environment");
  assert.equal(context.createEnvironment({ name: "test" }).error, "environment_conflict");
  assert.equal(context.deleteEnvironment("production"), "protected_environment");
  assert.equal(context.deleteEnvironment("missing"), "environment_not_found");
  assert.deepEqual(context.listEnvironments(), before);
  assert.equal(context.nextEnvironmentNumber, 1);
  const variable = variables.createVariable({ type: "string", label: "url", values: { production: "prod", staging: "stage", test: "test" } }).value!;
  // Replace the canonical map after wiring, as reset/empty scenarios do.
  variables.variables = new Map([[variable.id, variable]]);
  assert.equal(context.deleteEnvironment("staging"), undefined);
  assert.deepEqual(variables.getVariable(variable.id)!.values, { production: "prod", test: "test" });
  assert.equal(context.deleteEnvironment("staging"), "environment_not_found");
});

test("environment Dispatcher CRUD, error atomicity, variable cleanup, reset and isolation", async () => {
  const app = await createDispatcherHarness();
  const second = await createDispatcherHarness();
  const post = (body: unknown, url = path) => app.request(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const list = async () => {
    const response = await app.request(path);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type")!, /application\/json/);
    return response.json();
  };
  const baseline = await list();
  assert.deepEqual(baseline.environments.map((item: { name: string }) => item.name), ["production", "staging"]);
  assert.equal(baseline.environments[0].created_by_user_id, undefined);
  const originalVariables = await (await app.request(variablePath)).json();
  for (const body of [null, [], {}, { name: "" }, { name: " " }, { name: 1 }, { name: "bad", extra: true }]) assert.equal((await post(body)).status, 400);
  assert.equal((await post({ name: "staging" })).status, 409);
  for (const [name, status] of [["production", 400], ["missing", 404]] as const) {
    const response = await app.request(path + "/" + name, { method: "DELETE" });
    assert.equal(response.status, status);
    assert.equal(await response.text(), "");
  }
  assert.deepEqual(await list(), baseline);
  assert.deepEqual(await (await app.request(variablePath)).json(), originalVariables);
  const response = await post({ name: "test" });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { name: "test", created_by_user_id: "sim-user", updated_at_unix_secs: 1_735_689_601 });
  assert.deepEqual(await (await app.request(variablePath)).json(), originalVariables);
  const variable = await (await post({ type: "secret", label: "token", values: { production: { secret_id: "prod" }, staging: { secret_id: "stage" }, test: { secret_id: "test" } } }, variablePath)).json();
  const authVariable = await (await post({ type: "auth_connection", label: "auth", values: { production: { auth_connection_id: "prod-auth" }, staging: { auth_connection_id: "stage-auth" } } }, variablePath)).json();
  let deleted = await app.request(path + "/staging", { method: "DELETE" });
  assert.equal(deleted.status, 204);
  assert.equal(await deleted.text(), "");
  assert.deepEqual((await (await app.request(variablePath + "/" + variable.id)).json()).values, { production: { secret_id: "prod" }, test: { secret_id: "test" } });
  assert.deepEqual((await (await app.request(variablePath + "/" + authVariable.id)).json()).values, { production: { auth_connection_id: "prod-auth" } });
  assert.deepEqual((await (await app.request(variablePath + "?environment=staging")).json()).environment_variables, []);
  assert.deepEqual((await (await app.request(variablePath + "/sim-environment-variable")).json()).values, { production: "https://production.example.invalid" });
  assert.equal((await app.request(path + "/staging", { method: "DELETE" })).status, 404);
  assert.deepEqual(await (await second.request(path)).json(), baseline);
  assert.deepEqual(await (await second.request(variablePath)).json(), originalVariables);
  await app.scenario("emptyEnvironmentVariables");
  const replacement = await (await post({ type: "string", label: "replacement", values: { production: "prod", test: "test" } }, variablePath)).json();
  deleted = await app.request(path + "/test", { method: "DELETE" });
  assert.equal(deleted.status, 204);
  assert.deepEqual((await (await app.request(variablePath + "/" + replacement.id)).json()).values, { production: "prod" });
  await app.scenario("productionEnvironmentOnly");
  assert.deepEqual((await list()).environments.map((item: { name: string }) => item.name), ["production"]);
  assert.equal((await (await post({ name: "test" })).json()).updated_at_unix_secs, 1_735_689_601);
  await app.scenario("reset");
  assert.deepEqual(await list(), baseline);
  assert.deepEqual(await (await app.request(variablePath)).json(), originalVariables);
  assert.equal((await (await post({ name: "test" })).json()).updated_at_unix_secs, 1_735_689_601);
  assert.equal((await (await app.request("/v1/convai/tags")).json()).conversation_tags.length, 1);
});

test("environment scenarios own baseline metadata and allocation", async () => {
  const runner = await createScenarioRunner();
  const context = runner.loadContext("/convai/environments");
  assert.deepEqual(context.listEnvironments(), { environments: [] });
  await runner.run(scenarios.startup);
  const baseline = context.listEnvironments();
  context.createEnvironment({ name: "custom" });
  await runner.run(scenarios.productionEnvironmentOnly);
  assert.deepEqual(context.listEnvironments().environments.map(item => item.name), ["production"]);
  assert.equal(context.nextEnvironmentNumber, 0);
  await runner.run(scenarios.reset);
  assert.deepEqual(context.listEnvironments(), baseline);
});
