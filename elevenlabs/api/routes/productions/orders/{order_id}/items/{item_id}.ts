import type { Routes } from "../../../../../types/index.js";
type Route =
  Routes["/productions"]["/orders"]["/{order_id}"]["/items"]["/{item_id}"];
export const DELETE: Route["DELETE"] = async ($) => {
  return $.response.status(200).random();
};
