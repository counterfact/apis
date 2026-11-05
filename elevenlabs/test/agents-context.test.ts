import assert from "node:assert/strict";
import test from "node:test";
import { Context } from "../api/routes/convai/agents/_.context.js";
import { createScenarioRunner } from "../test-support/scenarios.js";
import * as scenarios from "../api/scenarios/index.js";

const defaults = () => ({ name: "New agent", voiceId: "sim-narrator", userId: "sim-user", timeUnix: 1735689600, accessInfo: { is_creator: true, creator_name: "Simulator", creator_email: "sim@example.invalid", role: "admin" as const } });
const input = () => ({ name: "Support", tags: ["help"], conversation_config: { agent: { first_message: "Hello", language: "en", prompt: { prompt: "Help people", llm: "gemini-3.5-flash", temperature: 0, tool_ids: ["tool-one"], tools: [{ type: "client", name: "display", description: "Display help", expects_response: false }] } }, tts: { voice_id: "sim-assistant" } }, platform_settings: { archived: false } });

test("agent context starts empty and supports independent CRUD, copies and deterministic allocation", () => {
  const c = new Context();
  c.defaults = defaults();
  assert.equal(c.agents.size, 0);
  c.defaults = { name: "New agent", voiceId: "sim-narrator", userId: "sim-user", timeUnix: 1735689600, accessInfo: { is_creator: true, creator_name: "Simulator", creator_email: "sim@example.invalid", role: "admin" } };
  const body = input();
  const id = c.createAgent(body).value!.agent_id;
  assert.equal(id, "sim-agent-created-1");
  body.conversation_config.agent.prompt.tool_ids.push("external");
  const read = c.getAgent(id)!;
  assert.deepEqual(read.conversation_config.agent!.prompt!.tool_ids, ["tool-one"]);
  assert.deepEqual(read.metadata, { created_at_unix_secs: 1735689601, updated_at_unix_secs: 1735689601 });
  read.tags!.push("external");
  assert.deepEqual(c.getAgent(id)!.tags, ["help"]);
  const updated = c.updateAgent(id, { conversation_config: { agent: { prompt: { prompt: "Changed", temperature: null } } }, tags: [] }).value!;
  assert.equal(updated.conversation_config.agent!.first_message, "Hello");
  assert.equal(updated.conversation_config.agent!.prompt!.temperature, null);
  assert.deepEqual(updated.conversation_config.agent!.prompt!.tool_ids, ["tool-one"]);
  assert.deepEqual(updated.tags, []);
  const copy = c.duplicateAgent(id, { name: "Copy" }).value!.agent_id;
  c.updateAgent(copy, { conversation_config: { agent: { prompt: { tool_ids: [], tools: [] } } } });
  assert.deepEqual(c.getAgent(id)!.conversation_config.agent!.prompt!.tool_ids, ["tool-one"]);
  assert.equal(c.getAgent(copy)!.metadata.created_at_unix_secs, 1735689603);
  assert.equal(c.deleteAgent(id), true);
  assert.equal(c.getAgent(id), undefined);
  assert.equal(c.getAgent(copy)!.name, "Copy");
  assert.equal(new Context().agents.size, 0);
});

test("agent context validates atomically and preserves metadata and allocation on failure", () => {
  const c = new Context();
  c.defaults = defaults();
  for (const body of [{}, { conversation_config: null }, { conversation_config: {}, name: " " }, { conversation_config: { agent: { prompt: { tool_ids: [1] } } } }, { conversation_config: {}, workflow: {} }, { conversation_config: {}, extra: true }]) assert.equal(c.createAgent(body).error, "invalid_agent");
  const id = c.createAgent(input()).value!.agent_id;
  assert.equal(id, "sim-agent-created-1");
  const before = c.getAgent(id);
  for (const patch of [{ name: "", tags: [] }, { conversation_config: { agent: null } }, { conversation_config: { agent: { language: 42 } } }, { platform_settings: { archived: "false" } }, { procedures: {} }, { version_description: "v2" }, { unknown: true }, { conversation_config: { agent: { prompt: { tools: [{ type: "webhook" }] } } } }]) {
    assert.equal(c.updateAgent(id, patch).error, "invalid_agent");
    assert.deepEqual(c.getAgent(id), before);
  }
  assert.deepEqual(c.updateAgent(id, { name: null, tags: null, conversation_config: null, platform_settings: null }).value, before);
  assert.equal(c.updateAgent("missing", {}).error, "agent_not_found");
  assert.equal(c.duplicateAgent("missing", {}).error, "agent_not_found");
  assert.equal(c.duplicateAgent(id, { name: " " }).error, "invalid_agent");
  assert.equal(c.deleteAgent("missing"), false);
  assert.equal(c.createAgent({ conversation_config: {} }).value!.agent_id, "sim-agent-created-2");
});

test("agent context filters before stable pagination and derives live summaries", () => {
  const c = new Context();
  c.defaults = defaults();
  const first = c.createAgent(input()).value!.agent_id;
  const second = c.createAgent({ ...input(), name: "Another", tags: ["sales"], platform_settings: { archived: true } }).value!.agent_id;
  assert.equal(c.listAgents({ search: "SUP", tags: ["sales", "help"], created_by_user_id: "@me" }).value!.agents[0].agent_id, first);
  assert.deepEqual(c.listAgents({ archived: true }).value!.agents.map(a => a.agent_id), [second]);
  assert.deepEqual(c.listAgents({ created_by_user_id: "other" }).value!.agents, []);
  const page = c.listAgents({ sort_by: "name", sort_direction: "asc", page_size: 1 }).value!;
  assert.equal(page.agents[0].agent_id, second);
  assert.equal(page.next_cursor, "1");
  assert.equal(page.has_more, true);
  page.agents[0].tags.push("external");
  assert.equal(c.listAgents({ sort_by: "name", sort_direction: "asc", cursor: "1" }).value!.agents[0].agent_id, first);
  assert.deepEqual(c.listAgents({ cursor: "100" }).value, { agents: [], next_cursor: null, has_more: false });
  for (const query of [{ page_size: 0 }, { page_size: 101 }, { page_size: 1.5 }, { cursor: "-1" }, { cursor: "01" }, { cursor: "9007199254740992" }, { sort_by: "call_count_7d" }, { sort_direction: "invalid" }, { unknown: true }]) assert.equal(c.listAgents(query as never).error, "invalid_agent_query");
  const summaries = c.getSummaries([first, "missing"]).value!;
  assert.equal(summaries[first].status, "success");
  assert.equal(summaries.missing.status, "failure");
  if (summaries[first].status === "success") summaries[first].data.name = "external";
  assert.equal(c.getAgent(first)!.name, "Support");
  assert.equal(c.getSummaries([]).error, "invalid_agent_query");
  c.deleteAgent(first);
  assert.equal(c.getSummaries([first]).value![first].status, "failure");
});

test("agent scenarios own baseline defaults, emptying, reset and instance isolation", async () => {
  const runner = await createScenarioRunner();
  const c = runner.loadContext("/convai/agents");
  assert.equal(c.agents.size, 0);
  await runner.run(scenarios.startup);
  const baseline = c.getAgent("sim-agent");
  assert.equal(baseline!.name, "Simulator Support");
  c.createAgent(input());
  await runner.run(scenarios.emptyAgents);
  assert.equal(c.agents.size, 0);
  assert.equal(c.createAgent(input()).value!.agent_id, "sim-agent-created-1");
  await runner.run(scenarios.reset);
  assert.deepEqual(c.getAgent("sim-agent"), baseline);
  assert.equal(c.agents.size, 1);
  const other = await createScenarioRunner();
  await other.run(scenarios.startup);
  c.deleteAgent("sim-agent");
  assert.ok(other.loadContext("/convai/agents").getAgent("sim-agent"));
});

test("agent duplication preserves canonical analysis references independently", async () => {
  const runner = await createScenarioRunner();
  await runner.run(scenarios.startup);
  await runner.run(scenarios.agentAnalysisReferences);
  const c = runner.loadContext("/convai/agents");
  const result = c.duplicateAgent("sim-agent", {});
  assert.equal(result.error, undefined);
  const id = result.value!.agent_id;
  const original = c.getAgent("sim-agent")!;
  assert.deepEqual(c.getAgent(id)!.platform_settings!.analysis_items, original.platform_settings!.analysis_items);
  c.agents.get(id)!.configuration.platform_settings!.analysis_items!.evaluation_criteria = [];
  assert.equal(c.getAgent("sim-agent")!.platform_settings!.analysis_items!.evaluation_criteria!.length, 1);
});
