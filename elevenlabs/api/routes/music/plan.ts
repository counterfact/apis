import type { Routes } from "../../types/index.js";
type Route = Routes["/music"]["/plan"];
export const POST: Route["POST"] = async ($) => {
  const c = $.context;
  try {
    return $.response.status(200).json(c.plan($.body, $.query));
  } catch (error) {
    if (error instanceof Error && error.name === "MusicError") {
      const e = error as Error & { status: number; code: string };
      return $.x.response
        .status(e.status)
        .json({ detail: { status: e.code, message: e.code } });
    }
    throw error;
  }
};
