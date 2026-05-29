import type { dependabotAddSelectedRepoToOrgSecret } from "../../../../../../../types/paths/orgs/{org}/dependabot/secrets/{secret_name}/repositories/{repository_id}.types.js";
import type { dependabotRemoveSelectedRepoFromOrgSecret } from "../../../../../../../types/paths/orgs/{org}/dependabot/secrets/{secret_name}/repositories/{repository_id}.types.js";

export const PUT: dependabotAddSelectedRepoToOrgSecret = async ($) => {
  return $.response[204].empty();
};

export const DELETE: dependabotRemoveSelectedRepoFromOrgSecret = async ($) => {
  return $.response[204].empty();
};
