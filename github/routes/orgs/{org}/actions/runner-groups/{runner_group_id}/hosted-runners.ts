import type { actionsListGithubHostedRunnersInGroupForOrg } from "../../../../../../types/paths/orgs/{org}/actions/runner-groups/{runner_group_id}/hosted-runners.types.js";

export const GET: actionsListGithubHostedRunnersInGroupForOrg = async ($) => {
  return $.response[200].random();
};
