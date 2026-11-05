import type { Routes } from "../../../../../../types/index.js";
type Route =
  Routes["/convai"]["/agents"]["/{agent_id}"]["/branches"]["/{branch_id}"]["/rebase-preview"];
export const GET: Route["GET"] = async ($) => {
  try {
    return $.response.status(200).json($.context.rebasePreview($.path.agent_id, $.path.branch_id, $.query.source_branch_id, $.query.include_procedure_generated_workflow_elements === undefined ? {} : { include_procedure_generated_workflow_elements: $.query.include_procedure_generated_workflow_elements }));
  } catch (error) {
    if (error instanceof Error && error.name === "LifecycleError") {
      const e = error as Error & { status: number; code: string };
      return $.x.response.status(e.status).json({ detail: { status: e.code, message: e.code } });
    }
    throw error;
  }
};
