import type { Routes } from "../../types/index.js";
type Route = Routes["/pronunciation-dictionaries"]["/add-from-file"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
