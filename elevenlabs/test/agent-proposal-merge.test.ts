import assert from "node:assert/strict";
import test from "node:test";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import * as scenarios from "../api/scenarios/index.js";

const agent = "sim-agent", proposal = "sim-merge-proposal", main = "sim-main-branch", feature = "sim-agent-feature";
test("proposal merge publishes actual configuration, ancestry and shared references once", async () => {
  const r = await createScenarioRunner(); await r.run(scenarios.startup);
  const c = r.loadContext("/convai/agents/{agent_id}/merge-proposals");
  const lifecycle = c.lifecycle!;
  await r.run(scenarios.knowledgeBaseReferences);
  await r.run(scenarios.agentAnalysisReferences);
  await r.run(scenarios.mcpAgentReference);
  // Reviews are stored metadata: merging is itself the local approval action.
  c.review(agent, proposal, { state: "changes_requested" });
  const before = c.get(agent, proposal);
  const merged = c.merge(agent, proposal, { archive_source_branch: false });
  assert.equal(merged.outcome!.status, "merged");
  if (merged.outcome!.status !== "merged") assert.fail("merged outcome expected");
  const versionId = merged.outcome!.version_id;
  assert.equal(merged.outcome!.by_user_id, "sim-user");
  assert.equal(merged.updated_at, merged.outcome!.at);
  assert.deepEqual(merged.reviews, before.reviews);
  assert.equal(merged.source_tip_version_id_at_creation, "sim-agent-version-feature");
  assert.equal(lifecycle.version(agent, versionId).parents.merged_from_version_id, "sim-agent-version-feature");
  const live = lifecycle.select(agent, {});
  assert.equal(live.version_id, versionId);
  assert.equal(live.conversation_config.agent!.first_message, "Feature greeting");
  assert.equal(live.conversation_config.agent!.prompt!.knowledge_base![0].id, "sim-kb-text");
  assert.deepEqual(live.conversation_config.agent!.prompt!.mcp_server_ids, ["sim-mcp"]);
  assert.equal(live.platform_settings!.analysis_items!.evaluation_criteria![0].analysis_item_id, "sim-analysis-evaluation");
  assert.equal(r.loadContext("/convai/agents/{agent_id}/branches/{branch_id}/procedures").get(agent, main, "sim-procedure").version_id, "sim-procedure-version");
  assert.equal(lifecycle.get(agent, feature).is_archived, false);
  merged.title = "external mutation";
  assert.equal(c.list(agent, { status: "merged" }).results[0].title, before.title);
  const count = lifecycle.versions.size, time = c.nextMutation;
  assert.throws(() => c.merge(agent, proposal, {}), { code: "merge_proposal_closed" });
  assert.equal(lifecycle.versions.size, count); assert.equal(c.nextMutation, time);
  await r.run(scenarios.reset);
  assert.equal(c.get(agent, proposal).outcome!.status, "open");
  assert.equal(lifecycle.versions.size, 2);
});

test("proposal merge failures leave proposals, clocks and branch state untouched", async () => {
  const r = await createScenarioRunner(); await r.run(scenarios.startup);
  const c = r.loadContext("/convai/agents/{agent_id}/merge-proposals"), lifecycle = c.lifecycle!;
  const snapshot = () => structuredClone({ records: [...c.records], branches: [...lifecycle.branches], versions: [...lifecycle.versions], nextVersion: lifecycle.nextVersion, nextMutation: c.nextMutation, agents: [...r.loadContext("/convai/agents").agents] });
  let before = snapshot();
  for (const input of [{ force: "true" }, { archive_source_branch: null }, { unknown: true }])
    assert.throws(() => c.merge(agent, proposal, input), { status: 400 });
  assert.throws(() => c.merge(agent, "missing", {}), { status: 404 });
  assert.throws(() => c.merge("missing", proposal, {}), { status: 404 });
  assert.deepEqual(snapshot(), before);
  const reverse = c.create(agent, { source_branch_id: main, target_branch_id: feature, title: "Reverse" }).created_merge_proposal_id;
  before = snapshot();
  assert.throws(() => c.merge(agent, reverse, {}), { code: "branch_in_use" });
  assert.deepEqual(snapshot(), before);
  await r.run(scenarios.branchMergeConflicts);
  lifecycle.rebase(agent, feature, undefined, {});
  before = snapshot();
  assert.throws(() => c.merge(agent, proposal, { force: true }), { code: "merge_proposal_source_changed" });
  assert.deepEqual(snapshot(), before);
});

test("validated Dispatcher merges proposals with force, archives and exposes coherent reads", async () => {
  const h = await createDispatcherHarness();
  const base = `/v1/convai/agents/${agent}`;
  const merge = async (id: string, input: unknown = {}, status = 200) => {
    const response = await h.request(`${base}/merge-proposals/${id}/merge`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(input) });
    assert.equal(response.status, status, await response.clone().text());
    return response;
  };
  await h.scenario("branchMergeConflicts");
  const p = await (await merge(proposal, { force: true })).json();
  assert.equal(p.outcome.status, "merged");
  const live = await (await h.request(base)).json();
  assert.equal(live.version_id, p.outcome.version_id);
  assert.equal(live.conversation_config.agent.first_message, "Feature greeting");
  assert.equal((await (await h.request(`${base}/branches/${feature}`)).json()).is_archived, true);
  assert.equal((await (await h.request(`${base}/merge-proposals?status=merged`)).json()).results[0].id, proposal);
  await merge(proposal, {}, 409);
  await h.scenario("reset");
  await merge(proposal, { force: 42 }, 400);
  await merge("missing", {}, 404);
  await h.scenario("branchMergeConflicts");
  const rebase = await h.request(`${base}/branches/${feature}/rebase`, { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
  assert.equal(rebase.status, 200);
  await merge(proposal, {}, 409);
  assert.equal((await (await h.request(`${base}/merge-proposals/${proposal}`)).json()).outcome.status, "open");
  assert.equal((await (await h.request(`${base}/branches/${main}`)).json()).most_recent_versions.length, 1);
  await h.scenario("reset");
  const other = await createDispatcherHarness();
  await merge(proposal, { archive_source_branch: false });
  assert.equal((await (await other.request(`${base}/merge-proposals/${proposal}`)).json()).outcome.status, "open");
  assert.equal((await (await h.request(`${base}/branches/${feature}`)).json()).is_archived, false);
});
