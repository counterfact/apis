import type { actionsGetHostedRunnersLimitsForOrg } from "../../../../../types/paths/orgs/{org}/actions/hosted-runners/limits.types.js";

export const GET: actionsGetHostedRunnersLimitsForOrg = async ($) => {
  return $.response[200].random();
};
