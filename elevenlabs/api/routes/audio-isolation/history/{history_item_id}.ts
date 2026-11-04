import type { Routes } from "../../../types/index.js";
type Route = Routes["/audio-isolation"]["/history"]["/{history_item_id}"];
export const DELETE: Route["DELETE"] = async ($) => {
  return $.response.status(204).empty();
};
