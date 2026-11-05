import type { Routes } from "../../../../../../types/index.js";
type Route =
  Routes["/convai"]["/agents"]["/{agent_id}"]["/branches"]["/{source_branch_id}"]["/merge"];
export const POST: Route["POST"] = async ($) => {
  try {
    return $.response.status(200).json($.context.merge($.path.agent_id, $.path.source_branch_id, $.query.target_branch_id, $.body));
  } catch (error) {
    if (error instanceof Error && error.name === "LifecycleError") {
      const e = error as Error & { status: number; code: string };
      return $.x.response.status(e.status).json({ detail: { status: e.code, message: e.code } });
    }
    throw error;
  }
};
