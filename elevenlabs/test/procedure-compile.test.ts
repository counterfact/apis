import assert from "node:assert/strict";
import test from "node:test";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import * as scenarios from "../api/scenarios/index.js";
import { Context } from "../api/routes/convai/agents/{agent_id}/branches/{branch_id}/procedures/_.context.js";
const contextPath = "/convai/agents/{agent_id}/branches/{branch_id}/procedures";
const base = "/v1/convai/agents/sim-agent/branches/sim-main-branch/procedures";
const expected = { workflow: {
  nodes: { start: { type: "start", position: { x: 0, y: 0 }, edge_order: ["enter"] }, support: { type: "override_agent", position: { x: 0, y: 100 }, edge_order: ["finish"], conversation_config: {}, additional_prompt: "Stored local support instructions.", additional_knowledge_base: [], additional_tool_ids: [], label: "Published support", entry_behavior: "auto" }, end: { type: "end", position: { x: 0, y: 200 }, edge_order: [], outcome: "success" } },
  edges: { enter: { source: "start", target: "support", forward_condition: { type: "unconditional", label: null }, backward_condition: null, reroutes: [] }, finish: { source: "support", target: "end", forward_condition: { type: "unconditional", label: null }, backward_condition: null, reroutes: [] } }, prevent_subagent_loops: false,
} };
const edit = { name: "Draft support", content: "Configured local support draft.", type: "free_form", trigger: "When support is requested" };
const snapshot = (c: Context, agents: unknown) => structuredClone({ versions: c.versions, working: c.working, nextProcedure: c.nextProcedure, compilationFixtures: c.compilationFixtures, branches: c.lifecycle!.branches, agentVersions: c.lifecycle!.versions, lifecycle: Object.fromEntries(Object.entries(c.lifecycle!).filter(([, value]) => typeof value !== "function")), agents });
test("compile context matches explicit inputs, copies workflows and never persists", async () => {
  assert.deepEqual(new Context().compilationFixtures, []);
  const r = await createScenarioRunner(); await r.run(scenarios.startup);
  const c = r.loadContext(contextPath as never) as Context;
  const agents = r.loadContext("/convai/agents").agents;
  let before = snapshot(c, agents);
  const result = c.compile("sim-agent", "sim-main-branch");
  assert.deepEqual(result, { ok: true, ...expected });
  assert.deepEqual(snapshot(c, agents), before);
  if (!result.ok) throw new Error("Expected configured compilation");
  result.workflow.nodes.start.position.x = 999;
  assert.deepEqual(c.compile("sim-agent", "sim-main-branch"), { ok: true, ...expected });
  assert.deepEqual(c.compile("sim-agent", "sim-agent-feature"), { ok: true, ...expected });
  await r.run(scenarios.procedureCompilationDraft);
  before = snapshot(c, agents);
  const draft = c.compile("sim-agent", "sim-main-branch"); assert.equal(draft.ok, true);
  if (draft.ok) {
    assert.equal(draft.workflow.nodes.end.position.y, 300);
    assert.equal(draft.workflow.nodes.support.type, "override_agent");
    if (draft.workflow.nodes.support.type === "override_agent") assert.equal(draft.workflow.nodes.support.additional_prompt, edit.content);
  }
  assert.deepEqual(snapshot(c, agents), before);
  assert.deepEqual(c.compile("sim-agent", "sim-agent-feature"), { ok: true, ...expected });
  c.updateDraft("sim-agent", "sim-main-branch", "sim-procedure", { ...edit, content: "Unconfigured text" });
  before = snapshot(c, agents);
  assert.deepEqual(c.compile("sim-agent", "sim-main-branch"), { ok: false, errors: { "sim-procedure": [{ path: "content", message: "No synthetic compilation fixture matches the current procedure set." }] } });
  assert.deepEqual(snapshot(c, agents), before);
  assert.throws(() => c.compile("missing", "sim-main-branch"), { code: "agent_not_found" });
  assert.throws(() => c.compile("sim-agent", "missing"), { code: "branch_not_found" });
  c.deleteDraft("sim-agent", "sim-main-branch", "sim-procedure");
  agents.get("sim-agent")!.configuration.procedures = {};
  before = snapshot(c, agents);
  assert.equal(c.compile("sim-agent", "sim-main-branch").ok, false);
  assert.deepEqual(snapshot(c, agents), before);
  assert.deepEqual(c.compile("sim-agent", "sim-agent-feature"), { ok: true, ...expected });
  await r.run(scenarios.reset);
  const created = c.create("sim-agent", "sim-main-branch", { name: "Extra", content: "" });
  before = snapshot(c, agents);
  const changedMembership = c.compile("sim-agent", "sim-main-branch");
  assert.equal(changedMembership.ok, false);
  assert.deepEqual(snapshot(c, agents), before);
  c.remove("sim-agent", "sim-main-branch", created.procedure_id);
  assert.deepEqual(c.compile("sim-agent", "sim-main-branch"), { ok: true, ...expected });
  c.remove("sim-agent", "sim-main-branch", "sim-procedure");
  before = snapshot(c, agents);
  assert.deepEqual(c.compile("sim-agent", "sim-main-branch"), { ok: false, errors: { "$procedures": [{ path: "content", message: "No synthetic compilation fixture matches the current procedure set." }] } });
  assert.deepEqual(snapshot(c, agents), before);
  await r.run(scenarios.reset);
  assert.deepEqual(c.compile("sim-agent", "sim-main-branch"), { ok: true, ...expected });
});
test("validated generated compile route returns dry-run fixtures and atomic errors", async () => {
  const h = await createDispatcherHarness();
  const compile = (path = base) => h.request(path + "/compile", { method: "POST" });
  let response = await compile(); assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type")!, /application\/json/);
  assert.deepEqual(await response.json(), expected);
  const agentPath = "/v1/convai/agents/sim-agent";
  const read = async () => ({ agent: await (await h.request(agentPath)).json(), historical: await (await h.request(agentPath + "?version_id=sim-agent-version-main")).json(), procedures: await (await h.request(base)).json(), draft: await (await h.request(base + "/sim-procedure/draft")).json() });
  await h.scenario("procedureCompilationDraft"); let before = await read();
  response = await compile(); assert.equal(response.status, 200);
  assert.equal((await response.json()).workflow.nodes.end.position.y, 300);
  assert.deepEqual(await read(), before);
  assert.deepEqual(await (await compile(base.replace("sim-main-branch", "sim-agent-feature"))).json(), expected);
  response = await h.request(base + "/sim-procedure/draft", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...edit, content: "Unconfigured text" }) });
  assert.equal(response.status, 200); before = await read();
  response = await compile(); assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { errors: { "sim-procedure": [{ path: "content", message: "No synthetic compilation fixture matches the current procedure set." }] } });
  assert.deepEqual(await read(), before);
  for (const [path, code] of [[base.replace("sim-agent/", "missing/"), "agent_not_found"], [base.replace("sim-main-branch", "missing"), "branch_not_found"], [base.replace("sim-main-branch", "sim-agent-version-main"), "branch_not_found"]]) {
    const missing = await compile(path); assert.equal(missing.status, 404); assert.equal((await missing.json()).detail.status, code);
  }
  const other = await createDispatcherHarness();
  assert.deepEqual(await (await other.request(base + "/compile", { method: "POST" })).json(), expected);
  await h.scenario("reset"); assert.deepEqual(await (await compile()).json(), expected);
});
