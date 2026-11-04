import type { Routes } from "../../types/index.js";
type Route = Routes["/audio-effects"]["/catalog"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).random();
};
