import type { Routes } from "../../types/index.js";
type Route = Routes["/history"]["/download"];
export const POST: Route["POST"] = async ($) => {
  try {
    return $.x.response.header("content-disposition", 'attachment; filename="history.zip"').status(200).match("application/zip", Buffer.from($.context.download($.body)));
  } catch (error) {
    if (error instanceof Error && error.name === "HistoryMediaError") {
      const e = error as Error & { status: number; code: string };
      return $.x.response.status(e.status).json({ detail: { status: e.code, message: e.code } });
    }
    throw error;
  }
};
