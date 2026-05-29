import type { actionsGetActionsCacheRetentionLimitForEnterprise } from "../../../../../types/paths/enterprises/{enterprise}/actions/cache/retention-limit.types.js";
import type { actionsSetActionsCacheRetentionLimitForEnterprise } from "../../../../../types/paths/enterprises/{enterprise}/actions/cache/retention-limit.types.js";

export const GET: actionsGetActionsCacheRetentionLimitForEnterprise = async (
  $,
) => {
  return $.response[200].random();
};

export const PUT: actionsSetActionsCacheRetentionLimitForEnterprise = async (
  $,
) => {
  return $.response[204].empty();
};
