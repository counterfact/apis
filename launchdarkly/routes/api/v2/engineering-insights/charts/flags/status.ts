import type { getFlagStatusChart } from "../../../../../../types/paths/api/v2/engineering-insights/charts/flags/status.types.js";

export const GET: getFlagStatusChart = async ($) => {
  return $.response[200].random();
};
