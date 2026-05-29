import type { actionsDownloadWorkflowRunLogs } from "../../../../../../../types/paths/repos/{owner}/{repo}/actions/runs/{run_id}/logs.types.js";
import type { actionsDeleteWorkflowRunLogs } from "../../../../../../../types/paths/repos/{owner}/{repo}/actions/runs/{run_id}/logs.types.js";

export const GET: actionsDownloadWorkflowRunLogs = async ($) => {
  return $.response[302].empty();
};

export const DELETE: actionsDeleteWorkflowRunLogs = async ($) => {
  return $.response[204].empty();
};
