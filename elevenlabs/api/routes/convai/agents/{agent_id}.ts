import type { Routes } from "../../../types/index.js";
type Route = Routes["/convai"]["/agents"]["/{agent_id}"];
export const GET: Route["GET"] = async ($) => {
  if ($.query.branch_id != null || $.query.version_id != null || $.query.include_procedure_generated_workflow_elements === true) return $.x.response.status(400).json({ detail: { status: "unsupported_agent_selector", message: "Branches, versions and generated workflows are not simulated" } });
  const agent = $.context.getAgent($.path.agent_id);
  if (!agent) return $.x.response.status(404).json({ detail: { status: "agent_not_found", message: "Agent not found" } });
  return $.response.status(200).json(agent);
};
export const PATCH: Route["PATCH"] = async ($) => {
  return $.response.status(200).random();
};
export const DELETE: Route["DELETE"] = async ($) => {
  if ($.query.force) return $.x.response.status(400).json({ detail: { status: "unsupported_agent_selector", message: "Subagent dependency cleanup is not simulated" } });
  if (!$.context.deleteAgent($.path.agent_id)) return $.x.response.status(404).json({ detail: { status: "agent_not_found", message: "Agent not found" } });
  return $.response.status(204).empty();
};
