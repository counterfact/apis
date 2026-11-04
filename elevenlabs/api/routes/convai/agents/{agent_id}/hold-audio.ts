import type { Routes } from "../../../../types/index.js";
type Route = Routes["/convai"]["/agents"]["/{agent_id}"]["/hold-audio"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
export const DELETE: Route["DELETE"] = async ($) => {
  return $.response.status(200).random();
};
