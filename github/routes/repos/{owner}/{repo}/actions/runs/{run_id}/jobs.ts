import type { actionsListJobsForWorkflowRun } from "../../../../../../../types/paths/repos/{owner}/{repo}/actions/runs/{run_id}/jobs.types.js";

export const GET: actionsListJobsForWorkflowRun = async ($) => {
  return $.response[200].random();
};
