import type { actionsGetSelfHostedRunnerForOrg } from "../../../../../types/paths/orgs/{org}/actions/runners/{runner_id}.types.js";
import type { actionsDeleteSelfHostedRunnerFromOrg } from "../../../../../types/paths/orgs/{org}/actions/runners/{runner_id}.types.js";

export const GET: actionsGetSelfHostedRunnerForOrg = async ($) => {
  return $.response[200].random();
};

export const DELETE: actionsDeleteSelfHostedRunnerFromOrg = async ($) => {
  return $.response[204].empty();
};
