import type { apiInsightsGetSummaryStats } from "../../../../../types/paths/orgs/{org}/insights/api/summary-stats.types.js";

export const GET: apiInsightsGetSummaryStats = async ($) => {
  return $.response[200].random();
};
