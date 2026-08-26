import type { getFeatureFlags } from "../../../../types/paths/api/v2/flags/{projectKey}.types.js";
import type { postFeatureFlag } from "../../../../types/paths/api/v2/flags/{projectKey}.types.js";

export const GET: getFeatureFlags = async ($) => {
  return $.response[200].random();
};

export const POST: postFeatureFlag = async ($) => {
  return $.response[201].random();
};
