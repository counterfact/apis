import type { actionsGetWorkflowRun } from "../../../../../../types/paths/repos/{owner}/{repo}/actions/runs/{run_id}.types.js";
import type { actionsDeleteWorkflowRun } from "../../../../../../types/paths/repos/{owner}/{repo}/actions/runs/{run_id}.types.js";

export const GET: actionsGetWorkflowRun = async ($) => {
  return $.response[200].random();
};

export const DELETE: actionsDeleteWorkflowRun = async ($) => {
  return $.response[204].empty();
};
