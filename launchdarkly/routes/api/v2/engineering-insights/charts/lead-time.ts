import type { getLeadTimeChart } from "../../../../../types/paths/api/v2/engineering-insights/charts/lead-time.types.js";

export const GET: getLeadTimeChart = async ($) => {
  return $.response[200].random();
};
