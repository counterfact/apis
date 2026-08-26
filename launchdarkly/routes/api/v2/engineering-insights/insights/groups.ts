import type { getInsightGroups } from "../../../../../types/paths/api/v2/engineering-insights/insights/groups.types.js";

export const GET: getInsightGroups = async ($) => {
  return $.response[200].random();
};
