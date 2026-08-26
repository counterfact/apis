import type { getMetrics } from "../../../../types/paths/api/v2/metrics/{projectKey}.types.js";
import type { postMetric } from "../../../../types/paths/api/v2/metrics/{projectKey}.types.js";

export const GET: getMetrics = async ($) => {
  return $.response[200].random();
};

export const POST: postMetric = async ($) => {
  return $.response[201].random();
};
