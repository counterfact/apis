import type { Context } from "../_.context.js";
import type { Routes } from "../../../../types/index.js";
type Route = Routes["/productions"]["/orders"]["/{order_id}"]["/items"];
export const POST: Route["POST"] = async ($) => {
  const c = $.context as unknown as Context;
  try {
    return $.response.status(200).json(c.upsert($.path.order_id, $.body));
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
