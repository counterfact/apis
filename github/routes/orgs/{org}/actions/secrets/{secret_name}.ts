import type { actionsGetOrgSecret } from "../../../../../types/paths/orgs/{org}/actions/secrets/{secret_name}.types.js";
import type { actionsCreateOrUpdateOrgSecret } from "../../../../../types/paths/orgs/{org}/actions/secrets/{secret_name}.types.js";
import type { actionsDeleteOrgSecret } from "../../../../../types/paths/orgs/{org}/actions/secrets/{secret_name}.types.js";

export const GET: actionsGetOrgSecret = async ($) => {
  return $.response[200].random();
};

export const PUT: actionsCreateOrUpdateOrgSecret = async ($) => {
  return $.response[201].random();
};

export const DELETE: actionsDeleteOrgSecret = async ($) => {
  return $.response[204].empty();
};
