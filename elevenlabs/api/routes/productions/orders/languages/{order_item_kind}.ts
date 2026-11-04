import type { Routes } from "../../../../types/index.js";
type Route =
  Routes["/productions"]["/orders"]["/languages"]["/{order_item_kind}"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).random();
};
