import type { Context } from "./pronunciation-dictionaries/_.context.js";
import type { Routes } from "../types/index.js";
type Route = Routes["/pronunciation-dictionaries"];
export const GET: Route["GET"] = async ($) => {
  // Collection handler types use the parent; runtime resolves this child context.
  const result = ($.x.context as Context).listDictionaries($.query);
  if (result.error !== undefined) return $.x.response.status(400).json({
    detail: { status: "invalid_request", message: result.error },
  });
  return $.response.status(200).json(result.page);
};
