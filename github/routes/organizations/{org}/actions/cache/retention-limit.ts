import type { actionsGetActionsCacheRetentionLimitForOrganization } from "../../../../../types/paths/organizations/{org}/actions/cache/retention-limit.types.js";
import type { actionsSetActionsCacheRetentionLimitForOrganization } from "../../../../../types/paths/organizations/{org}/actions/cache/retention-limit.types.js";

export const GET: actionsGetActionsCacheRetentionLimitForOrganization = async (
  $,
) => {
  return $.response[200].random();
};

export const PUT: actionsSetActionsCacheRetentionLimitForOrganization = async (
  $,
) => {
  return $.response[204].empty();
};
