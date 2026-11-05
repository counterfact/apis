import type { Routes } from "../../../types/index.js";
import type { Context } from "./_.context.js";
type Route = Routes["/convai"]["/agent-testing"]["/bulk-move"];
export const POST: Route["POST"] = async ($) => {
  const c = $.context as unknown as Context;

  try {
    c.move($.body);
    return $.response.status(200).json({});
  } catch (error) {
    if (error instanceof Error && error.name === "AgentTestError") {
      const e = error as Error & { status: number; code: string };
      return $.x.response
        .status(e.status)
        .json({ detail: { status: e.code, message: e.message } });
    }
    throw error;
  }
};
