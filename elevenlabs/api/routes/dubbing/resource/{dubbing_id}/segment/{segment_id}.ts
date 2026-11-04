import type { Routes } from "../../../../../types/index.js";
type Route =
  Routes["/dubbing"]["/resource"]["/{dubbing_id}"]["/segment"]["/{segment_id}"];
export const DELETE: Route["DELETE"] = async ($) => {
  return $.response.status(200).random();
};
