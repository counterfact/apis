import type { actionsListSelfHostedRunnersInGroupForOrg } from "../../../../../../types/paths/orgs/{org}/actions/runner-groups/{runner_group_id}/runners.types.js";
import type { actionsSetSelfHostedRunnersInGroupForOrg } from "../../../../../../types/paths/orgs/{org}/actions/runner-groups/{runner_group_id}/runners.types.js";

export const GET: actionsListSelfHostedRunnersInGroupForOrg = async ($) => {
  return $.response[200].random();
};

export const PUT: actionsSetSelfHostedRunnersInGroupForOrg = async ($) => {
  return $.response[204].empty();
};
