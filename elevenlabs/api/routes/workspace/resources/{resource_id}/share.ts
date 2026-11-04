import type { Routes } from "../../../../types/index.js";
type Route = Routes["/workspace"]["/resources"]["/{resource_id}"]["/share"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
