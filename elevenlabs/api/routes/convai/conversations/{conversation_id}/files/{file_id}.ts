import type { Routes } from "../../../../../types/index.js";
type Route =
  Routes["/convai"]["/conversations"]["/{conversation_id}"]["/files"]["/{file_id}"];
export const DELETE: Route["DELETE"] = async ($) => {
  return $.response.status(200).random();
};
