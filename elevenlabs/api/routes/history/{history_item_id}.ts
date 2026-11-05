import type { Routes } from "../../types/index.js";
type Route = Routes["/history"]["/{history_item_id}"];
export const GET: Route["GET"] = async ($) => {
  const item = $.context.getHistoryItem($.path.history_item_id);
  if (!item) {
    return $.x.response.status(404).json({
      detail: { status: "history_item_not_found", message: "History item not found" },
    });
  }
  return $.response.status(200).json(item);
};

export const DELETE: Route["DELETE"] = async ($) => {
  if (!$.context.deleteHistoryItem($.path.history_item_id)) {
    return $.x.response.status(404).json({
      detail: { status: "history_item_not_found", message: "History item not found" },
    });
  }
  return $.response.status(200).json({ status: "ok" });
};
