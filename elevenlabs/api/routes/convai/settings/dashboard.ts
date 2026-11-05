import type { Routes } from "../../../types/index.js";
type Route = Routes["/convai"]["/settings"]["/dashboard"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).json($.context.getDashboard());
};
export const PATCH: Route["PATCH"] = async ($) => {
  const result = $.context.updateDashboard($.body);
  if (result.error) return $.x.response.status(400).json({ detail: { status: result.error, message: "Invalid dashboard settings" } });
  return $.response.status(200).json(result.value);
};
