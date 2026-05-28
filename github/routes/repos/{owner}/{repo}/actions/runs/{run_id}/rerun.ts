import type { actionsReRunWorkflow } from "../../../../../../../types/paths/repos/{owner}/{repo}/actions/runs/{run_id}/rerun.types.js";

export const POST: actionsReRunWorkflow = async ($) => {
  return $.response[201].random();
};
