import type { Routes } from "../../../types/index.js";
type Route = Routes["/convai"]["/agent-testing"]["/bulk-move"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
