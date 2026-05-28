import type { actionsGetSelfHostedRunnerGroupForOrg } from "../../../../../types/paths/orgs/{org}/actions/runner-groups/{runner_group_id}.types.js";
import type { actionsUpdateSelfHostedRunnerGroupForOrg } from "../../../../../types/paths/orgs/{org}/actions/runner-groups/{runner_group_id}.types.js";
import type { actionsDeleteSelfHostedRunnerGroupFromOrg } from "../../../../../types/paths/orgs/{org}/actions/runner-groups/{runner_group_id}.types.js";

export const GET: actionsGetSelfHostedRunnerGroupForOrg = async ($) => {
  return $.response[200].random();
};

export const PATCH: actionsUpdateSelfHostedRunnerGroupForOrg = async ($) => {
  return $.response[200].random();
};

export const DELETE: actionsDeleteSelfHostedRunnerGroupFromOrg = async ($) => {
  return $.response[204].empty();
};
