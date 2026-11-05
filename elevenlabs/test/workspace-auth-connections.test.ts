import assert from "node:assert/strict";
import test from "node:test";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import { createScenarioRunner } from "../test-support/scenarios.js";
import * as scenarios from "../api/scenarios/index.js";
const path = "/v1/workspace/auth-connections";
const basic = { name: "Synthetic Basic", provider: "example", username: "sim-user", password: "sim-password" };
const bearer = { name: "Synthetic Bearer", auth_type: "bearer_auth", provider: "example", token: "sim-token" };
const oauth = { name: "Synthetic OAuth", auth_type: "oauth2_client_credentials", provider: "example", client_id: "sim-client", client_secret: "sim-secret", token_url: "https://example.invalid/token", scopes: ["read"], extra_params: { audience: "sim" }, custom_headers: { X: "sim" } };
const publicOnly = (value: unknown) => {
  for (const secret of ["sim-password", "sim-token", "sim-secret", '"password"', '"token"', "client_secret", "private_key"]) assert.equal(JSON.stringify(value).includes(secret), false);
};
test("auth connection Context validates atomic transitions and returns defensive public copies", async () => {
  const { Context } = await import("../api/routes/workspace/auth-connections/_.context.js");
  const context = new Context();
  assert.deepEqual(context.listAuthConnections(), { auth_connections: [] });
  const source = structuredClone(oauth);
  const created = context.createAuthConnection(source);
  assert.equal(created.id, "sim-auth-connection-created-1");
  publicOnly(created);
  source.scopes.push("write");
  if (created.auth_type === "oauth2_client_credentials") created.scopes!.push("changed");
  const listed = context.listAuthConnections().auth_connections[0];
  assert.equal(listed.auth_type, "oauth2_client_credentials");
  if (listed.auth_type === "oauth2_client_credentials") assert.deepEqual(listed.scopes, ["read"]);
  const patch = { scopes: ["new"], custom_headers: {}, client_secret: "synthetic-replacement" };
  context.updateAuthConnection(created.id, patch);
  patch.scopes.push("changed");
  assert.deepEqual(context.authConnections.get(created.id)?.auth_type, "oauth2_client_credentials");
  const stored = context.authConnections.get(created.id)!;
  if (stored.auth_type === "oauth2_client_credentials") {
    assert.deepEqual(stored.scopes, ["new"]);
    assert.equal(stored.client_secret, "synthetic-replacement");
  }
  const after = context.listAuthConnections();
  for (const invalid of [{ auth_type: "bearer_auth" }, { username: "wrong-family" }, { scopes: [2] }, { name: "unsupported" }, null]) {
    assert.throws(() => context.updateAuthConnection(created.id, invalid));
    assert.deepEqual(context.listAuthConnections(), after);
  }
  context.updateAuthConnection(created.id, { scopes: null, provider: null, client_secret: null });
  assert.deepEqual(context.listAuthConnections(), after);
  for (const invalid of [{}, { ...basic, token: "ambiguous" }, { ...basic, auth_type: "bearer_auth" }, { ...basic, password: null }]) assert.throws(() => context.createAuthConnection(invalid));
  assert.equal(context.nextAuthConnectionNumber, 1);
  assert.deepEqual(context.listAuthConnections(), after);
  assert.equal(context.updateAuthConnection("missing", {}), undefined);
  assert.equal(context.deleteAuthConnection("missing"), undefined);
  assert.deepEqual(context.deleteAuthConnection(created.id), { status: "ok" });
  assert.deepEqual(context.listAuthConnections(), { auth_connections: [] });
  const b = context.createAuthConnection({ ...basic, auth_type: "basic_auth" });
  context.updateAuthConnection(b.id, { username: "renamed", password: "synthetic-basic" });
  assert.equal(context.authConnections.get(b.id)?.auth_type, "basic_auth");
  const t = context.createAuthConnection({ name: bearer.name, provider: bearer.provider, token: bearer.token });
  assert.equal(t.auth_type, "bearer_auth");
  context.updateAuthConnection(t.id, { auth_type: "bearer_auth", token: "synthetic-bearer" });
  const inferred = context.createAuthConnection({ name: oauth.name, provider: oauth.provider, client_id: oauth.client_id, client_secret: oauth.client_secret, token_url: oauth.token_url, scopes: ["read"] });
  assert.equal(inferred.auth_type, "oauth2_client_credentials");
  const output = context.listAuthConnections();
  if (output.auth_connections[2].auth_type === "oauth2_client_credentials") output.auth_connections[2].scopes!.push("changed");
  const fresh = context.listAuthConnections().auth_connections[2];
  if (fresh.auth_type === "oauth2_client_credentials") assert.deepEqual(fresh.scopes, ["read"]);
});
test("auth connection scenarios restore fixture and allocation sequence", async () => {
  const runner = await createScenarioRunner();
  const context = runner.loadContext("/workspace/auth-connections");
  assert.deepEqual(context.listAuthConnections(), { auth_connections: [] });
  await runner.run(scenarios.startup);
  const baseline = context.listAuthConnections();
  assert.equal(baseline.auth_connections[0].id, "sim-auth-connection");
  context.createAuthConnection(basic);
  await runner.run(scenarios.emptyAuthConnections);
  assert.deepEqual(context.listAuthConnections(), { auth_connections: [] });
  assert.equal(context.createAuthConnection(basic).id, "sim-auth-connection-created-1");
  await runner.run(scenarios.reset);
  assert.deepEqual(context.listAuthConnections(), baseline);
  assert.equal(context.createAuthConnection(basic).id, "sim-auth-connection-created-1");
});
test("auth connection Dispatcher CRUD validates, projects, resets and isolates configuration", async () => {
  const app = await createDispatcherHarness();
  const second = await createDispatcherHarness();
  const send = (method: string, body: unknown, suffix = "") => app.request(path + suffix, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const list = async () => {
    const response = await app.request(path);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type")!, /application\/json/);
    const value = await response.json();
    publicOnly(value);
    return value;
  };
  const baseline = await list();
  assert.equal(baseline.auth_connections[0].id, "sim-auth-connection");
  const ids: string[] = [];
  for (const [index, body] of [basic, bearer, oauth].entries()) {
    const response = await send("POST", body);
    assert.equal(response.status, 200);
    const created = await response.json();
    assert.equal(created.id, `sim-auth-connection-created-${index + 1}`);
    assert.equal(created.status, "active");
    publicOnly(created);
    ids.push(created.id);
    assert.deepEqual((await list()).auth_connections.at(-1), created);
  }
  assert.equal((await list()).auth_connections[1].auth_type, "basic_auth");
  for (const [index, patch] of [{ username: "edited", password: "synthetic-replacement" }, { token: "synthetic-replacement" }, { scopes: [], custom_headers: {}, extra_params: {}, basic_auth_in_header: true }].entries()) {
    const response = await send("PATCH", patch, `/${ids[index]}`);
    assert.equal(response.status, 200);
    publicOnly(await response.json());
  }
  assert.equal((await list()).auth_connections[1].username, "edited");
  assert.deepEqual((await list()).auth_connections[3].scopes, []);
  const after = await list();
  for (const body of [{}, { ...basic, auth_type: "bearer_auth" }, { ...basic, token: "ambiguous" }, { ...oauth, scopes: [4] }, { name: "unsupported", provider: "example", auth_type: "custom_header_auth", header_name: "X", header_value: "synthetic" }]) assert.equal((await send("POST", body)).status, 400);
  for (const body of [{ auth_type: "bearer_auth" }, { token: "wrong-family" }, { username: 4 }, { name: "unsupported" }]) assert.equal((await send("PATCH", body, `/${ids[0]}`)).status, 400);
  assert.deepEqual(await list(), after);
  for (const body of [{}, { username: null, password: null, provider: null }]) assert.equal((await send("PATCH", body, `/${ids[0]}`)).status, 200);
  assert.deepEqual(await list(), after);
  for (const method of ["PATCH", "DELETE"]) {
    const response = method === "PATCH" ? await send(method, {}, "/missing") : await app.request(path + "/missing", { method });
    assert.equal(response.status, 404);
    assert.equal((await response.json()).detail.status, "auth_connection_not_found");
  }
  for (const id of ids) {
    const response = await app.request(`${path}/${id}`, { method: "DELETE" });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: "ok" });
  }
  assert.equal((await app.request(`${path}/${ids[0]}`, { method: "DELETE" })).status, 404);
  assert.deepEqual(await list(), baseline);
  assert.deepEqual(await (await second.request(path)).json(), baseline);
  await app.scenario("emptyAuthConnections");
  assert.deepEqual(await list(), { auth_connections: [] });
  assert.equal((await (await send("POST", basic)).json()).id, ids[0]);
  await app.scenario("reset");
  assert.deepEqual(await list(), baseline);
  assert.equal((await (await send("POST", basic)).json()).id, ids[0]);
  assert.equal((await (await app.request("/v1/voices")).json()).voices.length, 2);
  assert.equal((await (await app.request("/v1/workspace/webhooks")).json()).webhooks.length, 1);
});
