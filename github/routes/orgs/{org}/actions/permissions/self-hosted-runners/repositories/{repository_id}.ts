import type { actionsEnableSelectedRepositorySelfHostedRunnersOrganization } from "../../../../../../../types/paths/orgs/{org}/actions/permissions/self-hosted-runners/repositories/{repository_id}.types.js";
import type { actionsDisableSelectedRepositorySelfHostedRunnersOrganization } from "../../../../../../../types/paths/orgs/{org}/actions/permissions/self-hosted-runners/repositories/{repository_id}.types.js";

export const PUT: actionsEnableSelectedRepositorySelfHostedRunnersOrganization =
  async ($) => {
    return $.response[204].empty();
  };

export const DELETE: actionsDisableSelectedRepositorySelfHostedRunnersOrganization =
  async ($) => {
    return $.response[204].empty();
  };
