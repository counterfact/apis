import type { Routes } from "../../../../../types/index.js";
type Route = Routes["/convai"]["/secrets"]["/{secret_id}"]["/dependencies"]["/{resource_type}"];
export const GET: Route["GET"] = async ($) => {
  const result = $.context.getDependencies($.path.secret_id, $.path.resource_type, $.query);
  if (result.error) return $.x.response.status(result.error === "secret_not_found" ? 404 : 400).empty();
  return $.response.status(200).json(result.value);
};
