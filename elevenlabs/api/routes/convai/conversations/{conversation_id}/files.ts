import type { Routes } from "../../../../types/index.js";
type Route =
  Routes["/convai"]["/conversations"]["/{conversation_id}"]["/files"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
