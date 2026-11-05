import type { Routes } from "../../types/index.js";
type Route = Routes["/convai"]["/tools"];
export const POST: Route["POST"] = async ($) => {
  const result = $.context.createTool($.body);
  if (result.error) return $.x.response.status(400).json({ detail: { status: result.error } });
  return $.response.status(200).json(result.value);
};
export const GET: Route["GET"] = async ($) => {
  const result = $.context.listTools($.query);
  if (result.error) return $.x.response.status(400).json({ detail: { status: result.error } });
  return $.response.status(200).json(result.value);
};
