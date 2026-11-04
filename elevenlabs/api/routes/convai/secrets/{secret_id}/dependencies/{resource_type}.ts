import type { Routes } from "../../../../../types/index.js";
type Route =
  Routes["/convai"]["/secrets"]["/{secret_id}"]["/dependencies"]["/{resource_type}"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).random();
};
