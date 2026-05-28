import type { actionsGetPendingDeploymentsForRun } from "../../../../../../../types/paths/repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments.types.js";
import type { actionsReviewPendingDeploymentsForRun } from "../../../../../../../types/paths/repos/{owner}/{repo}/actions/runs/{run_id}/pending_deployments.types.js";

export const GET: actionsGetPendingDeploymentsForRun = async ($) => {
  return $.response[200].random();
};

export const POST: actionsReviewPendingDeploymentsForRun = async ($) => {
  return $.response[200].random();
};
