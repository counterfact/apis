import type { Routes } from "../../../../../types/index.js";
type Route =
  Routes["/convai"]["/agents"]["/{agent_id}"]["/simulate-conversation"]["/stream"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).empty();
};
