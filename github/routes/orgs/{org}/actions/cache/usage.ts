import type { actionsGetActionsCacheUsageForOrg } from "../../../../../types/paths/orgs/{org}/actions/cache/usage.types.js";

export const GET: actionsGetActionsCacheUsageForOrg = async ($) => {
  return $.response[200].random();
};
