import type { Routes } from "../../types/index.js";
import type { Context } from "./agent-testing/_.context.js";
type Route = Routes["/convai"]["/agent-testing"];
export const GET: Route["GET"] = async ($) => {
  const c = $.context as unknown as Context;
  const q: Record<string, unknown> = { ...$.query };
  if (typeof q.types === "string") q.types = [q.types];
  if (q.include_folders === "true") q.include_folders = true;
  else if (q.include_folders === "false") q.include_folders = false;
  try {
    return $.response.status(200).json(c.list(q));
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
