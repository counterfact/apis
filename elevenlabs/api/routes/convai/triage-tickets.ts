import type { Routes } from "../../types/index.js";
type Route = Routes["/convai"]["/triage-tickets"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).random();
};
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
