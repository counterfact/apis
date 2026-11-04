import type { Routes } from "../../types/index.js";
type Route = Routes["/history"]["/download"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
