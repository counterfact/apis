import type { actionsGetActionsCacheStorageLimitForEnterprise } from "../../../../../types/paths/enterprises/{enterprise}/actions/cache/storage-limit.types.js";
import type { actionsSetActionsCacheStorageLimitForEnterprise } from "../../../../../types/paths/enterprises/{enterprise}/actions/cache/storage-limit.types.js";

export const GET: actionsGetActionsCacheStorageLimitForEnterprise = async (
  $,
) => {
  return $.response[200].random();
};

export const PUT: actionsSetActionsCacheStorageLimitForEnterprise = async (
  $,
) => {
  return $.response[204].empty();
};
