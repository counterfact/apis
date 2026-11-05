import type { Context } from "./orders/_.context.js";
import type { Routes } from "../../types/index.js";
type Route = Routes["/productions"]["/orders"];
export const POST: Route["POST"] = async ($) => {
  const c = $.context as unknown as Context;
  try {
    return $.response.status(200).json(c.create($.body));
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
export const GET: Route["GET"] = async ($) => {
  const c = $.context as unknown as Context;
  try {
    return $.response.status(200).json(c.list($.query));
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
