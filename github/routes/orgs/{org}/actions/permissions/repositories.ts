import type { actionsListSelectedRepositoriesEnabledGithubActionsOrganization } from "../../../../../types/paths/orgs/{org}/actions/permissions/repositories.types.js";
import type { actionsSetSelectedRepositoriesEnabledGithubActionsOrganization } from "../../../../../types/paths/orgs/{org}/actions/permissions/repositories.types.js";

export const GET: actionsListSelectedRepositoriesEnabledGithubActionsOrganization =
  async ($) => {
    return $.response[200].random();
  };

export const PUT: actionsSetSelectedRepositoriesEnabledGithubActionsOrganization =
  async ($) => {
    return $.response[204].empty();
  };
