import type { actionsGetActionsCacheStorageLimitForRepository } from "../../../../../../types/paths/repos/{owner}/{repo}/actions/cache/storage-limit.types.js";
import type { actionsSetActionsCacheStorageLimitForRepository } from "../../../../../../types/paths/repos/{owner}/{repo}/actions/cache/storage-limit.types.js";

export const GET: actionsGetActionsCacheStorageLimitForRepository = async (
  $,
) => {
  return $.response[200].random();
};

export const PUT: actionsSetActionsCacheStorageLimitForRepository = async (
  $,
) => {
  return $.response[204].empty();
};
