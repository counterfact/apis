import type { actionsReviewCustomGatesForRun } from "../../../../../../../types/paths/repos/{owner}/{repo}/actions/runs/{run_id}/deployment_protection_rule.types.js";

export const POST: actionsReviewCustomGatesForRun = async ($) => {
  return $.response[204].empty();
};
