import type { Routes } from "../../../../types/index.js";
type Route =
  Routes["/productions"]["/orders"]["/languages"]["/{order_item_kind}"];
export const GET: Route["GET"] = async ($) => {
  const c = $.context;
  try {
    return $.response
      .status(200)
      .json(c.availableLanguages($.path.order_item_kind));
  } catch (error) {
    if (error instanceof Error && error.name === "ProductionError") {
      const e = error as Error & { status: number; code: string };
      return $.x.response
        .status(e.status)
        .json({ detail: { status: e.code, message: e.message } });
    }
    throw error;
  }
};
