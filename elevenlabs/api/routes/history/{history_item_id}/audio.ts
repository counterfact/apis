import type { Routes } from "../../../types/index.js";
type Route = Routes["/history"]["/{history_item_id}"]["/audio"];
export const GET: Route["GET"] = async ($) => {
  try {
    return $.x.response.header("content-disposition", 'attachment; filename="history.mp3"').status(200).match("audio/mpeg", Buffer.from($.context.getAudio($.path.history_item_id)));
  } catch (error) {
    if (error instanceof Error && error.name === "HistoryMediaError") {
      const e = error as Error & { status: number; code: string };
      return $.x.response.status(e.status).json({ detail: { status: e.code, message: e.code } });
    }
    throw error;
  }
};
