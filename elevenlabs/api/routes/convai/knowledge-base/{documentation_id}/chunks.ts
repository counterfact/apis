import type { Routes } from "../../../../types/index.js";
type Route =
  Routes["/convai"]["/knowledge-base"]["/{documentation_id}"]["/chunks"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).random();
};
