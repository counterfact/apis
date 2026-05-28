import type { actionsListSelectedRepositoriesSelfHostedRunnersOrganization } from "../../../../../../types/paths/orgs/{org}/actions/permissions/self-hosted-runners/repositories.types.js";
import type { actionsSetSelectedRepositoriesSelfHostedRunnersOrganization } from "../../../../../../types/paths/orgs/{org}/actions/permissions/self-hosted-runners/repositories.types.js";

export const GET: actionsListSelectedRepositoriesSelfHostedRunnersOrganization =
  async ($) => {
    return $.response[200].random();
  };

export const PUT: actionsSetSelectedRepositoriesSelfHostedRunnersOrganization =
  async ($) => {
    return $.response[204].empty();
  };
