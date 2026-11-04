import type { Routes } from "../../../types/index.js";
type Route = Routes["/voice-changer"]["/{voice_id}"]["/stream"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
