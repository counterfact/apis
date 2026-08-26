import type { getFeatureFlag } from "../../../../../types/paths/api/v2/flags/{projectKey}/{featureFlagKey}.types.js";
import type { patchFeatureFlag } from "../../../../../types/paths/api/v2/flags/{projectKey}/{featureFlagKey}.types.js";
import type { deleteFeatureFlag } from "../../../../../types/paths/api/v2/flags/{projectKey}/{featureFlagKey}.types.js";

export const GET: getFeatureFlag = async ($) => {
  return $.response[200].random();
};

export const PATCH: patchFeatureFlag = async ($) => {
  return $.response[200].random();
};

export const DELETE: deleteFeatureFlag = async ($) => {
  return $.response[204].empty();
};
