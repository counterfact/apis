import type { Scenario } from "../types/index.js";
export const emptyAgentProcedures: Scenario = ($) => {
  const c = $.loadContext(
    "/convai/agents/{agent_id}/branches/{branch_id}/procedures",
  );
  const lifecycle = $.loadContext("/convai/agents/{agent_id}/branches");
  c.lifecycle = lifecycle;
  c.versions = new Map();
  c.working = new Map();
  c.nextProcedure = 0;
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
