import type { actionsListConcurrencyGroupsForWorkflowRun } from "../../../../../../../types/paths/repos/{owner}/{repo}/actions/runs/{run_id}/concurrency_groups.types.js";

export const GET: actionsListConcurrencyGroupsForWorkflowRun = async ($) => {
  return $.response[200].random();
};
