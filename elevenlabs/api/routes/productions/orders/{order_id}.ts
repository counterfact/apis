import type { Routes } from "../../../types/index.js";
type Route = Routes["/productions"]["/orders"]["/{order_id}"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).random();
};
export const PATCH: Route["PATCH"] = async ($) => {
  return $.response.status(200).random();
};
