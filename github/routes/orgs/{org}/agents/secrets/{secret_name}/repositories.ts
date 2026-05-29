import type { agentsListSelectedReposForOrgSecret } from "../../../../../../types/paths/orgs/{org}/agents/secrets/{secret_name}/repositories.types.js";
import type { agentsSetSelectedReposForOrgSecret } from "../../../../../../types/paths/orgs/{org}/agents/secrets/{secret_name}/repositories.types.js";

export const GET: agentsListSelectedReposForOrgSecret = async ($) => {
  return $.response[200].random();
};

export const PUT: agentsSetSelectedReposForOrgSecret = async ($) => {
  return $.response[204].empty();
};
