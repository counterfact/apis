import type { actionsGetHostedRunnersPlatformsForOrg } from "../../../../../types/paths/orgs/{org}/actions/hosted-runners/platforms.types.js";

export const GET: actionsGetHostedRunnersPlatformsForOrg = async ($) => {
  return $.response[200].random();
};
