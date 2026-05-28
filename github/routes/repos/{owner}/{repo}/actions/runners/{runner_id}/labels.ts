import type { actionsListLabelsForSelfHostedRunnerForRepo } from "../../../../../../../types/paths/repos/{owner}/{repo}/actions/runners/{runner_id}/labels.types.js";
import type { actionsAddCustomLabelsToSelfHostedRunnerForRepo } from "../../../../../../../types/paths/repos/{owner}/{repo}/actions/runners/{runner_id}/labels.types.js";
import type { actionsSetCustomLabelsForSelfHostedRunnerForRepo } from "../../../../../../../types/paths/repos/{owner}/{repo}/actions/runners/{runner_id}/labels.types.js";
import type { actionsRemoveAllCustomLabelsFromSelfHostedRunnerForRepo } from "../../../../../../../types/paths/repos/{owner}/{repo}/actions/runners/{runner_id}/labels.types.js";

export const GET: actionsListLabelsForSelfHostedRunnerForRepo = async ($) => {
  return $.response[200].empty();
};

export const POST: actionsAddCustomLabelsToSelfHostedRunnerForRepo = async (
  $,
) => {
  return $.response[200].empty();
};

export const PUT: actionsSetCustomLabelsForSelfHostedRunnerForRepo = async (
  $,
) => {
  return $.response[200].empty();
};

export const DELETE: actionsRemoveAllCustomLabelsFromSelfHostedRunnerForRepo =
  async ($) => {
    return $.response[200].empty();
  };
