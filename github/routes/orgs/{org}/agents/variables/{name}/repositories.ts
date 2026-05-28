import type { agentsListSelectedReposForOrgVariable } from "../../../../../../types/paths/orgs/{org}/agents/variables/{name}/repositories.types.js";
import type { agentsSetSelectedReposForOrgVariable } from "../../../../../../types/paths/orgs/{org}/agents/variables/{name}/repositories.types.js";

export const GET: agentsListSelectedReposForOrgVariable = async ($) => {
  return $.response[200].random();
};

export const PUT: agentsSetSelectedReposForOrgVariable = async ($) => {
  return $.response[204].empty();
};
