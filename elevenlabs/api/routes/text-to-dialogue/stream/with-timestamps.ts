import type { Routes } from "../../../types/index.js";
type Route = Routes["/text-to-dialogue"]["/stream"]["/with-timestamps"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
