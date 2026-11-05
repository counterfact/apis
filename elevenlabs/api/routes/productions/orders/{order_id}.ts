import type { Routes } from "../../../types/index.js";
type Route = Routes["/productions"]["/orders"]["/{order_id}"];
export const GET: Route["GET"] = async ($) => {
  const c = $.context;
  try {
    return $.response.status(200).json(c.get($.path.order_id));
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
export const PATCH: Route["PATCH"] = async ($) => {
  const c = $.context;
  try {
    return $.response.status(200).json(c.update($.path.order_id, $.body));
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
