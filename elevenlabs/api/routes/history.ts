import type { Context } from "./history/_.context.js";
import type { Routes } from "../types/index.js";
type Route = Routes["/history"];
export const GET: Route["GET"] = async ($) => {
  // The generator types a collection file from its parent directory; the runtime
  // correctly resolves this handler at /history to the nested history context.
  const context = $.x.context as Context;
  const result = context.listHistory($.query);
  if (result.error !== undefined) {
    return $.x.response.status(400).json({
      detail: { status: "invalid_request", message: result.error },
    });
  }
  return $.response.status(200).json(result.page);
};
