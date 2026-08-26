import type { getFeatureFlagStatuses } from "../../../../../types/paths/api/v2/flag-statuses/{projectKey}/{environmentKey}.types.js";

export const GET: getFeatureFlagStatuses = async ($) => {
  return $.response[200].random();
};
