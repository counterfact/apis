import type { actionsListRepoOrganizationSecrets } from "../../../../../types/paths/repos/{owner}/{repo}/actions/organization-secrets.types.js";

export const GET: actionsListRepoOrganizationSecrets = async ($) => {
  return $.response[200].random();
};
