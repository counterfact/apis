import type { Scenario } from "../types/index.js";
export const emptyAgentProcedures: Scenario = ($) => {
  const c = $.loadContext(
    "/convai/agents/{agent_id}/branches/{branch_id}/procedures",
  );
  const lifecycle = $.loadContext("/convai/agents/{agent_id}/branches");
  c.lifecycle = lifecycle;
  c.compilationFixtures = [];
  c.versions = new Map();
  c.working = new Map();
  c.nextProcedure = 0;
  c.nextPublishedVersion = 0;
  lifecycle.procedures = () => c;
  lifecycle.clearProcedureDrafts = (agentId, branchId) =>
    c.clearBranchDrafts(agentId, branchId);
  for (const record of $.loadContext("/convai/agents").agents.values())
    delete record.configuration.procedures;
  for (const version of lifecycle.versions.values())
    delete version.configuration.procedures;
};
export const resetAgentProcedures: Scenario = ($) => {
  emptyAgentProcedures($);
  const c = $.loadContext(
    "/convai/agents/{agent_id}/branches/{branch_id}/procedures",
  );
  const lifecycle = $.loadContext("/convai/agents/{agent_id}/branches");
  const agent = $.loadContext("/convai/agents").agents.get("sim-agent")!;
  const branchId = agent.mainBranch!.id;
  const value = {
    procedure_id: "sim-procedure",
    version_id: "sim-procedure-version",
    name: "Published support",
    content: "Stored local support instructions.",
    type: "free_form" as const,
    trigger: "When support is requested",
    folder_parent_id: null,
  };
  const { content: _, ...ref } = value;
  c.versions.set(value.version_id, {
    agentId: "sim-agent",
    branchId,
    value,
    handoffs: [],
    referencesKnown: true,
  });
  agent.configuration.procedures = { "sim-procedure": structuredClone(ref) };
  for (const versionId of [
    "sim-agent-version-main",
    "sim-agent-version-feature",
  ]) {
    lifecycle.versions.get(versionId)!.configuration.procedures = {
      "sim-procedure": structuredClone(ref),
    };
  }
  for (const fixtureBranch of [branchId, "sim-agent-feature"]) {
    c.compilationFixtures.push({
      agentId: "sim-agent", branchId: fixtureBranch,
      procedures: [{ procedure_id: "sim-procedure", name: "Published support",
        content: "Stored local support instructions.", type: "free_form",
        trigger: "When support is requested", folder_parent_id: null }],
      workflow: {
        nodes: {
          start: { type: "start", position: { x: 0, y: 0 }, edge_order: ["enter"] },
          support: { type: "override_agent", position: { x: 0, y: 100 }, edge_order: ["finish"], conversation_config: {}, additional_prompt: "Stored local support instructions.", additional_knowledge_base: [], additional_tool_ids: [], label: "Published support", entry_behavior: "auto" },
          end: { type: "end", position: { x: 0, y: 200 }, edge_order: [], outcome: "success" },
        },
        edges: { enter: { source: "start", target: "support", forward_condition: { type: "unconditional", label: null }, backward_condition: null, reroutes: [] }, finish: { source: "support", target: "end", forward_condition: { type: "unconditional", label: null }, backward_condition: null, reroutes: [] } },
        prevent_subagent_loops: false,
      },
    });
  }
};

/** Explicit local handoffs for folder-cascade picker flows; no content analysis. */
export const procedureFolderReferences: Scenario = ($) => {
  const c = $.loadContext(
    "/convai/agents/{agent_id}/branches/{branch_id}/procedures",
  );
  const lifecycle = $.loadContext("/convai/agents/{agent_id}/branches");
  const agent = $.loadContext("/convai/agents").agents.get("sim-agent")!;
  const branchId = agent.mainBranch!.id;
  const refs = (agent.configuration.procedures ??= {});
  for (const [id, type, parent] of [
    ["sim-procedure-folder", "folder", null],
    ["sim-procedure-child", "free_form", "sim-procedure-folder"],
  ] as const) {
    const versionId = `${id}-version`;
    const value = {
      procedure_id: id,
      version_id: versionId,
      name: id,
      content: "",
      type,
      trigger: "",
      folder_parent_id: parent,
    };
    c.versions.set(versionId, {
      agentId: "sim-agent",
      branchId,
      value,
      handoffs: [],
      referencesKnown: true,
    });
    const { content: _, ...ref } = value;
    refs[id] = ref;
  }
  const source = structuredClone(c.versions.get("sim-procedure-version")!);
  source.value.version_id = "sim-procedure-handoff-version";
  source.handoffs = ["sim-procedure-child"];
  c.versions.set("sim-procedure-handoff-version", source);
  refs["sim-procedure"] = {
    ...refs["sim-procedure"]!,
    version_id: "sim-procedure-handoff-version",
  };
  lifecycle.versions.get("sim-agent-version-main")!.configuration.procedures =
    structuredClone(refs);
};

/** Synthetic configured draft and exact outcome, with no semantic content analysis. */
export const procedureCompilationDraft: Scenario = ($) => {
  const c = $.loadContext("/convai/agents/{agent_id}/branches/{branch_id}/procedures");
  c.updateDraft("sim-agent", "sim-main-branch", "sim-procedure", {
    name: "Draft support", content: "Configured local support draft.",
    type: "free_form", trigger: "When support is requested",
  });
  c.compilationFixtures = c.compilationFixtures.filter((f) =>
    f.branchId !== "sim-main-branch" || f.procedures[0]?.name !== "Draft support");
  c.compilationFixtures.push({
    agentId: "sim-agent", branchId: "sim-main-branch",
    procedures: [{ procedure_id: "sim-procedure", name: "Draft support",
      content: "Configured local support draft.", type: "free_form",
      trigger: "When support is requested", folder_parent_id: null }],
    workflow: {
      nodes: {
        start: { type: "start", position: { x: 0, y: 0 }, edge_order: ["enter"] },
        support: { type: "override_agent", position: { x: 0, y: 100 }, edge_order: ["finish"], conversation_config: {}, additional_prompt: "Configured local support draft.", additional_knowledge_base: [], additional_tool_ids: [], label: "Draft support", entry_behavior: "auto" },
        end: { type: "end", position: { x: 0, y: 300 }, edge_order: [], outcome: "success" },
      },
      edges: { enter: { source: "start", target: "support", forward_condition: { type: "unconditional", label: null }, backward_condition: null, reroutes: [] }, finish: { source: "support", target: "end", forward_condition: { type: "unconditional", label: null }, backward_condition: null, reroutes: [] } },
      prevent_subagent_loops: false,
    },
  });
};
