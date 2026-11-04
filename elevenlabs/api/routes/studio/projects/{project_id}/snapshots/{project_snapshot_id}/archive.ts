import type { Routes } from "../../../../../../types/index.js";
type Route =
  Routes["/studio"]["/projects"]["/{project_id}"]["/snapshots"]["/{project_snapshot_id}"]["/archive"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
