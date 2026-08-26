import type { getFeatureFlagStatusAcrossEnvironments } from "../../../../../types/paths/api/v2/flag-status/{projectKey}/{featureFlagKey}.types.js";

export const GET: getFeatureFlagStatusAcrossEnvironments = async ($) => {
  return $.response[200].random();
};
