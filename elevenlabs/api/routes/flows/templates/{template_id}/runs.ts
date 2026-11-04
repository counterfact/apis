import type { Routes } from "../../../../types/index.js";
type Route = Routes["/flows"]["/templates"]["/{template_id}"]["/runs"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).random();
};
