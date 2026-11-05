import type { Context } from "./environment-variables/_.context.js";
import type { Routes } from "../../types/index.js";
type Route = Routes["/convai"]["/environment-variables"];
export const GET: Route["GET"] = async ($) => {
  // Collection handler typing uses the parent; runtime resolves the nested context.
  const result = ($.x.context as Context).listVariables($.query);
  if (result.error) return $.response.status(400).empty();
  return $.response.status(200).json(result.value);
};
export const POST: Route["POST"] = async ($) => {
  const result = ($.x.context as Context).createVariable($.body);
  if (result.error) return $.response.status(result.error === "environment_variable_label_conflict" ? 409 : 400).empty();
  return $.response.status(200).json(result.value);
};
