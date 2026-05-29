import type { actionsDownloadJobLogsForWorkflowRun } from "../../../../../../../types/paths/repos/{owner}/{repo}/actions/jobs/{job_id}/logs.types.js";

export const GET: actionsDownloadJobLogsForWorkflowRun = async ($) => {
  return $.response[302].empty();
};
