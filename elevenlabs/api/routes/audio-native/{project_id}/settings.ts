import type { Routes } from "../../../types/index.js";
type Route = Routes["/audio-native"]["/{project_id}"]["/settings"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).random();
};
