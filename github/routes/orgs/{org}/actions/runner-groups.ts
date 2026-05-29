import type { actionsListSelfHostedRunnerGroupsForOrg } from "../../../../types/paths/orgs/{org}/actions/runner-groups.types.js";
import type { actionsCreateSelfHostedRunnerGroupForOrg } from "../../../../types/paths/orgs/{org}/actions/runner-groups.types.js";

export const GET: actionsListSelfHostedRunnerGroupsForOrg = async ($) => {
  return $.response[200].random();
};

export const POST: actionsCreateSelfHostedRunnerGroupForOrg = async ($) => {
  return $.response[201].random();
};
