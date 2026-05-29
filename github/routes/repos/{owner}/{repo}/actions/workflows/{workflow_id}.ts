import type { actionsGetWorkflow } from "../../../../../../types/paths/repos/{owner}/{repo}/actions/workflows/{workflow_id}.types.js";

export const GET: actionsGetWorkflow = async ($) => {
  return $.response[200].random();
};
