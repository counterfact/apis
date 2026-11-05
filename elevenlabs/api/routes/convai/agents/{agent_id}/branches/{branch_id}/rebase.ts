import type { Routes } from "../../../../../../types/index.js";
type Route =
  Routes["/convai"]["/agents"]["/{agent_id}"]["/branches"]["/{branch_id}"]["/rebase"];
export const POST: Route["POST"] = async ($) => {
  try {
    return $.response.status(200).json($.context.rebase($.path.agent_id, $.path.branch_id, $.query.source_branch_id, $.body));
  } catch (error) {
    if (error instanceof Error && error.name === "LifecycleError") {
      const e = error as Error & { status: number; code: string };
      return $.x.response.status(e.status).json({ detail: { status: e.code, message: e.code } });
    }
    throw error;
  }
};
