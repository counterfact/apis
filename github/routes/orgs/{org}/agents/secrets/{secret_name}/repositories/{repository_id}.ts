import type { agentsAddSelectedRepoToOrgSecret } from "../../../../../../../types/paths/orgs/{org}/agents/secrets/{secret_name}/repositories/{repository_id}.types.js";
import type { agentsRemoveSelectedRepoFromOrgSecret } from "../../../../../../../types/paths/orgs/{org}/agents/secrets/{secret_name}/repositories/{repository_id}.types.js";

export const PUT: agentsAddSelectedRepoToOrgSecret = async ($) => {
  return $.response[204].empty();
};

export const DELETE: agentsRemoveSelectedRepoFromOrgSecret = async ($) => {
  return $.response[204].empty();
};
