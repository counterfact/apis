import type { actionsGetHostedRunnersMachineSpecsForOrg } from "../../../../../types/paths/orgs/{org}/actions/hosted-runners/machine-sizes.types.js";

export const GET: actionsGetHostedRunnersMachineSpecsForOrg = async ($) => {
  return $.response[200].random();
};
