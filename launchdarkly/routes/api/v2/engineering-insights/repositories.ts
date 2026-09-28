import type { getInsightsRepositories } from "../../../../types/paths/api/v2/engineering-insights/repositories.types.js";

export const GET: getInsightsRepositories = async ($) => {
  return $.response[200].random();
};
