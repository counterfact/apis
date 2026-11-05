import type { Scenario } from "../types/index.js";
export const emptyAgentMergeProposals: Scenario = ($) => {
  const c = $.loadContext("/convai/agents/{agent_id}/merge-proposals");
  c.records = new Map();
  c.nextProposal = 0;
  c.nextComment = 0;
  c.nextMutation = 0;
  c.agents = () => $.loadContext("/convai/agents").agents;
  c.lifecycle = $.loadContext("/convai/agents/{agent_id}/branches");
  c.defaults = { userId: "sim-user", time: 1735689700 };
};
export const resetAgentMergeProposals: Scenario = ($) => {
  emptyAgentMergeProposals($);
  const c = $.loadContext("/convai/agents/{agent_id}/merge-proposals");
  const a = $.loadContext("/convai/agents").agents.get("sim-agent")!;
  c.records.set("sim-merge-proposal", {
    id: "sim-merge-proposal",
    agent_id: "sim-agent",
    source_branch_id: "sim-agent-feature",
    target_branch_id: a.mainBranch!.id,
    source_tip_version_id_at_creation: "sim-agent-version-feature",
    title: "Review local greeting",
    description: "Synthetic local proposal; no merge has run.",
    requested_reviewer_user_ids: [],
    reviews: [],
    comments: [],
    outcome: { status: "open" },
    created_at: 1735689700,
    updated_at: 1735689700,
    author_user_id: "sim-user",
    access_info: structuredClone(a.configuration.access_info),
  });
};
