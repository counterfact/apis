import type { Routes } from "../../../types/index.js";
type Route = Routes["/workspaces"]["/api-keys"]["/disable"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
