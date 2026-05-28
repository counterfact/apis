import type { actionsGetWorkflowRunUsage } from "../../../../../../../types/paths/repos/{owner}/{repo}/actions/runs/{run_id}/timing.types.js";

export const GET: actionsGetWorkflowRunUsage = async ($) => {
  return $.response[200].random();
};
