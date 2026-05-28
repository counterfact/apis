import type { actionsGetGithubActionsPermissionsOrganization } from "../../../../types/paths/orgs/{org}/actions/permissions.types.js";
import type { actionsSetGithubActionsPermissionsOrganization } from "../../../../types/paths/orgs/{org}/actions/permissions.types.js";

export const GET: actionsGetGithubActionsPermissionsOrganization = async (
  $,
) => {
  return $.response[200].random();
};

export const PUT: actionsSetGithubActionsPermissionsOrganization = async (
  $,
) => {
  return $.response[204].empty();
};
