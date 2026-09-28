import type { getInsightsScores } from "../../../../../types/paths/api/v2/engineering-insights/insights/scores.types.js";

export const GET: getInsightsScores = async ($) => {
  return $.response[200].random();
};
