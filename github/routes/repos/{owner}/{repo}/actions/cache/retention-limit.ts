import type { actionsGetActionsCacheRetentionLimitForRepository } from "../../../../../../types/paths/repos/{owner}/{repo}/actions/cache/retention-limit.types.js";
import type { actionsSetActionsCacheRetentionLimitForRepository } from "../../../../../../types/paths/repos/{owner}/{repo}/actions/cache/retention-limit.types.js";

export const GET: actionsGetActionsCacheRetentionLimitForRepository = async (
  $,
) => {
  return $.response[200].random();
};

export const PUT: actionsSetActionsCacheRetentionLimitForRepository = async (
  $,
) => {
  return $.response[204].empty();
};
