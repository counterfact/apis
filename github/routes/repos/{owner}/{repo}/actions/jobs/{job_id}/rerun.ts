import type { actionsReRunJobForWorkflowRun } from "../../../../../../../types/paths/repos/{owner}/{repo}/actions/jobs/{job_id}/rerun.types.js";

export const POST: actionsReRunJobForWorkflowRun = async ($) => {
  return $.response[201].random();
};
