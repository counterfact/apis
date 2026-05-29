import type { actionsGetReviewsForRun } from "../../../../../../../types/paths/repos/{owner}/{repo}/actions/runs/{run_id}/approvals.types.js";

export const GET: actionsGetReviewsForRun = async ($) => {
  return $.response[200].random();
};
