import type { Routes } from "../../types/index.js";
type Route = Routes["/convai"]["/environments"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).json($.context.listEnvironments());
};
export const POST: Route["POST"] = async ($) => {
  const result = $.context.createEnvironment($.body);
  if (result.error) return $.response.status(result.error === "environment_conflict" ? 409 : 400).empty();
  return $.response.status(200).json(result.value);
};
