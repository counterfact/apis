import type { Routes } from "../../../types/index.js";
type Route = Routes["/audio-native"]["/{project_id}"]["/content"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
