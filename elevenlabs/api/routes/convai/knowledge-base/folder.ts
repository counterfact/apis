import type { Routes } from "../../../types/index.js";
type Route = Routes["/convai"]["/knowledge-base"]["/folder"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
