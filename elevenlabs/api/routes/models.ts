import type { Routes } from "../types/index.js";
type Route = Routes["/models"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).random();
};
