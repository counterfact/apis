import type { agentsGetOrgSecret } from "../../../../../types/paths/orgs/{org}/agents/secrets/{secret_name}.types.js";
import type { agentsCreateOrUpdateOrgSecret } from "../../../../../types/paths/orgs/{org}/agents/secrets/{secret_name}.types.js";
import type { agentsDeleteOrgSecret } from "../../../../../types/paths/orgs/{org}/agents/secrets/{secret_name}.types.js";

export const GET: agentsGetOrgSecret = async ($) => {
  return $.response[200].random();
};

export const PUT: agentsCreateOrUpdateOrgSecret = async ($) => {
  return $.response[201].random();
};

export const DELETE: agentsDeleteOrgSecret = async ($) => {
  return $.response[204].empty();
};
