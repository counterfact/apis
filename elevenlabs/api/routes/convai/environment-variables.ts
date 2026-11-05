import type { Routes } from "../../types/index.js";
type Route = Routes["/convai"]["/environment-variables"];
export const GET: Route["GET"] = async ($) => {
  const result = $.context.listVariables($.query);
  if (result.error) return $.response.status(400).empty();
  return $.response.status(200).json(result.value);
};
export const POST: Route["POST"] = async ($) => {
  const result = $.context.createVariable($.body);
  if (result.error) return $.response.status(result.error === "environment_variable_label_conflict" ? 409 : 400).empty();
  return $.response.status(200).json(result.value);
};
