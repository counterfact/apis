import type { actionsGetActionsCacheStorageLimitForOrganization } from "../../../../../types/paths/organizations/{org}/actions/cache/storage-limit.types.js";
import type { actionsSetActionsCacheStorageLimitForOrganization } from "../../../../../types/paths/organizations/{org}/actions/cache/storage-limit.types.js";

export const GET: actionsGetActionsCacheStorageLimitForOrganization = async (
  $,
) => {
  return $.response[200].random();
};

export const PUT: actionsSetActionsCacheStorageLimitForOrganization = async (
  $,
) => {
  return $.response[204].empty();
};
