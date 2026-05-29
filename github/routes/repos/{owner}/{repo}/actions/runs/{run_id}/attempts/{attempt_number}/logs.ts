import type { actionsDownloadWorkflowRunAttemptLogs } from "../../../../../../../../../types/paths/repos/{owner}/{repo}/actions/runs/{run_id}/attempts/{attempt_number}/logs.types.js";

export const GET: actionsDownloadWorkflowRunAttemptLogs = async ($) => {
  return $.response[302].empty();
};
