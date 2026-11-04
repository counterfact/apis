import type { Routes } from "../../../../../../types/index.js";
type Route =
  Routes["/dubbing"]["/{dubbing_id}"]["/transcripts"]["/{language_code}"]["/format"]["/{format_type}"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).random();
};
