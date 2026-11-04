import type { Routes } from "../../../types/index.js";
type Route = Routes["/workspace"]["/invites"]["/add"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
