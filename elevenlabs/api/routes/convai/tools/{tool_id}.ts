import type { Routes } from "../../../types/index.js";
type Route = Routes["/convai"]["/tools"]["/{tool_id}"];
export const GET: Route["GET"] = async ($) => {
  const tool = $.context.getTool($.path.tool_id);
  if (!tool) return $.x.response.status(404).json({ detail: { status: "tool_not_found" } });
  return $.response.status(200).json(tool);
};
export const PATCH: Route["PATCH"] = async ($) => {
  const result = $.context.updateTool($.path.tool_id, $.body);
  if (result.error) return $.x.response.status(result.error === "tool_not_found" ? 404 : 400).json({ detail: { status: result.error } });
  return $.response.status(200).json(result.value);
};
export const DELETE: Route["DELETE"] = async ($) => {
  const result = $.context.deleteTool($.path.tool_id, $.query.force);
  if (result.error) return $.x.response.status(result.error === "tool_not_found" ? 404 : result.error === "tool_in_use" ? 409 : 400).json({ detail: { status: result.error } });
  return $.response.status(200).json({});
};
