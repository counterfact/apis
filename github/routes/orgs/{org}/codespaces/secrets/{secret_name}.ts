import type { codespacesGetOrgSecret } from "../../../../../types/paths/orgs/{org}/codespaces/secrets/{secret_name}.types.js";
import type { codespacesCreateOrUpdateOrgSecret } from "../../../../../types/paths/orgs/{org}/codespaces/secrets/{secret_name}.types.js";
import type { codespacesDeleteOrgSecret } from "../../../../../types/paths/orgs/{org}/codespaces/secrets/{secret_name}.types.js";

export const GET: codespacesGetOrgSecret = async ($) => {
  return $.response[200].random();
};

export const PUT: codespacesCreateOrUpdateOrgSecret = async ($) => {
  return $.response[201].random();
};

export const DELETE: codespacesDeleteOrgSecret = async ($) => {
  return $.response[204].empty();
};
