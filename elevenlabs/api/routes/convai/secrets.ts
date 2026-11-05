import type { Routes } from "../../types/index.js";
type Route = Routes["/convai"]["/secrets"];
export const POST: Route["POST"] = async ($) => {
  const result = $.context.createSecret($.body);
  if (result.error) return $.x.response.status(400).empty();
  return $.response.status(200).json(result.value);
};
export const GET: Route["GET"] = async ($) => {
  const result = $.context.listSecrets($.query);
  if (result.error) return $.x.response.status(400).empty();
  return $.response.status(200).json(result.value);
};
