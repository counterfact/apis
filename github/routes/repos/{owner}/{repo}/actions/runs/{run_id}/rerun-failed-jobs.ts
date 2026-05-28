import type { actionsReRunWorkflowFailedJobs } from "../../../../../../../types/paths/repos/{owner}/{repo}/actions/runs/{run_id}/rerun-failed-jobs.types.js";

export const POST: actionsReRunWorkflowFailedJobs = async ($) => {
  return $.response[201].random();
};
