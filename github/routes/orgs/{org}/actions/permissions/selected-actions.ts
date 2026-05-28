import type { actionsGetAllowedActionsOrganization } from "../../../../../types/paths/orgs/{org}/actions/permissions/selected-actions.types.js";
import type { actionsSetAllowedActionsOrganization } from "../../../../../types/paths/orgs/{org}/actions/permissions/selected-actions.types.js";

export const GET: actionsGetAllowedActionsOrganization = async ($) => {
  return $.response[200].random();
};

export const PUT: actionsSetAllowedActionsOrganization = async ($) => {
  return $.response[204].empty();
};
