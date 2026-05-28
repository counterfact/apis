import type { actionsGetGithubActionsDefaultWorkflowPermissionsOrganization } from "../../../../../types/paths/orgs/{org}/actions/permissions/workflow.types.js";
import type { actionsSetGithubActionsDefaultWorkflowPermissionsOrganization } from "../../../../../types/paths/orgs/{org}/actions/permissions/workflow.types.js";

export const GET: actionsGetGithubActionsDefaultWorkflowPermissionsOrganization =
  async ($) => {
    return $.response[200].random();
  };

export const PUT: actionsSetGithubActionsDefaultWorkflowPermissionsOrganization =
  async ($) => {
    return $.response[204].empty();
  };
