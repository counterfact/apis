import type { actionsDisableWorkflow } from "../../../../../../../types/paths/repos/{owner}/{repo}/actions/workflows/{workflow_id}/disable.types.js";

export const PUT: actionsDisableWorkflow = async ($) => {
  return $.response[204].empty();
};
