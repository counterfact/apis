import type { actionsEnableSelectedRepositoryGithubActionsOrganization } from "../../../../../../types/paths/orgs/{org}/actions/permissions/repositories/{repository_id}.types.js";
import type { actionsDisableSelectedRepositoryGithubActionsOrganization } from "../../../../../../types/paths/orgs/{org}/actions/permissions/repositories/{repository_id}.types.js";

export const PUT: actionsEnableSelectedRepositoryGithubActionsOrganization =
  async ($) => {
    return $.response[204].empty();
  };

export const DELETE: actionsDisableSelectedRepositoryGithubActionsOrganization =
  async ($) => {
    return $.response[204].empty();
  };
