import type { actionsListJobsForWorkflowRun } from "../../../../../../../types/paths/repos/{owner}/{repo}/actions/runs/{run_id}/jobs.types.js";

export const GET: actionsListJobsForWorkflowRun = async ($) => {
  const jobs = $.context.listWorkflowJobs(
    $.path.owner,
    $.path.repo,
    $.path.run_id,
    $.query,
  );
  return $.response[200].json({
    total_count: jobs.length,
    jobs,
  });
};
