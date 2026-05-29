import type { actionsGetJobForWorkflowRun } from "../../../../../../types/paths/repos/{owner}/{repo}/actions/jobs/{job_id}.types.js";

export const GET: actionsGetJobForWorkflowRun = async ($) => {
  return $.response[200].random();
};
