import type { Routes } from "../../../types/index.js";
type Route = Routes["/workspace"]["/auth-connections"]["/{auth_connection_id}"];
export const PATCH: Route["PATCH"] = async ($) => {
  return $.response.status(200).random();
};
export const DELETE: Route["DELETE"] = async ($) => {
  return $.response.status(200).random();
};
