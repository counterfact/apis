import type { Routes } from "../../types/index.js";
type Route = Routes["/convai"]["/mcp-servers"];
export const GET: Route["GET"] = async ($) => {
  const c = $.context;
  try {
    return $.response.status(200).json(c.list());
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
export const POST: Route["POST"] = async ($) => {
  const c = $.context;
  try {
    return $.response.status(200).json(c.create($.body));
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
