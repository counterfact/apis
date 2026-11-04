import type { Routes } from "../../../../types/index.js";
type Route = Routes["/studio"]["/projects"]["/{project_id}"]["/convert"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
