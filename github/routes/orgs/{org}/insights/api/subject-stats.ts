import type { apiInsightsGetSubjectStats } from "../../../../../types/paths/orgs/{org}/insights/api/subject-stats.types.js";

export const GET: apiInsightsGetSubjectStats = async ($) => {
  return $.response[200].random();
};
