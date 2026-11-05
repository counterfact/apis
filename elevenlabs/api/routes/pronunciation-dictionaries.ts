import type { Routes } from "../types/index.js";
type Route = Routes["/pronunciation-dictionaries"];
export const GET: Route["GET"] = async ($) => {
  const result = $.context.listDictionaries($.query);
  if (result.error !== undefined) return $.x.response.status(400).json({
    detail: { status: "invalid_request", message: result.error },
  });
  return $.response.status(200).json(result.page);
};
