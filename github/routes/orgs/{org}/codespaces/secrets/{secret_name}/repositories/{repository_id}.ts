import type { codespacesAddSelectedRepoToOrgSecret } from "../../../../../../../types/paths/orgs/{org}/codespaces/secrets/{secret_name}/repositories/{repository_id}.types.js";
import type { codespacesRemoveSelectedRepoFromOrgSecret } from "../../../../../../../types/paths/orgs/{org}/codespaces/secrets/{secret_name}/repositories/{repository_id}.types.js";

export const PUT: codespacesAddSelectedRepoToOrgSecret = async ($) => {
  return $.response[204].empty();
};

export const DELETE: codespacesRemoveSelectedRepoFromOrgSecret = async ($) => {
  return $.response[204].empty();
};
