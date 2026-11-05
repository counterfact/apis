import type { Routes } from "../../../../../types/index.js";
type Route =
  Routes["/convai"]["/agent"]["/{agent_id}"]["/llm-usage"]["/calculate"];
export const POST: Route["POST"] = async ($) => {
  try {
    return $.response
      .status(200)
      .json($.context.calculateUsage($.path.agent_id, $.body));
  } catch (error) {
    if (
      error instanceof Error &&
      ["UsageError", "KnowledgeBaseError"].includes(error.name)
    ) {
      const e = error as Error & { status: number; code: string };
      return $.x.response
        .status(e.status)
        .json({ detail: { status: e.code, message: e.code } });
    }
    throw error;
  }
};
