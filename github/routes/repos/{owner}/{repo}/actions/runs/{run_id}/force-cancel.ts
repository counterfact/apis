import type { actionsForceCancelWorkflowRun } from "../../../../../../../types/paths/repos/{owner}/{repo}/actions/runs/{run_id}/force-cancel.types.js";

export const POST: actionsForceCancelWorkflowRun = async ($) => {
  return $.response[202].random();
};
