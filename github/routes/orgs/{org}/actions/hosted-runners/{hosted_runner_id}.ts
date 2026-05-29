import type { actionsGetHostedRunnerForOrg } from "../../../../../types/paths/orgs/{org}/actions/hosted-runners/{hosted_runner_id}.types.js";
import type { actionsUpdateHostedRunnerForOrg } from "../../../../../types/paths/orgs/{org}/actions/hosted-runners/{hosted_runner_id}.types.js";
import type { actionsDeleteHostedRunnerForOrg } from "../../../../../types/paths/orgs/{org}/actions/hosted-runners/{hosted_runner_id}.types.js";

export const GET: actionsGetHostedRunnerForOrg = async ($) => {
  return $.response[200].random();
};

export const PATCH: actionsUpdateHostedRunnerForOrg = async ($) => {
  return $.response[200].random();
};

export const DELETE: actionsDeleteHostedRunnerForOrg = async ($) => {
  return $.response[202].random();
};
