import assert from "node:assert/strict";
import test from "node:test";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import { createScenarioRunner } from "../test-support/scenarios.js";
import * as scenarios from "../api/scenarios/index.js";
const path = "/v1/workspace/groups";
const email = "assistant@example.invalid";
test("group Context validates atomic membership and defensive copies", async () => {
  const { Context } = await import("../api/routes/workspace/groups/_.context.js");
  const context = new Context();
  assert.deepEqual(context.listGroups(), {});
  context.members.set(email, "sim-member-assistant");
  context.groups.set("g", { id: "g", name: "Synthetic Team", members: [], permissions: [] });
  context.addMember("g", { email });
  context.addMember("g", { email });
  assert.deepEqual(context.listGroups().g.members, ["sim-member-assistant"]);
  assert.deepEqual(context.searchGroups("TEAM"), [{ id: "g", name: "Synthetic Team", members_emails: [email] }]);
  context.listGroups().g.members.push("changed");
  context.listGroups().g.permissions!.pop();
  context.searchGroups("team")[0].members_emails.push("changed");
  const baseline = context.listGroups();
  assert.deepEqual(baseline.g.members, ["sim-member-assistant"]);
  assert.deepEqual(context.searchGroups("team")[0].members_emails, [email]);
  for (const body of [null, {}, { email: 4 }, { email: "invalid" }, { email, extra: true }]) {
    assert.throws(() => context.addMember("g", body));
    assert.throws(() => context.removeMember("g", body));
    assert.deepEqual(context.listGroups(), baseline);
  }
  assert.throws(() => context.addMember("missing", { email }));
  assert.throws(() => context.removeMember("g", { email: "unknown@example.invalid" }));
  context.groups.get("g")!.scim_frozen = true;
  assert.throws(() => context.removeMember("g", { email }));
  assert.deepEqual(context.listGroups().g.members, ["sim-member-assistant"]);
  context.groups.get("g")!.scim_frozen = false;
  for (let i = 0; i < 2; i++) assert.deepEqual(context.removeMember("g", { email }), { status: "ok" });
  assert.deepEqual(context.listGroups().g.members, []);
});
test("group scenarios populate and replace state", async () => {
  const runner = await createScenarioRunner();
  const context = runner.loadContext("/workspace/groups");
  assert.deepEqual(context.listGroups(), {});
  await runner.run(scenarios.startup);
  const baseline = context.listGroups();
  assert.equal(Object.keys(baseline).length, 2);
  context.addMember("sim-group-team", { email });
  await runner.run(scenarios.emptyGroups);
  assert.deepEqual(context.listGroups(), {});
  assert.equal(context.members.size, 0);
  await runner.run(scenarios.reset);
  assert.deepEqual(context.listGroups(), baseline);
  assert.equal(context.members.get(email), "sim-member-assistant");
});
test("group Dispatcher list/search/add/remove preserves isolation and reset", async () => {
  const app = await createDispatcherHarness();
  const second = await createDispatcherHarness();
  const list = async () => {
    const response = await app.request(path);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type")!, /application\/json/);
    return response.json();
  };
  const send = (body: unknown, group = "sim-group-team", remove = false) => app.request(`${path}/${group}/members${remove ? "/remove" : ""}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const search = async (name: string) => {
    const response = await app.request(`${path}/search?name=${encodeURIComponent(name)}`);
    assert.equal(response.status, 200);
    return response.json();
  };
  const baseline = await list();
  assert.equal(Object.keys(baseline).length, 2);
  assert.deepEqual(baseline["sim-group-team"].members, ["sim-member-narrator"]);
  assert.deepEqual(await search(" TEAM "), [{ id: "sim-group-team", name: "Simulator Team", members_emails: ["narrator@example.invalid"] }]);
  assert.equal((await search("simulator")).length, 2);
  for (const name of ["absent", ""]) assert.deepEqual(await search(name), []);
  assert.equal((await app.request(`${path}/search`)).status, 400);
  for (const remove of [false, false, true, true]) {
    const response = await send({ email }, "sim-group-team", remove);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: "ok" });
    assert.deepEqual((await list())["sim-group-team"].members, remove ? ["sim-member-narrator"] : ["sim-member-narrator", "sim-member-assistant"]);
    assert.deepEqual((await search("Team"))[0].members_emails, remove ? ["narrator@example.invalid"] : ["narrator@example.invalid", email]);
  }
  for (const remove of [false, true]) {
    for (const body of [{}, { email: 4 }, { email: "bad" }, { email, extra: true }, null]) assert.equal((await send(body, "sim-group-team", remove)).status, 400);
    for (const [group, body, status, code] of [["missing", { email }, 404, "group_not_found"], ["sim-group-team", { email: "unknown@example.invalid" }, 404, "workspace_member_not_found"], ["sim-group-scim", { email }, 409, "group_scim_frozen"]] as const) {
      const response = await send(body, group, remove);
      assert.equal(response.status, status);
      assert.equal((await response.json()).detail.status, code);
    }
  }
  assert.deepEqual(await list(), baseline);
  await send({ email });
  assert.deepEqual(await (await second.request(path)).json(), baseline);
  await app.scenario("emptyGroups");
  assert.deepEqual(await list(), {});
  assert.deepEqual(await search("simulator"), []);
  await app.scenario("reset");
  assert.deepEqual(await list(), baseline);
  assert.equal((await (await app.request("/v1/voices")).json()).voices.length, 2);
  assert.equal((await (await app.request("/v1/workspace/webhooks")).json()).webhooks.length, 1);
});
