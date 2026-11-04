import type { Routes } from "../../../../types/index.js";
type Route =
  Routes["/convai"]["/mcp-servers"]["/{mcp_server_id}"]["/approval-policy"];
export const PATCH: Route["PATCH"] = async ($) => {
  return $.response.status(200).random();
};
