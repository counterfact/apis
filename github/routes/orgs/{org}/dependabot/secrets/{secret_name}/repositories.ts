import type { dependabotListSelectedReposForOrgSecret } from "../../../../../../types/paths/orgs/{org}/dependabot/secrets/{secret_name}/repositories.types.js";
import type { dependabotSetSelectedReposForOrgSecret } from "../../../../../../types/paths/orgs/{org}/dependabot/secrets/{secret_name}/repositories.types.js";

export const GET: dependabotListSelectedReposForOrgSecret = async ($) => {
  return $.response[200].random();
};

export const PUT: dependabotSetSelectedReposForOrgSecret = async ($) => {
  return $.response[204].empty();
};
