import type { Scenario } from "../types/index.js";
export const emptyAgentLifecycle: Scenario = ($) => {
  const c = $.loadContext("/convai/agents/{agent_id}/branches"),
    agents = $.loadContext("/convai/agents");
  c.agents = () => agents.agents;
  agents.lifecycle = c;
  c.branches = new Map();
  c.versions = new Map();
  c.history = new Map();
  c.nextDeployment = 0;
  c.nextVersion = 0;
  c.nextBranch = 0;
  c.drafts = new Map();
  c.defaults = {
    timeUnix: 1735689600,
    mainName: "main",
    initialDescription: "Initial agent configuration",
  };
  c.validateConfiguration = (configuration) =>
    agents.validateDependencies(configuration);
  for (const a of agents.agents.values()) {
    delete a.configuration.branch_id;
    delete a.configuration.version_id;
    delete a.configuration.main_branch_id;
  }
};

/** A newer live main configuration and an independently changed feature greeting. */
export const branchMergeConflicts: Scenario = ($) => {
  const agent = $.loadContext("/convai/agents").agents.get("sim-agent")!;
  agent.configuration.conversation_config.agent!.first_message = "Main changed greeting";
  agent.configuration.conversation_config.agent!.language = "es";
  agent.configuration.metadata.updated_at_unix_secs = 1735689610;
};

/** Saved feature references and atomic-list conflicts for local merge review. */
export const branchMergeReferences: Scenario = ($) => {
  const lifecycle = $.loadContext("/convai/agents/{agent_id}/branches");
  const procedures = $.loadContext("/convai/agents/{agent_id}/branches/{branch_id}/procedures");
  const source = lifecycle.versions.get("sim-agent-version-feature")!.configuration;
  const published = structuredClone(procedures.versions.get("sim-procedure-version")!);
  published.branchId = "sim-agent-feature";
  published.value.version_id = "sim-procedure-feature-version";
  published.value.name = "Published feature support";
  procedures.versions.set(published.value.version_id!, published);
  source.procedures!["sim-procedure"].version_id = published.value.version_id!;
  source.procedures!["sim-procedure"].name = published.value.name;
  source.conversation_config.agent!.prompt!.tool_ids = ["feature-tool"];
  $.loadContext("/convai/agents").agents.get("sim-agent")!.configuration.conversation_config.agent!.prompt!.tool_ids = ["main-tool"];
};
export const resetAgentLifecycle: Scenario = ($) => {
  emptyAgentLifecycle($);
  const c = $.loadContext("/convai/agents/{agent_id}/branches"),
    record = $.loadContext("/convai/agents").agents.get("sim-agent")!,
    agent = record.configuration;
  const mainId = record.mainBranch!.id,
    mainName = record.mainBranch!.name;
  agent.branch_id = mainId;
  agent.main_branch_id = mainId;
  agent.version_id = "sim-agent-version-main";
  for (const [suffix, name, time] of [
    ["main", "main", 1735689600],
    ["feature", "Feature", 1735689601],
  ] as const) {
    const id = suffix === "main" ? mainId : `sim-agent-${suffix}`,
      versionId = `sim-agent-version-${suffix}`;
    const metadata = {
      id: versionId,
      agent_id: "sim-agent",
      branch_id: id,
      version_description: `Local ${name} snapshot`,
      seq_no_in_branch: 1,
      time_committed_secs: time,
      parents:
        suffix === "main"
          ? {}
          : { out_of_branch_parent_id: "sim-agent-version-main" },
      access_info: structuredClone(agent.access_info),
    };
    const configuration = structuredClone(agent);
    configuration.branch_id = id;
    configuration.version_id = versionId;
    if (suffix === "feature")
      configuration.conversation_config.agent!.first_message =
        "Feature greeting";
    c.versions.set(versionId, { metadata, configuration });
    c.branches.set(id, {
      metadata: {
        id,
        name: suffix === "main" ? mainName : name,
        agent_id: "sim-agent",
        description: `Local ${name} branch`,
        created_at: time,
        last_committed_at: time,
        is_archived: false,
        protection_status: "writer_perms_required",
        auto_rebase: false,
        access_info: structuredClone(agent.access_info),
      },
      tip: versionId,
      draftCreatedAt: suffix === "feature" ? time : null,
      parentBranchId: suffix === "main" ? null : mainId,
    });
  }
  c.history.set("sim-agent", [
    {
      id: "sim-deployment",
      traffic_percentage_branch_id_map: { [mainId]: 100 },
      deployed_at_unix_secs: 1735689600,
      is_active: true,
      source: "manual",
      access_info: structuredClone(agent.access_info),
    },
  ]);
};
