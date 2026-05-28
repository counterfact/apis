import type { codespacesListSelectedReposForOrgSecret } from "../../../../../../types/paths/orgs/{org}/codespaces/secrets/{secret_name}/repositories.types.js";
import type { codespacesSetSelectedReposForOrgSecret } from "../../../../../../types/paths/orgs/{org}/codespaces/secrets/{secret_name}/repositories.types.js";

export const GET: codespacesListSelectedReposForOrgSecret = async ($) => {
  return $.response[200].random();
};

export const PUT: codespacesSetSelectedReposForOrgSecret = async ($) => {
  return $.response[204].empty();
};
