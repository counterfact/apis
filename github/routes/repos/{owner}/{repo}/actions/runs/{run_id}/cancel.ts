import type { actionsCancelWorkflowRun } from "../../../../../../../types/paths/repos/{owner}/{repo}/actions/runs/{run_id}/cancel.types.js";

export const POST: actionsCancelWorkflowRun = async ($) => {
  return $.response[202].random();
};
