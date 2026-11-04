import type { Routes } from "../../../../types/index.js";
type Route = Routes["/productions"]["/orders"]["/{order_id}"]["/items"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
