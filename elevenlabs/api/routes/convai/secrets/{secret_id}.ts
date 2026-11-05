import type { Routes } from "../../../types/index.js";
type Route = Routes["/convai"]["/secrets"]["/{secret_id}"];
export const GET: Route["GET"] = async ($) => {
  const item = $.context.getSecret($.path.secret_id);
  if (!item) return $.x.response.status(404).empty();
  return $.response.status(200).json(item);
};
export const DELETE: Route["DELETE"] = async ($) => {
  const error = $.context.deleteSecret($.path.secret_id);
  if (error) return $.x.response.status(error === "secret_not_found" ? 404 : 409).empty();
  return $.response.status(204).empty();
};
export const PATCH: Route["PATCH"] = async ($) => {
  const result = $.context.updateSecret($.path.secret_id, $.body);
  if (result.error) return $.x.response.status(result.error === "secret_not_found" ? 404 : 400).empty();
  return $.response.status(200).json(result.value);
};
