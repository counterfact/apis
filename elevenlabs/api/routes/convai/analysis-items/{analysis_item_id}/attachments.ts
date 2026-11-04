import type { Routes } from "../../../../types/index.js";
type Route =
  Routes["/convai"]["/analysis-items"]["/{analysis_item_id}"]["/attachments"];
export const PATCH: Route["PATCH"] = async ($) => {
  return $.response.status(200).random();
};
