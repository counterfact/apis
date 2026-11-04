import type { Routes } from "../../../../../../types/index.js";
type Route =
  Routes["/convai"]["/agents"]["/{agent_id}"]["/branches"]["/{source_branch_id}"]["/merge-preview"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).random();
};
