import type { Routes } from "../../types/index.js";
type Route = Routes["/single-use-token"]["/{token_type}"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
