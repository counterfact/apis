import type { Routes } from "../../../../types/index.js";
type Route = Routes["/studio"]["/projects"]["/{project_id}"]["/snapshots"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).random();
};
