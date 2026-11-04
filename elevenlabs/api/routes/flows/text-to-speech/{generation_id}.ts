import type { Routes } from "../../../types/index.js";
type Route = Routes["/flows"]["/text-to-speech"]["/{generation_id}"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).random();
};
