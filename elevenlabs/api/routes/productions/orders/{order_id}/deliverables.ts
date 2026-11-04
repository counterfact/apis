import type { Routes } from "../../../../types/index.js";
type Route = Routes["/productions"]["/orders"]["/{order_id}"]["/deliverables"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).random();
};
