import type { Routes } from "../../../../types/index.js";
type Route = Routes["/convai"]["/agents"]["/{agent_id}"]["/branches"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).random();
};
