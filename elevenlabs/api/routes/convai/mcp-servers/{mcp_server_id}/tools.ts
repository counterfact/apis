import type { Routes } from "../../../../types/index.js";
type Route = Routes["/convai"]["/mcp-servers"]["/{mcp_server_id}"]["/tools"];
import type { Context } from "../_.context.js";
export const GET: Route["GET"] = async ($) => {
  const c = $.context as unknown as Context;
  try {
    return $.response
      .status(200)
      .json(c.tools($.path.mcp_server_id, $.query.environment));
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
