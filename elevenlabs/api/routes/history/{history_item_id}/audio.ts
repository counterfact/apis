import type { Routes } from "../../../types/index.js";
type Route = Routes["/history"]["/{history_item_id}"]["/audio"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).random();
};
