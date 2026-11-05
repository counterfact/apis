import type { Routes } from "../../../../types/index.js";
type Route =
  Routes["/convai"]["/mcp-servers"]["/{mcp_server_id}"]["/approval-policy"];
export const PATCH: Route["PATCH"] = async ($) => {
  const c = $.context;
  try {
    return $.response.status(200).json(c.patch($.path.mcp_server_id, $.body));
  } catch (error) {
    if (error instanceof Error && error.name === "McpError") {
      const e = error as Error & { status: number; code: string };
      return $.x.response
        .status(e.status)
        .json({ detail: { status: e.code, message: e.message } });
    }
    throw error;
  }
};
