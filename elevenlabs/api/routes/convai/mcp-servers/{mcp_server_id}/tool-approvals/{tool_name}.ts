import type { Routes } from "../../../../../types/index.js";
type Route =
  Routes["/convai"]["/mcp-servers"]["/{mcp_server_id}"]["/tool-approvals"]["/{tool_name}"];
export const DELETE: Route["DELETE"] = async ($) => {
  return $.response.status(200).random();
};
