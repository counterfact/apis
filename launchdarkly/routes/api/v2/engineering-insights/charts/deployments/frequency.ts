import type { getDeploymentFrequencyChart } from "../../../../../../types/paths/api/v2/engineering-insights/charts/deployments/frequency.types.js";

export const GET: getDeploymentFrequencyChart = async ($) => {
  return $.response[200].random();
};
