import type { actionsGetWorkflowUsage } from "../../../../../../../types/paths/repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing.types.js";

export const GET: actionsGetWorkflowUsage = async ($) => {
  return $.response[200].random();
};
