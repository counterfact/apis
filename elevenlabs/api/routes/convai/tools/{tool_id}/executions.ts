import type { Routes } from "../../../../types/index.js";
type Route = Routes["/convai"]["/tools"]["/{tool_id}"]["/executions"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).random();
};
