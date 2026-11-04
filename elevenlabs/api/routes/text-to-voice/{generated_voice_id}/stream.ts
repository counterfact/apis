import type { Routes } from "../../../types/index.js";
type Route = Routes["/text-to-voice"]["/{generated_voice_id}"]["/stream"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).random();
};
