import type { Routes } from "../../../types/index.js";
type Route = Routes["/convai"]["/environment-variables"]["/{env_var_id}"];
export const GET: Route["GET"] = async ($) => {
  const item = $.context.getVariable($.path.env_var_id);
  if (!item) return $.response.status(404).empty();
  return $.response.status(200).json(item);
};
export const PATCH: Route["PATCH"] = async ($) => {
  const result = $.context.updateVariable($.path.env_var_id, $.body);
  if (result.error) return $.response.status(result.error === "environment_variable_not_found" ? 404 : 400).empty();
  return $.response.status(200).json(result.value);
};
export const DELETE: Route["DELETE"] = async ($) => {
  if (!$.context.deleteVariable($.path.env_var_id)) return $.response.status(404).empty();
  return $.response.status(204).empty();
};
