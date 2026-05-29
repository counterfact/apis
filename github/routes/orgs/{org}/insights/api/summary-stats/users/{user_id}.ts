import type { apiInsightsGetSummaryStatsByUser } from "../../../../../../../types/paths/orgs/{org}/insights/api/summary-stats/users/{user_id}.types.js";

export const GET: apiInsightsGetSummaryStatsByUser = async ($) => {
  return $.response[200].random();
};
