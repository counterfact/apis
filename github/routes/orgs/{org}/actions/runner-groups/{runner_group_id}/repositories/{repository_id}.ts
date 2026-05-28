import type { actionsAddRepoAccessToSelfHostedRunnerGroupInOrg } from "../../../../../../../types/paths/orgs/{org}/actions/runner-groups/{runner_group_id}/repositories/{repository_id}.types.js";
import type { actionsRemoveRepoAccessToSelfHostedRunnerGroupInOrg } from "../../../../../../../types/paths/orgs/{org}/actions/runner-groups/{runner_group_id}/repositories/{repository_id}.types.js";

export const PUT: actionsAddRepoAccessToSelfHostedRunnerGroupInOrg = async (
  $,
) => {
  return $.response[204].empty();
};

export const DELETE: actionsRemoveRepoAccessToSelfHostedRunnerGroupInOrg =
  async ($) => {
    return $.response[204].empty();
  };
