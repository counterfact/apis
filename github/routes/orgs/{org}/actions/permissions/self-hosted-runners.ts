import type { actionsGetSelfHostedRunnersPermissionsOrganization } from "../../../../../types/paths/orgs/{org}/actions/permissions/self-hosted-runners.types.js";
import type { actionsSetSelfHostedRunnersPermissionsOrganization } from "../../../../../types/paths/orgs/{org}/actions/permissions/self-hosted-runners.types.js";

export const GET: actionsGetSelfHostedRunnersPermissionsOrganization = async (
  $,
) => {
  return $.response[200].random();
};

export const PUT: actionsSetSelfHostedRunnersPermissionsOrganization = async (
  $,
) => {
  return $.response[204].empty();
};
