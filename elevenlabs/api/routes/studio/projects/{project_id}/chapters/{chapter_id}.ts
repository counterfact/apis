import type { Routes } from "../../../../../types/index.js";
type Route =
  Routes["/studio"]["/projects"]["/{project_id}"]["/chapters"]["/{chapter_id}"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).random();
};
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
export const DELETE: Route["DELETE"] = async ($) => {
  return $.response.status(200).random();
};
