import type { Routes } from "../types/index.js";
type Route = Routes["/dubbing"];
export const GET: Route["GET"] = async ($) => {
  const c = $.context;
  try {
    return $.response.status(200).json(c.list($.query));
  } catch (error) {
    if (error instanceof Error && error.name === "LegacyDubbingError") {
      const e = error as Error & { status: number; code: string };
      return $.x.response
        .status(e.status)
        .json({ detail: { status: e.code, message: e.message } });
    }
    throw error;
  }
};
export const POST: Route["POST"] = async ($) => {
  try {
    return $.response.status(200).json($.context.create($.body));
  } catch (error) {
    if (error instanceof Error && error.name === "LegacyDubbingError") {
      const e = error as Error & { status: number; code: string };
      return $.x.response
        .status(e.status)
        .json({ detail: { status: e.code, message: e.message } });
    }
    throw error;
  }
};
