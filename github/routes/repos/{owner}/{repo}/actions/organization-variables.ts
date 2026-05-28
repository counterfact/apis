import type { actionsListRepoOrganizationVariables } from "../../../../../types/paths/repos/{owner}/{repo}/actions/organization-variables.types.js";

export const GET: actionsListRepoOrganizationVariables = async ($) => {
  return $.response[200].random();
};
