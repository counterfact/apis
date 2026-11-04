import type { Routes } from "../../../../types/index.js";
type Route = Routes["/convai"]["/mcp-servers"]["/{mcp_server_id}"]["/tools"];
export const GET: Route["GET"] = async ($) => {
  return $.response.status(200).random();
};
