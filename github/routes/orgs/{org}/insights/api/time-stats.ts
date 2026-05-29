import type { apiInsightsGetTimeStats } from "../../../../../types/paths/orgs/{org}/insights/api/time-stats.types.js";

export const GET: apiInsightsGetTimeStats = async ($) => {
  return $.response[200].random();
};
