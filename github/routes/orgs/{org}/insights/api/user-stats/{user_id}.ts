import type { apiInsightsGetUserStats } from "../../../../../../types/paths/orgs/{org}/insights/api/user-stats/{user_id}.types.js";

export const GET: apiInsightsGetUserStats = async ($) => {
  return $.response[200].random();
};
