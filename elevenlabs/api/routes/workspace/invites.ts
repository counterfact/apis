import type { Routes } from "../../types/index.js";
type Route = Routes["/workspace"]["/invites"];
export const DELETE: Route["DELETE"] = async ($) => {
  return $.response.status(200).random();
};
