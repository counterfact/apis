import type { Routes } from "../../../../../types/index.js";
type Route =
  Routes["/dubbing"]["/project"]["/{project_id}"]["/transcript"]["/segment"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(201).random();
};
