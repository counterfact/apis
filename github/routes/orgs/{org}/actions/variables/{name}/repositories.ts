import type { actionsListSelectedReposForOrgVariable } from "../../../../../../types/paths/orgs/{org}/actions/variables/{name}/repositories.types.js";
import type { actionsSetSelectedReposForOrgVariable } from "../../../../../../types/paths/orgs/{org}/actions/variables/{name}/repositories.types.js";

export const GET: actionsListSelectedReposForOrgVariable = async ($) => {
  return $.response[200].random();
};

export const PUT: actionsSetSelectedReposForOrgVariable = async ($) => {
  return $.response[204].empty();
};
