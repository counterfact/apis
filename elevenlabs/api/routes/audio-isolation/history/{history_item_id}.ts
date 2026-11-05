import type { Routes } from "../../../types/index.js";
type Route = Routes["/audio-isolation"]["/history"]["/{history_item_id}"];
export const DELETE: Route["DELETE"] = async ($) => {
  try {
    $.context.delete($.path.history_item_id);
    return $.response.status(204).empty();
  } catch (error) {
    if (error instanceof Error && error.name === "IsolationHistoryError") {
      const e = error as Error & { status: number; code: string };
      return $.x.response
        .status(e.status)
        .json({ detail: { status: e.code, message: e.message } });
    }
    throw error;
  }
};
