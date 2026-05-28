import type { actionsListWorkflowRunArtifacts } from "../../../../../../../types/paths/repos/{owner}/{repo}/actions/runs/{run_id}/artifacts.types.js";

export const GET: actionsListWorkflowRunArtifacts = async ($) => {
  return $.response[200].random();
};
