import type { Routes } from "../../../../types/index.js";
type Route =
  Routes["/convai"]["/conversations"]["/{conversation_id}"]["/sip-messages"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).random();
};
