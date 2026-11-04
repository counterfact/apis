import type { Routes } from "../../../types/index.js";
type Route = Routes["/flows"]["/image"]["/{generation_id}"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).random();
};
