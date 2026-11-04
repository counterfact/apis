import type { Routes } from "../../types/index.js";
type Route = Routes["/workspace"]["/audit-logs"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).random();
};
