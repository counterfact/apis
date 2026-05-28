import type { dependabotGetOrgSecret } from "../../../../../types/paths/orgs/{org}/dependabot/secrets/{secret_name}.types.js";
import type { dependabotCreateOrUpdateOrgSecret } from "../../../../../types/paths/orgs/{org}/dependabot/secrets/{secret_name}.types.js";
import type { dependabotDeleteOrgSecret } from "../../../../../types/paths/orgs/{org}/dependabot/secrets/{secret_name}.types.js";

export const GET: dependabotGetOrgSecret = async ($) => {
  return $.response[200].random();
};

export const PUT: dependabotCreateOrUpdateOrgSecret = async ($) => {
  return $.response[201].random();
};

export const DELETE: dependabotDeleteOrgSecret = async ($) => {
  return $.response[204].empty();
};
