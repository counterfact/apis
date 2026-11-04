import type { Routes } from "../../../../../types/index.js";
type Route =
  Routes["/convai"]["/agents"]["/{agent_id}"]["/triage-tickets"]["/assignable-users"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).random();
};
