import type { Routes } from "../../../../../types/index.js";
type Route =
  Routes["/flows"]["/templates"]["/{template_id}"]["/runs"]["/{run_id}"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).random();
};
