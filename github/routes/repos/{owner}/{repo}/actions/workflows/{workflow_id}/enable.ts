import type { actionsEnableWorkflow } from "../../../../../../../types/paths/repos/{owner}/{repo}/actions/workflows/{workflow_id}/enable.types.js";

export const PUT: actionsEnableWorkflow = async ($) => {
  return $.response[204].empty();
};
