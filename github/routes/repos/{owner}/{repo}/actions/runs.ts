import type { actionsListWorkflowRunsForRepo } from "../../../../../types/paths/repos/{owner}/{repo}/actions/runs.types.js";

export const GET: actionsListWorkflowRunsForRepo = async ($) => {
  return $.response[200].random();
};
