import type { Routes } from "../../../../types/index.js";
type Route = Routes["/convai"]["/conversations"]["/{conversation_id}"]["/tags"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(204).empty();
};
