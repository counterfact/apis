import type { Routes } from "../../../types/index.js";
type Route = Routes["/convai"]["/conversation"]["/token"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).random();
};
