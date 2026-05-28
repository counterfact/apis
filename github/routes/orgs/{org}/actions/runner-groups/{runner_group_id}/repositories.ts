import type { actionsListRepoAccessToSelfHostedRunnerGroupInOrg } from "../../../../../../types/paths/orgs/{org}/actions/runner-groups/{runner_group_id}/repositories.types.js";
import type { actionsSetRepoAccessToSelfHostedRunnerGroupInOrg } from "../../../../../../types/paths/orgs/{org}/actions/runner-groups/{runner_group_id}/repositories.types.js";

export const GET: actionsListRepoAccessToSelfHostedRunnerGroupInOrg = async (
  $,
) => {
  return $.response[200].random();
};

export const PUT: actionsSetRepoAccessToSelfHostedRunnerGroupInOrg = async (
  $,
) => {
  return $.response[204].empty();
};
