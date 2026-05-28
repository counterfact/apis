import type { actionsListHostedRunnersForOrg } from "../../../../types/paths/orgs/{org}/actions/hosted-runners.types.js";
import type { actionsCreateHostedRunnerForOrg } from "../../../../types/paths/orgs/{org}/actions/hosted-runners.types.js";

export const GET: actionsListHostedRunnersForOrg = async ($) => {
  return $.response[200].random();
};

export const POST: actionsCreateHostedRunnerForOrg = async ($) => {
  return $.response[201].random();
};
