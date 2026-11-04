import type { Routes } from "../../../../../types/index.js";
type Route =
  Routes["/convai"]["/agent"]["/{agent_id}"]["/knowledge-base"]["/size"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).random();
};
