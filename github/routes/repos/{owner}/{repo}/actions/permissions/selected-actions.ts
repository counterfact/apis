import type { actionsGetAllowedActionsRepository } from "../../../../../../types/paths/repos/{owner}/{repo}/actions/permissions/selected-actions.types.js";
import type { actionsSetAllowedActionsRepository } from "../../../../../../types/paths/repos/{owner}/{repo}/actions/permissions/selected-actions.types.js";

export const GET: actionsGetAllowedActionsRepository = async ($) => {
  return $.response[200].random();
};

export const PUT: actionsSetAllowedActionsRepository = async ($) => {
  return $.response[204].empty();
};
