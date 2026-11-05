import type { Scenario } from "../types/index.js";

export const emptyTools: Scenario = ($) => {
  const context = $.loadContext("/convai/tools");
  context.tools = new Map();
  context.executions = [];
  context.currentUserId = "sim-user";
  context.nextToolId = 1;
  context.mutationTime = 1735689602;
  context.creatorAccess = { is_creator: true, creator_name: "Simulator", creator_email: "sim@example.invalid", role: "admin" };
  context.agentsMap = () => $.loadContext("/convai/agents").agents;
};
export const resetTools: Scenario = ($) => {
  emptyTools($);
  const context = $.loadContext("/convai/tools");
  context.tools.set("sim-tool", { creatorUserId: "sim-user", createdAt: 1735689600, configuration: {
    id: "sim-tool", tool_config: { type: "client", name: "display_help", description: "Display a synthetic help card in the client. No tool is executed.", expects_response: false, response_timeout_secs: 20 },
    access_info: { is_creator: true, creator_name: "Simulator", creator_email: "sim@example.invalid", role: "admin" },
    usage_stats: { total_calls: 2, avg_latency_secs: 0.25 },
  } });
  context.executions = [
    { id: "sim-execution-1", tool_id: "sim-tool", tool_request_id: "sim-request-1", conversation_id: "sim-conversation-1", agent_id: "sim-agent", timestamp: 1735689600, latency_secs: 0.2, is_error: false, request_payload: '{"topic":"help"}', response_payload: '{"displayed":true}' },
    { id: "sim-execution-2", tool_id: "sim-tool", tool_request_id: "sim-request-2", conversation_id: "sim-conversation-2", agent_id: "sim-agent", timestamp: 1735689601, latency_secs: 0.3, is_error: true, request_payload: '{"topic":"help"}', error_message: "Synthetic client timeout", error_type: "client_timeout" },
  ];
};
/** Add discovery configuration and a real reference without changing baseline agents. */
export const toolDiscovery: Scenario = ($) => {
  const context = $.loadContext("/convai/tools");
  context.tools.set("sim-tool-secondary", { creatorUserId: "sim-user", createdAt: 1735689601, configuration: {
    id: "sim-tool-secondary", tool_config: { type: "client", name: "show_summary", description: "Display a synthetic summary card.", expects_response: false },
    access_info: { is_creator: true, creator_name: "Simulator", creator_email: "sim@example.invalid", role: "admin" }, usage_stats: { total_calls: 0, avg_latency_secs: 0 },
  } });
  const agent = $.loadContext("/convai/agents").agents.get("sim-agent");
  if (agent?.configuration.conversation_config.agent?.prompt) agent.configuration.conversation_config.agent.prompt.tool_ids = ["sim-tool"];
};
