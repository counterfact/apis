import type { Routes } from "../../../types/index.js";
type Route = Routes["/convai"]["/secrets"]["/{secret_id}"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).random();
};
export const DELETE: Route["DELETE"] = async ($) => {
  return $.response.status(204).empty();
};
export const PATCH: Route["PATCH"] = async ($) => {
  return $.response.status(200).random();
};
