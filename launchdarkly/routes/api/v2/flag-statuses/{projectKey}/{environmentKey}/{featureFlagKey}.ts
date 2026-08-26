import type { getFeatureFlagStatus } from "../../../../../../types/paths/api/v2/flag-statuses/{projectKey}/{environmentKey}/{featureFlagKey}.types.js";

export const GET: getFeatureFlagStatus = async ($) => {
  return $.response[200].random();
};
