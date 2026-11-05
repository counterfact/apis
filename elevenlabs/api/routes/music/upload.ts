import type { Routes } from "../../types/index.js";
type Route = Routes["/music"]["/upload"];
export const POST: Route["POST"] = async ($) => {
  try {
    return $.response.status(200).json($.context.upload($.body));
  } catch (error) {
    if (error instanceof Error && error.name === "MusicError") {
      const e = error as Error & { status: number; code: string };
      return $.x.response.status(e.status).json({ detail: { status: e.code, message: e.message } });
    }
    throw error;
  }
};
