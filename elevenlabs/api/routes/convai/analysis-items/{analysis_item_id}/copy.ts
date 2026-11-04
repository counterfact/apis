import type { Routes } from "../../../../types/index.js";
type Route =
  Routes["/convai"]["/analysis-items"]["/{analysis_item_id}"]["/copy"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
