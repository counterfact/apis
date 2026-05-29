import type { actionsListSelfHostedRunnersForOrg } from "../../../../types/paths/orgs/{org}/actions/runners.types.js";

export const GET: actionsListSelfHostedRunnersForOrg = async ($) => {
  return $.response[200].random();
};
