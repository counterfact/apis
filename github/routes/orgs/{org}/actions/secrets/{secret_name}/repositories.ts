import type { actionsListSelectedReposForOrgSecret } from "../../../../../../types/paths/orgs/{org}/actions/secrets/{secret_name}/repositories.types.js";
import type { actionsSetSelectedReposForOrgSecret } from "../../../../../../types/paths/orgs/{org}/actions/secrets/{secret_name}/repositories.types.js";

export const GET: actionsListSelectedReposForOrgSecret = async ($) => {
  return $.response[200].random();
};

export const PUT: actionsSetSelectedReposForOrgSecret = async ($) => {
  return $.response[204].empty();
};
