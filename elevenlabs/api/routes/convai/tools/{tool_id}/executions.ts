import type { Routes } from "../../../../types/index.js";
type Route = Routes["/convai"]["/tools"]["/{tool_id}"]["/executions"];
export const GET: Route["GET"] = async ($) => {
  const result = $.context.listExecutions($.path.tool_id, $.query);
  if (result.error) return $.x.response.status(result.error === "tool_not_found" ? 404 : 400).json({ detail: { status: result.error } });
  return $.response.status(200).json(result.value);
};
