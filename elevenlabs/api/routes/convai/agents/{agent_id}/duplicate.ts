import type { Routes } from "../../../../types/index.js";
type Route = Routes["/convai"]["/agents"]["/{agent_id}"]["/duplicate"];
export const POST: Route["POST"] = async ($) => {
  const result = $.context.duplicateAgent($.path.agent_id, $.body);
  if (result.error) return $.x.response.status(result.error === "agent_not_found" ? 404 : 400).json({ detail: { status: result.error, message: result.error === "agent_not_found" ? "Agent not found" : "Invalid duplicate name" } });
  return $.response.status(200).json(result.value);
};
