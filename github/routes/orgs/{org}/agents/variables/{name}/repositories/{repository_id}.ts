import type { agentsAddSelectedRepoToOrgVariable } from "../../../../../../../types/paths/orgs/{org}/agents/variables/{name}/repositories/{repository_id}.types.js";
import type { agentsRemoveSelectedRepoFromOrgVariable } from "../../../../../../../types/paths/orgs/{org}/agents/variables/{name}/repositories/{repository_id}.types.js";

export const PUT: agentsAddSelectedRepoToOrgVariable = async ($) => {
  return $.response[204].empty();
};

export const DELETE: agentsRemoveSelectedRepoFromOrgVariable = async ($) => {
  return $.response[204].empty();
};
