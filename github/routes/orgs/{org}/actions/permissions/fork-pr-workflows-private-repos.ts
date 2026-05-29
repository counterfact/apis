import type { actionsGetPrivateRepoForkPrWorkflowsSettingsOrganization } from "../../../../../types/paths/orgs/{org}/actions/permissions/fork-pr-workflows-private-repos.types.js";
import type { actionsSetPrivateRepoForkPrWorkflowsSettingsOrganization } from "../../../../../types/paths/orgs/{org}/actions/permissions/fork-pr-workflows-private-repos.types.js";

export const GET: actionsGetPrivateRepoForkPrWorkflowsSettingsOrganization =
  async ($) => {
    return $.response[200].random();
  };

export const PUT: actionsSetPrivateRepoForkPrWorkflowsSettingsOrganization =
  async ($) => {
    return $.response[204].empty();
  };
