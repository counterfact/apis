import type { actionsAddSelfHostedRunnerToGroupForOrg } from "../../../../../../../types/paths/orgs/{org}/actions/runner-groups/{runner_group_id}/runners/{runner_id}.types.js";
import type { actionsRemoveSelfHostedRunnerFromGroupForOrg } from "../../../../../../../types/paths/orgs/{org}/actions/runner-groups/{runner_group_id}/runners/{runner_id}.types.js";

export const PUT: actionsAddSelfHostedRunnerToGroupForOrg = async ($) => {
  return $.response[204].empty();
};

export const DELETE: actionsRemoveSelfHostedRunnerFromGroupForOrg = async (
  $,
) => {
  return $.response[204].empty();
};
