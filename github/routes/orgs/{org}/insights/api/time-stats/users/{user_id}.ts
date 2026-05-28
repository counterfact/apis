import type { apiInsightsGetTimeStatsByUser } from "../../../../../../../types/paths/orgs/{org}/insights/api/time-stats/users/{user_id}.types.js";

export const GET: apiInsightsGetTimeStatsByUser = async ($) => {
  return $.response[200].random();
};
