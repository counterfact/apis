import type { Routes } from "../../../types/index.js";
type Route = Routes["/convai"]["/environments"]["/{environment}"];
export const DELETE: Route["DELETE"] = async ($) => {
  const error = $.context.deleteEnvironment($.path.environment);
  if (error) return $.response.status(error === "environment_not_found" ? 404 : 400).empty();
  return $.response.status(204).empty();
};
