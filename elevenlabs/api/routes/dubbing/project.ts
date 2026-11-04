import type { Routes } from "../../types/index.js";
type Route = Routes["/dubbing"]["/project"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(201).random();
};
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).random();
};
