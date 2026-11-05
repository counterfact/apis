import type { Context } from "./environments/_.context.js";
import type { Routes } from "../../types/index.js";
type Route = Routes["/convai"]["/environments"];
export const GET: Route["GET"] = async ($) => {
  // Collection handler typing uses the parent; runtime resolves the nested context.
  return $.response.status(200).json(($.x.context as Context).listEnvironments());
};
export const POST: Route["POST"] = async ($) => {
  const result = ($.x.context as Context).createEnvironment($.body);
  if (result.error) return $.response.status(result.error === "environment_conflict" ? 409 : 400).empty();
  return $.response.status(200).json(result.value);
};
