import type { actionsGetActionsCacheUsageByRepoForOrg } from "../../../../../types/paths/orgs/{org}/actions/cache/usage-by-repository.types.js";

export const GET: actionsGetActionsCacheUsageByRepoForOrg = async ($) => {
  return $.response[200].random();
};
