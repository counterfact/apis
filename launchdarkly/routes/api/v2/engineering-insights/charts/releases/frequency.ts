import type { getReleaseFrequencyChart } from "../../../../../../types/paths/api/v2/engineering-insights/charts/releases/frequency.types.js";

export const GET: getReleaseFrequencyChart = async ($) => {
  return $.response[200].random();
};
