import type { apiInsightsGetSummaryStatsByActor } from "../../../../../../../types/paths/orgs/{org}/insights/api/summary-stats/{actor_type}/{actor_id}.types.js";

export const GET: apiInsightsGetSummaryStatsByActor = async ($) => {
  return $.response[200].random();
};
