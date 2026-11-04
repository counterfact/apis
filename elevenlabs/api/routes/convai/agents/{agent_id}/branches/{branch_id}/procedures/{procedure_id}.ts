import type { Routes } from "../../../../../../../types/index.js";
type Route =
  Routes["/convai"]["/agents"]["/{agent_id}"]["/branches"]["/{branch_id}"]["/procedures"]["/{procedure_id}"];
export const DELETE: Route["DELETE"] = async ($) => {
  return $.response.status(200).random();
};
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).random();
};
