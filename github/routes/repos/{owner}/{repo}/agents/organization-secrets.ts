import type { agentsListRepoOrganizationSecrets } from "../../../../../types/paths/repos/{owner}/{repo}/agents/organization-secrets.types.js";

export const GET: agentsListRepoOrganizationSecrets = async ($) => {
  return $.response[200].random();
};
