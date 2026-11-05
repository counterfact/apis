import type { Routes } from "../../../types/index.js";
type Route = Routes["/workspace"]["/groups"]["/search"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).json($.context.searchGroups($.query.name));
};
