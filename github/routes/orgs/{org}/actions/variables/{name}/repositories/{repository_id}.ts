import type { actionsAddSelectedRepoToOrgVariable } from "../../../../../../../types/paths/orgs/{org}/actions/variables/{name}/repositories/{repository_id}.types.js";
import type { actionsRemoveSelectedRepoFromOrgVariable } from "../../../../../../../types/paths/orgs/{org}/actions/variables/{name}/repositories/{repository_id}.types.js";

export const PUT: actionsAddSelectedRepoToOrgVariable = async ($) => {
  return $.response[204].empty();
};

export const DELETE: actionsRemoveSelectedRepoFromOrgVariable = async ($) => {
  return $.response[204].empty();
};
