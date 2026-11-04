import type { Routes } from "../../../types/index.js";
type Route = Routes["/convai"]["/environments"]["/{environment}"];
export const DELETE: Route["DELETE"] = async ($) => {
  return $.response.status(204).empty();
};
