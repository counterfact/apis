import type { actionsGetPrivateRepoForkPrWorkflowsSettingsRepository } from "../../../../../../types/paths/repos/{owner}/{repo}/actions/permissions/fork-pr-workflows-private-repos.types.js";
import type { actionsSetPrivateRepoForkPrWorkflowsSettingsRepository } from "../../../../../../types/paths/repos/{owner}/{repo}/actions/permissions/fork-pr-workflows-private-repos.types.js";

export const GET: actionsGetPrivateRepoForkPrWorkflowsSettingsRepository =
  async ($) => {
    return $.response[200].random();
  };

export const PUT: actionsSetPrivateRepoForkPrWorkflowsSettingsRepository =
  async ($) => {
    return $.response[204].empty();
  };
