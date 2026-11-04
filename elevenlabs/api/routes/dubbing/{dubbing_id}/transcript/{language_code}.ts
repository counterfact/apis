import type { Routes } from "../../../../types/index.js";
type Route =
  Routes["/dubbing"]["/{dubbing_id}"]["/transcript"]["/{language_code}"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).random();
};
