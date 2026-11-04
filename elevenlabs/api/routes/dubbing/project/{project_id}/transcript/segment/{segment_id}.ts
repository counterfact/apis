import type { Routes } from "../../../../../../types/index.js";
type Route =
  Routes["/dubbing"]["/project"]["/{project_id}"]["/transcript"]["/segment"]["/{segment_id}"];
export const PATCH: Route["PATCH"] = async ($) => {
  return $.response.status(200).random();
};
export const DELETE: Route["DELETE"] = async ($) => {
  return $.response.status(200).random();
};
