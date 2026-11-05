import type { Routes } from "../../../../../types/index.js";
type Route =
  Routes["/productions"]["/orders"]["/{order_id}"]["/items"]["/{item_id}"];
export const DELETE: Route["DELETE"] = async ($) => {
  const c = $.context;
  try {
    return $.response
      .status(200)
      .json(c.remove($.path.order_id, $.path.item_id));
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
