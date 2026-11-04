import type { Routes } from "../../../types/index.js";
type Route = Routes["/convai"]["/batch-calling"]["/workspace"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).random();
};
