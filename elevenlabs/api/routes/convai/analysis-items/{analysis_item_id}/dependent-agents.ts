import type { Routes } from "../../../../types/index.js";
type Route =
  Routes["/convai"]["/analysis-items"]["/{analysis_item_id}"]["/dependent-agents"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).random();
};
