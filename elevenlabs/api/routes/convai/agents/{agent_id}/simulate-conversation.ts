import type { Routes } from "../../../../types/index.js";
type Route =
  Routes["/convai"]["/agents"]["/{agent_id}"]["/simulate-conversation"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
