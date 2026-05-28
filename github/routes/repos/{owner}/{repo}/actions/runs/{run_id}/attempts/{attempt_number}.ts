import type { actionsGetWorkflowRunAttempt } from "../../../../../../../../types/paths/repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}.types.js";

export const GET: actionsGetWorkflowRunAttempt = async ($) => {
  return $.response[200].random();
};
