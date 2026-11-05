import type { Routes } from "../../../../../../../types/index.js";
type Route =
  Routes["/convai"]["/agents"]["/{agent_id}"]["/branches"]["/{branch_id}"]["/procedures"]["/compile"];
export const POST: Route["POST"] = async ($) => {
  try {
    const result = $.context.compile($.path.agent_id, $.path.branch_id);
    return result.ok
      ? $.response.status(200).json({ workflow: result.workflow })
      : $.response.status(400).json({ errors: result.errors });
  } catch (error) {
    if (error instanceof Error &&
      (error.name === "ProcedureError" || error.name === "LifecycleError")) {
      const e = error as Error & { status: number; code: string };
      return $.x.response.status(e.status).json({ detail: { status: e.code, message: e.code } });
    }
    throw error;
  }
};
