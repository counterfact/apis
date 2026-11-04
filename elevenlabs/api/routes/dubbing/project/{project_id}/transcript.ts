import type { Routes } from "../../../../types/index.js";
type Route = Routes["/dubbing"]["/project"]["/{project_id}"]["/transcript"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).random();
};
