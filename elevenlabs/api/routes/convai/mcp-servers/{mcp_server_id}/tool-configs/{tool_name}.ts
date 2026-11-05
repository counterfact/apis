import type { Routes } from "../../../../../types/index.js";
type Route =
  Routes["/convai"]["/mcp-servers"]["/{mcp_server_id}"]["/tool-configs"]["/{tool_name}"];
import type { Context } from "../../_.context.js";
export const GET: Route["GET"] = async ($) => {
  const c = $.context as unknown as Context;
  try {
    return $.response
      .status(200)
      .json(c.getOverride($.path.mcp_server_id, $.path.tool_name));
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
export const PATCH: Route["PATCH"] = async ($) => {
  const c = $.context as unknown as Context;
  try {
    return $.response
      .status(200)
      .json(
        c.patchOverride(
          $.path.mcp_server_id,
          $.path.tool_name,
          $.body,
          $.query.environment,
        ),
      );
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
export const DELETE: Route["DELETE"] = async ($) => {
  const c = $.context as unknown as Context;
  try {
    return $.response
      .status(200)
      .json(c.removeOverride($.path.mcp_server_id, $.path.tool_name));
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
