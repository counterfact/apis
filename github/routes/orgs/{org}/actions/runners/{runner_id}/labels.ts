import type { actionsListLabelsForSelfHostedRunnerForOrg } from "../../../../../../types/paths/orgs/{org}/actions/runners/{runner_id}/labels.types.js";
import type { actionsAddCustomLabelsToSelfHostedRunnerForOrg } from "../../../../../../types/paths/orgs/{org}/actions/runners/{runner_id}/labels.types.js";
import type { actionsSetCustomLabelsForSelfHostedRunnerForOrg } from "../../../../../../types/paths/orgs/{org}/actions/runners/{runner_id}/labels.types.js";
import type { actionsRemoveAllCustomLabelsFromSelfHostedRunnerForOrg } from "../../../../../../types/paths/orgs/{org}/actions/runners/{runner_id}/labels.types.js";

export const GET: actionsListLabelsForSelfHostedRunnerForOrg = async ($) => {
  return $.response[200].empty();
};

export const POST: actionsAddCustomLabelsToSelfHostedRunnerForOrg = async (
  $,
) => {
  return $.response[200].empty();
};

export const PUT: actionsSetCustomLabelsForSelfHostedRunnerForOrg = async (
  $,
) => {
  return $.response[200].empty();
};

export const DELETE: actionsRemoveAllCustomLabelsFromSelfHostedRunnerForOrg =
  async ($) => {
    return $.response[200].empty();
  };
