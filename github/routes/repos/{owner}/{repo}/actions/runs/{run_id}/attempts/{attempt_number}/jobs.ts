import type { actionsListJobsForWorkflowRunAttempt } from "../../../../../../../../../types/paths/repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/jobs.types.js";

export const GET: actionsListJobsForWorkflowRunAttempt = async ($) => {
  return $.response[200].random();
};
