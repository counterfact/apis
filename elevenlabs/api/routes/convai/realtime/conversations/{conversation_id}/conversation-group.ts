import type { Routes } from "../../../../../types/index.js";
type Route =
  Routes["/convai"]["/realtime"]["/conversations"]["/{conversation_id}"]["/conversation-group"];
export const PUT: Route["PUT"] = async ($) => {
  return $.response.status(200).random();
};
export const DELETE: Route["DELETE"] = async ($) => {
  return $.response.status(200).random();
};
