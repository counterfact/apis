import type { actionsListWorkflowRuns } from "../../../../../../../types/paths/repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs.types.js";

export const GET: actionsListWorkflowRuns = async ($) => {
  return $.response[200].random();
};
