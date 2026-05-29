import type { actionsListWorkflowRunsForRepo } from "../../../../../types/paths/repos/{owner}/{repo}/actions/runs.types.js";

export const GET: actionsListWorkflowRunsForRepo = async ($) => {
  const workflowRuns = $.context.listWorkflowRuns(
    $.path.owner,
    $.path.repo,
    $.query,
  );
  return $.response[200].json({
    total_count: workflowRuns.length,
    workflow_runs: workflowRuns,
  });
};
