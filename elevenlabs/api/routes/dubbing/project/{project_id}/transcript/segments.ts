import type { Routes } from "../../../../../types/index.js";
type Route =
  Routes["/dubbing"]["/project"]["/{project_id}"]["/transcript"]["/segments"];
export const PATCH: Route["PATCH"] = async ($) => {
  return $.response.status(200).random();
};
