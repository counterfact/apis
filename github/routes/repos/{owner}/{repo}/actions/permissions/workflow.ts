import type { actionsGetGithubActionsDefaultWorkflowPermissionsRepository } from "../../../../../../types/paths/repos/{owner}/{repo}/actions/permissions/workflow.types.js";
import type { actionsSetGithubActionsDefaultWorkflowPermissionsRepository } from "../../../../../../types/paths/repos/{owner}/{repo}/actions/permissions/workflow.types.js";

export const GET: actionsGetGithubActionsDefaultWorkflowPermissionsRepository =
  async ($) => {
    return $.response[200].random();
  };

export const PUT: actionsSetGithubActionsDefaultWorkflowPermissionsRepository =
  async ($) => {
    return $.response[204].empty();
  };
