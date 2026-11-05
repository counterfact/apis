import type { Context } from "./history/_.context.js";
import type { Routes } from "../../types/index.js";
type Route = Routes["/audio-isolation"]["/history"];
export const GET: Route["GET"] = async ($) => {
  try {
    return $.response
      .status(200)
      .json(($.context as unknown as Context).list($.query));
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
