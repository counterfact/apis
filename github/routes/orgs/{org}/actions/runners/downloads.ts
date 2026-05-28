import type { actionsListRunnerApplicationsForOrg } from "../../../../../types/paths/orgs/{org}/actions/runners/downloads.types.js";

export const GET: actionsListRunnerApplicationsForOrg = async ($) => {
  return $.response[200].random();
};
