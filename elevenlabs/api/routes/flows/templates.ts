import type { Routes } from "../../types/index.js";
type Route = Routes["/flows"]["/templates"];
export const GET: Route["GET"] = async ($) => {
  try {
    const context = $.context;
    return $.response.status(200).json(context.list($.query));
  } catch (error) {
    if (error instanceof Error && error.name === "TemplateError") {
      const e = error as Error & { status: number; code: string };
      return $.x.response
        .status(e.status)
        .json({ detail: { status: e.code, message: e.code } });
    }
    throw error;
  }
};
