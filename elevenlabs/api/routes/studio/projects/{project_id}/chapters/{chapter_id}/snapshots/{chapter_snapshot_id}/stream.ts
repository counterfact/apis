import type { Routes } from "../../../../../../../../types/index.js";
type Route =
  Routes["/studio"]["/projects"]["/{project_id}"]["/chapters"]["/{chapter_id}"]["/snapshots"]["/{chapter_snapshot_id}"]["/stream"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
