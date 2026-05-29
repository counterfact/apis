import type { apiInsightsGetRouteStatsByActor } from "../../../../../../../types/paths/orgs/{org}/insights/api/route-stats/{actor_type}/{actor_id}.types.js";

export const GET: apiInsightsGetRouteStatsByActor = async ($) => {
  return $.response[200].random();
};
