import type { apiInsightsGetTimeStatsByActor } from "../../../../../../../types/paths/orgs/{org}/insights/api/time-stats/{actor_type}/{actor_id}.types.js";

export const GET: apiInsightsGetTimeStatsByActor = async ($) => {
  return $.response[200].random();
};
