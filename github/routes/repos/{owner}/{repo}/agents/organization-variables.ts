import type { agentsListRepoOrganizationVariables } from "../../../../../types/paths/repos/{owner}/{repo}/agents/organization-variables.types.js";

export const GET: agentsListRepoOrganizationVariables = async ($) => {
  return $.response[200].random();
};
