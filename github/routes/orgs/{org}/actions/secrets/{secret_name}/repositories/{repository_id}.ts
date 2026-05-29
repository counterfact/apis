import type { actionsAddSelectedRepoToOrgSecret } from "../../../../../../../types/paths/orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}.types.js";
import type { actionsRemoveSelectedRepoFromOrgSecret } from "../../../../../../../types/paths/orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}.types.js";

export const PUT: actionsAddSelectedRepoToOrgSecret = async ($) => {
  return $.response[204].empty();
};

export const DELETE: actionsRemoveSelectedRepoFromOrgSecret = async ($) => {
  return $.response[204].empty();
};
