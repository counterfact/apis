import type { actionsCreateWorkflowDispatch } from "../../../../../../../types/paths/repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches.types.js";

export const POST: actionsCreateWorkflowDispatch = async ($) => {
  return $.response[200].random();
};
