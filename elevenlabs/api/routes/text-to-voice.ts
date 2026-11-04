import type { Routes } from "../types/index.js";
type Route = Routes["/text-to-voice"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
