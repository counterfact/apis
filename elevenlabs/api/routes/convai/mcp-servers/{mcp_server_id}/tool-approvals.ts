import type { Routes } from "../../../../types/index.js";
type Route =
  Routes["/convai"]["/mcp-servers"]["/{mcp_server_id}"]["/tool-approvals"];
export const POST: Route["POST"] = async ($) => {
  return $.response.status(200).random();
};
