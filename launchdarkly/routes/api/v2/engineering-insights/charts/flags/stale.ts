import type { getStaleFlagsChart } from "../../../../../../types/paths/api/v2/engineering-insights/charts/flags/stale.types.js";

export const GET: getStaleFlagsChart = async ($) => {
  return $.response[200].random();
};
