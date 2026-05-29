import type { actionsApproveWorkflowRun } from "../../../../../../../types/paths/repos/{owner}/{repo}/actions/runs/{run_id}/approve.types.js";

export const POST: actionsApproveWorkflowRun = async ($) => {
  return $.response[201].random();
};
