import type { Routes } from "../../../../../types/index.js";
type Route =
  Routes["/convai"]["/agent"]["/{agent_id}"]["/llm-usage"]["/calculate"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
