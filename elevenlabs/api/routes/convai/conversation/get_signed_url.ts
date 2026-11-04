import type { Routes } from "../../../types/index.js";
type Route = Routes["/convai"]["/conversation"]["/get_signed_url"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).random();
};
