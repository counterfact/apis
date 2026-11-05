import assert from "node:assert/strict";
import test from "node:test";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import * as scenarios from "../api/scenarios/index.js";

type Runner = Awaited<ReturnType<typeof createScenarioRunner>>;
const agent = "sim-agent", branch = "sim-agent-feature", main = "sim-main-branch", proposal = "sim-merge-proposal", voice = "sim-pvc-samples";
const agentPath = `/v1/convai/agents/${agent}`;
type Case = {
  name: string; method: string; path: string; read: string;
  action: (r: Runner, body: unknown) => unknown;
  state: (r: Runner) => unknown;
  rebase?: boolean;
};
const cases: Case[] = [
  { name: "collection metadata", method: "PATCH", path: "/v1/voices/collections/sim-collection", read: "/v1/voices/collections/sim-collection",
    action: (r, b) => r.loadContext("/voices/collections").updateCollection("sim-collection", b as never),
    state: r => r.loadContext("/voices/collections").getCollection("sim-collection") },
  { name: "dictionary metadata", method: "PATCH", path: "/v1/pronunciation-dictionaries/sim-dictionary", read: "/v1/pronunciation-dictionaries/sim-dictionary",
    action: (r, b) => r.loadContext("/pronunciation-dictionaries").updateDictionary("sim-dictionary", b as never),
    state: r => r.loadContext("/pronunciation-dictionaries").getDictionary("sim-dictionary") },
  { name: "agent duplication", method: "POST", path: `${agentPath}/duplicate`, read: "/v1/convai/agents/sim-agent-created-1",
    action: (r, b) => r.loadContext("/convai/agents").duplicateAgent(agent, b),
    state: r => r.loadContext("/convai/agents").getAgent("sim-agent-created-1") },
  { name: "knowledge metadata", method: "PATCH", path: "/v1/convai/knowledge-base/sim-kb-text", read: "/v1/convai/knowledge-base/sim-kb-text",
    action: (r, b) => r.loadContext("/convai/knowledge-base").updateDocument("sim-kb-text", b),
    state: r => r.loadContext("/convai/knowledge-base").getDocument("sim-kb-text") },
  { name: "knowledge move to root", method: "POST", path: "/v1/convai/knowledge-base/sim-kb-text/move", read: "/v1/convai/knowledge-base/sim-kb-text",
    action: (r, b) => r.loadContext("/convai/knowledge-base").moveDocument("sim-kb-text", b),
    state: r => r.loadContext("/convai/knowledge-base").getDocument("sim-kb-text") },
  { name: "branch metadata", method: "PATCH", path: `${agentPath}/branches/${branch}`, read: `${agentPath}/branches/${branch}`,
    action: (r, b) => r.loadContext("/convai/agents/{agent_id}/branches").update(agent, branch, b),
    state: r => r.loadContext("/convai/agents/{agent_id}/branches").get(agent, branch) },
  { name: "branch merge", method: "POST", path: `${agentPath}/branches/${branch}/merge?target_branch_id=${main}`, read: agentPath,
    action: (r, b) => r.loadContext("/convai/agents/{agent_id}/branches").merge(agent, branch, main, b),
    state: r => ({ agent: r.loadContext("/convai/agents/{agent_id}/branches").select(agent, {}), branch: r.loadContext("/convai/agents/{agent_id}/branches").get(agent, branch) }) },
  { name: "branch rebase", method: "POST", path: `${agentPath}/branches/${branch}/rebase`, read: `${agentPath}?branch_id=${branch}`, rebase: true,
    action: (r, b) => r.loadContext("/convai/agents/{agent_id}/branches").rebase(agent, branch, undefined, b),
    state: r => r.loadContext("/convai/agents/{agent_id}/branches").select(agent, { branch_id: branch }) },
  { name: "proposal metadata", method: "PATCH", path: `${agentPath}/merge-proposals/${proposal}`, read: `${agentPath}/merge-proposals/${proposal}`,
    action: (r, b) => r.loadContext("/convai/agents/{agent_id}/merge-proposals").update(agent, proposal, b),
    state: r => r.loadContext("/convai/agents/{agent_id}/merge-proposals").get(agent, proposal) },
  { name: "proposal merge", method: "POST", path: `${agentPath}/merge-proposals/${proposal}/merge`, read: `${agentPath}/merge-proposals/${proposal}`,
    action: (r, b) => r.loadContext("/convai/agents/{agent_id}/merge-proposals").merge(agent, proposal, b),
    state: r => ({ proposal: r.loadContext("/convai/agents/{agent_id}/merge-proposals").get(agent, proposal), agent: r.loadContext("/convai/agents/{agent_id}/branches").select(agent, {}) }) },
  { name: "professional voice metadata", method: "POST", path: `/v1/voices/pvc/${voice}`, read: `/v1/voices/${voice}`,
    action: (r, b) => r.loadContext("/voices/pvc").update(voice, b), state: r => r.context.getVoice(voice) },
  { name: "professional sample metadata", method: "POST", path: `/v1/voices/pvc/${voice}/samples/sim-sample`, read: `/v1/voices/${voice}`,
    action: (r, b) => r.loadContext("/voices/pvc").updateSample(voice, "sim-sample", b), state: r => r.context.getVoice(voice) },
  { name: "professional training", method: "POST", path: `/v1/voices/pvc/${voice}/train`, read: `/v1/voices/${voice}`,
    action: (r, b) => r.loadContext("/voices/pvc").train(voice, b),
    state: r => ({ voice: r.context.getVoice(voice), job: structuredClone(r.loadContext("/voices/pvc").training.get(voice)) }) },
];

for (const c of cases) {
  test(`optional ${c.name} Context body uses the existing empty-object behavior`, async () => {
    const r = await createScenarioRunner();
    const reset = async () => {
      await r.run(scenarios.reset);
      await r.run(scenarios.voiceSampleFixtures);
      await r.run(scenarios.verifiedVoiceSampleFixtures);
      if (c.rebase) await r.run(scenarios.branchMergeConflicts);
    };
    await reset();
    const before = c.state(r);
    if (c.name === "agent duplication") assert.deepEqual(c.action(r, null), { error: "invalid_agent" });
    else assert.throws(() => c.action(r, null));
    assert.deepEqual(c.state(r), before);
    const result = c.action(r, undefined), state = c.state(r);
    assertDefaults(c.name, state);
    await reset();
    assert.deepEqual(result, c.action(r, {}));
    assert.deepEqual(state, c.state(r));
  });

  test(`optional ${c.name} Dispatcher body selects defaults and preserves explicit invalid bodies`, async () => {
    const h = await createDispatcherHarness();
    const reset = async () => {
      await h.scenario("reset");
      await h.scenario("voiceSampleFixtures");
      await h.scenario("verifiedVoiceSampleFixtures");
      if (c.rebase) await h.scenario("branchMergeConflicts");
    };
    const send = (body?: unknown) => h.request(c.path, { method: c.method, ...(body === undefined ? {} : { headers: { "content-type": "application/json" }, body: JSON.stringify(body) }) });
    await reset();
    for (const body of [null, []]) assert.equal((await send(body)).status, 400);
    const response = await send();
    assert.equal(response.status, 200, await response.clone().text());
    const result = await response.text();
    const read = await h.request(c.read);
    assert.equal(read.status, 200);
    const state = await read.json();
    assertDefaults(c.name, state, true);
    if (c.name === "branch merge" || c.name === "proposal merge") {
      const archived = await h.request(`${agentPath}/branches/${branch}`);
      assert.equal((await archived.json()).is_archived, true);
    }
    await reset();
    const explicit = await send({});
    assert.equal(explicit.status, 200);
    assert.equal(await explicit.text(), result);
    assert.deepEqual(await (await h.request(c.read)).json(), state);
  });
}

function assertDefaults(name: string, state: unknown, http = false) {
  // Domain results supplement the equality checks against the existing {} behavior.
  const value = state as Record<string, any>;
  if (name === "agent duplication") assert.equal(value.name, "Simulator Support (copy)");
  if (name === "knowledge move to root") assert.equal(value.folder_parent_id, null);
  if (name === "branch merge") {
    const agent = http ? value : value.agent;
    assert.equal(agent.conversation_config.agent.first_message, "Feature greeting");
    if (!http) assert.equal(value.branch.is_archived, true);
  }
  if (name === "branch rebase") assert.equal(value.conversation_config.agent.language, "es");
  if (name === "proposal merge") assert.equal((http ? value : value.proposal).outcome.status, "merged");
  if (name === "professional training") {
    assert.equal((http ? value : value.voice).fine_tuning.state.eleven_multilingual_v2, "queued");
    if (!http) assert.equal(value.job.model, "eleven_multilingual_v2");
  }
}
