import assert from "node:assert/strict";
import test from "node:test";
import { createScenarioRunner } from "../test-support/scenarios.js";
import { createDispatcherHarness } from "../test-support/dispatcher.js";
import * as scenarios from "../api/scenarios/index.js";

test("agent lifecycle context preserves canonical references and validates metadata atomically", async () => {
  const r = await createScenarioRunner();
  await r.run(scenarios.startup);
  const c = r.loadContext("/convai/agents/{agent_id}/branches");
  assert.equal(c.list("sim-agent", {}).results.length, 2);
  assert.throws(() => c.list("sim-agent", { limit: 1 }));
  assert.throws(() => c.list("sim-agent", { limit: 101 }));
  assert.equal(
    c.select("sim-agent", { branch_id: "sim-agent-feature" })
      .conversation_config.agent!.first_message,
    "Feature greeting",
  );
  const agents = r.loadContext("/convai/agents");
  await r.run(scenarios.agentAnalysisReferences);
  assert.equal(
    c.select("sim-agent", { branch_id: "sim-main-branch" }).platform_settings!
      .analysis_items!.evaluation_criteria![0].analysis_item_id,
    "sim-analysis-evaluation",
  );
  assert.equal(
    c.select("sim-agent", { version_id: "sim-agent-version-main" })
      .platform_settings!.analysis_items,
    undefined,
  );
  const copy = c.get("sim-agent", "sim-agent-feature");
  copy.name = "Changed";
  assert.equal(c.get("sim-agent", "sim-agent-feature").name, "Feature");
  c.update("sim-agent", "sim-agent-feature", {
    name: "Review",
    description: "",
    protection_status: "admin_perms_required",
  });
  assert.equal(c.get("sim-agent", "sim-agent-feature").name, "Review");
  assert.throws(() =>
    c.update("sim-agent", "sim-agent-feature", { name: "main" }),
  );
  assert.throws(() =>
    c.update("sim-agent", "sim-main-branch", { auto_rebase: true }),
  );
  assert.throws(() =>
    c.update("sim-agent", "sim-main-branch", { is_archived: true }),
  );
  assert.throws(() =>
    c.deploy("sim-agent", {
      deployment_request: {
        requests: [
          {
            branch_id: "sim-agent-feature",
            deployment_strategy: { traffic_percentage: 80 },
          },
        ],
      },
    }),
  );
  assert.equal(c.deployments("sim-agent", {}).results.length, 1);
  c.deploy("sim-agent", {
    deployment_request: {
      requests: [
        {
          branch_id: "sim-main-branch",
          deployment_strategy: { traffic_percentage: 25 },
        },
        {
          branch_id: "sim-agent-feature",
          deployment_strategy: { traffic_percentage: 75 },
        },
      ],
    },
  });
  assert.equal(
    c.get("sim-agent", "sim-agent-feature").current_live_percentage,
    75,
  );
  assert.equal(
    c.deployments("sim-agent", {}).results.filter((x) => x.is_active).length,
    1,
  );
  assert.throws(() =>
    c.update("sim-agent", "sim-agent-feature", { is_archived: true }),
  );
  c.deleteDraft("sim-agent", "sim-agent-feature");
  assert.equal(
    c.list("sim-agent", {}).results.find((x) => x.id === "sim-agent-feature")!
      .draft_exists,
    false,
  );
  const duplicate = agents.duplicateAgent("sim-agent", {});
  const copied = agents.getAgent(duplicate.value!.agent_id)!;
  assert.ok(copied.branch_id);
  assert.equal(c.list(duplicate.value!.agent_id, {}).results.length, 1);
  assert.deepEqual(
    c.select(copied.agent_id, { version_id: copied.version_id }),
    copied,
  );
  assert.equal(
    r
      .loadContext("/convai/agents/{agent_id}/branches/{branch_id}/procedures")
      .get(copied.agent_id, copied.branch_id!, "sim-procedure").name,
    "Published support",
  );
  agents.deleteAgent("sim-agent");
  assert.throws(() => c.list("sim-agent", {}));
  await r.run(scenarios.reset);
  assert.equal(c.list("sim-agent", {}).results.length, 2);
});

test("validated Dispatcher supports branch metadata, selection, deployment history and draft removal", async () => {
  const h = await createDispatcherHarness();
  const req = async (
    path: string,
    method = "GET",
    body?: unknown,
    status = 200,
  ) => {
    const x = await h.request(`/v1/convai/agents/sim-agent${path}`, {
      method,
      ...(body === undefined
        ? {}
        : {
            body: JSON.stringify(body),
            headers: { "content-type": "application/json" },
          }),
    });
    assert.equal(x.status, status);
    return x;
  };
  assert.equal((await (await req("/branches")).json()).results.length, 2);
  assert.equal(
    (await (await req("?branch_id=sim-agent-feature")).json())
      .conversation_config.agent!.first_message,
    "Feature greeting",
  );
  assert.equal(
    (await (await req("?version_id=sim-agent-version-main")).json()).branch_id,
    "sim-main-branch",
  );
  await req("?branch_id=missing", "GET", undefined, 404);
  await req(
    "?branch_id=sim-agent-feature&version_id=sim-agent-version-main",
    "GET",
    undefined,
    400,
  );
  assert.equal(
    (await (await req("/versions/sim-agent-version-feature")).json()).branch_id,
    "sim-agent-feature",
  );
  await req("/branches/sim-agent-feature", "PATCH", { name: "Renamed" });
  assert.equal(
    (await (await req("/branches/sim-agent-feature")).json()).name,
    "Renamed",
  );
  await req("/branches/sim-agent-feature", "PATCH", { name: "main" }, 409);
  await req("/deployments", "POST", {
    deployment_request: {
      requests: [
        {
          branch_id: "sim-main-branch",
          deployment_strategy: { traffic_percentage: 50 },
        },
        {
          branch_id: "sim-agent-feature",
          deployment_strategy: { traffic_percentage: 50 },
        },
      ],
    },
  });
  const history = await (await req("/deployments?page_size=1")).json();
  assert.equal(history.results.length, 1);
  assert.equal(history.results[0].is_active, true);
  assert.equal(
    (await (await req("/branches/sim-agent-feature")).json())
      .current_live_percentage,
    50,
  );
  await req(
    "/deployments",
    "POST",
    { deployment_request: { requests: [] } },
    400,
  );
  await req("/deployments?page=0", "GET", undefined, 400);
  await req("/branches?limit=0", "GET", undefined, 400);
  await req("/drafts?branch_id=sim-agent-feature", "DELETE");
  assert.equal(
    (await (await req("/branches")).json()).results.find(
      (x: { id: string }) => x.id === "sim-agent-feature",
    )!.draft_exists,
    false,
  );
  await h.scenario("reset");
  assert.equal(
    (await (await req("/branches/sim-agent-feature")).json()).name,
    "Feature",
  );
  const other = await createDispatcherHarness();
  assert.equal(
    (await other.request("/v1/convai/agents/sim-agent/branches")).status,
    200,
  );
  await req("", "DELETE", undefined, 204);
  await req("/branches", "GET", undefined, 404);
});

test("canonical branch names and references stay live while snapshots remain isolated", async () => {
  const r = await createScenarioRunner();
  await r.run(scenarios.startup);
  const c = r.loadContext("/convai/agents/{agent_id}/branches");
  const agents = r.loadContext("/convai/agents");
  await r.run(scenarios.agentAnalysisReferences);
  await r.run(scenarios.knowledgeBaseReferences);
  await r.run(scenarios.mcpAgentReference);
  await r.run(scenarios.toolDiscovery);
  const main = c.select("sim-agent", { branch_id: "sim-main-branch" });
  assert.deepEqual(main.conversation_config.agent!.prompt!.tool_ids, [
    "sim-tool",
  ]);
  assert.deepEqual(main.conversation_config.agent!.prompt!.mcp_server_ids, [
    "sim-mcp",
  ]);
  assert.equal(
    main.conversation_config.agent!.prompt!.knowledge_base![0].id,
    "sim-kb-text",
  );
  const snapshot = c.select("sim-agent", {
    version_id: "sim-agent-version-main",
  });
  assert.deepEqual(snapshot.conversation_config.agent!.prompt!.tool_ids, []);
  assert.equal(
    snapshot.conversation_config.agent!.prompt!.knowledge_base,
    undefined,
  );
  main.conversation_config.agent!.prompt!.tool_ids!.push("mutated");
  assert.deepEqual(
    c.select("sim-agent", {}).conversation_config.agent!.prompt!.tool_ids,
    ["sim-tool"],
  );
  r.loadContext("/convai/knowledge-base").deleteDocument("sim-kb-text", true);
  assert.deepEqual(
    c.select("sim-agent", { branch_id: "sim-main-branch" }).conversation_config
      .agent!.prompt!.knowledge_base,
    [],
  );
  c.update("sim-agent", "sim-main-branch", { name: "Renamed main" });
  assert.equal(
    r
      .loadContext("/convai/analysis-items")
      .dependentAgents("sim-analysis-evaluation").branches![0].branch_name,
    "Renamed main",
  );
  assert.equal(
    c.get("sim-agent", "sim-agent-feature").parent_branch!.name,
    "Renamed main",
  );
  await r.run(scenarios.agentMainBranchPreview);
  assert.equal(c.get("sim-agent", "sim-main-branch").name, "Preview main");
  assert.throws(
    () => c.update("sim-agent", "sim-agent-feature", { name: "Preview main" }),
    { code: "branch_name_conflict" },
  );
  const before = c.get("sim-agent", "sim-agent-feature");
  assert.throws(() =>
    c.update("sim-agent", "sim-agent-feature", {
      name: "Changed",
      auto_rebase: true,
    }),
  );
  assert.deepEqual(c.get("sim-agent", "sim-agent-feature"), before);
  c.update("sim-agent", "sim-agent-feature", {
    name: null,
    description: null,
    auto_rebase: null,
  });
  assert.deepEqual(c.get("sim-agent", "sim-agent-feature"), before);
  c.update("sim-agent", "sim-agent-feature", { is_archived: true });
  assert.equal(c.list("sim-agent").results.length, 1);
  assert.equal(
    c.list("sim-agent", { include_archived: true }).results.length,
    2,
  );
  const history = c.deployments("sim-agent");
  assert.throws(() =>
    c.deploy("sim-agent", {
      deployment_request: {
        requests: [
          {
            branch_id: "sim-agent-feature",
            deployment_strategy: { traffic_percentage: 100 },
          },
        ],
      },
    }),
  );
  assert.deepEqual(c.deployments("sim-agent"), history);
  const other = agents.duplicateAgent("sim-agent", {}).value!.agent_id;
  assert.throws(
    () => c.select(other, { version_id: "sim-agent-version-main" }),
    { code: "version_not_found" },
  );
  assert.throws(() => c.get(other, "sim-main-branch"), {
    code: "branch_not_found",
  });
  await r.run(scenarios.emptyAgentLifecycle);
  assert.deepEqual(c.list("sim-agent").results, []);
  assert.equal(
    agents.agents.get("sim-agent")!.mainBranch!.id,
    "sim-main-branch",
  );
  await r.run(scenarios.reset);
  assert.equal(c.get("sim-agent", "sim-main-branch").name, "main");
});

test("Dispatcher main branch rename updates analysis dependencies and archive filters", async () => {
  const h = await createDispatcherHarness();
  await h.scenario("agentAnalysisReferences");
  const base = "/v1/convai/agents/sim-agent";
  const patch = async (id: string, body: unknown, status = 200) => {
    const response = await h.request(`${base}/branches/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    assert.equal(response.status, status);
    return response;
  };
  await patch("sim-main-branch", { name: "Dashboard main" });
  const deps = await h.request(
    "/v1/convai/analysis-items/sim-analysis-evaluation/dependent-agents",
  );
  assert.equal(deps.status, 200);
  assert.equal((await deps.json()).branches[0].branch_name, "Dashboard main");
  await h.scenario("agentMainBranchPreview");
  assert.equal(
    (await (await h.request(`${base}/branches/sim-main-branch`)).json()).name,
    "Preview main",
  );
  await patch("sim-agent-feature", { is_archived: true });
  assert.equal(
    (await (await h.request(`${base}/branches`)).json()).results.length,
    1,
  );
  assert.equal(
    (await (await h.request(`${base}/branches?include_archived=true`)).json())
      .results.length,
    2,
  );
  await patch("sim-agent-feature", { name: "Preview main" }, 409);
  await patch("sim-main-branch", { auto_rebase: true }, 400);
  assert.equal(
    (await h.request(`${base}/branches?include_commit_status=true`)).status,
    400,
  );
  assert.equal((await h.request(`${base}/branches?limit=101`)).status, 400);
  await h.scenario("reset");
  assert.equal(
    (await (await h.request(`${base}/branches/sim-main-branch`)).json()).name,
    "main",
  );
});
