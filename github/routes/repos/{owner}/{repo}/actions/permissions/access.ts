import type { actionsGetWorkflowAccessToRepository } from "../../../../../../types/paths/repos/{owner}/{repo}/actions/permissions/access.types.js";
import type { actionsSetWorkflowAccessToRepository } from "../../../../../../types/paths/repos/{owner}/{repo}/actions/permissions/access.types.js";

export const GET: actionsGetWorkflowAccessToRepository = async ($) => {
  return $.response[200].random();
};

export const PUT: actionsSetWorkflowAccessToRepository = async ($) => {
  return $.response[204].empty();
};
