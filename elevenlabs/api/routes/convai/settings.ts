import type { Context } from "./settings/_.context.js";
import type { Routes } from "../../types/index.js";
type Route = Routes["/convai"]["/settings"];
export const GET: Route["GET"] = async ($) => {
  // The runtime resolves the child context; collection handler types use the parent.
  return $.response.status(200).json(($.x.context as Context).getSettings());
};
export const PATCH: Route["PATCH"] = async ($) => {
  const result = ($.x.context as Context).updateSettings($.body);
  if (result.error) return $.x.response.status(400).json({ detail: { status: result.error, message: "Invalid settings" } });
  return $.response.status(200).json(result.value);
};
