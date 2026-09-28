import type { getMetric } from "../../../../../types/paths/api/v2/metrics/{projectKey}/{metricKey}.types.js";
import type { patchMetric } from "../../../../../types/paths/api/v2/metrics/{projectKey}/{metricKey}.types.js";
import type { deleteMetric } from "../../../../../types/paths/api/v2/metrics/{projectKey}/{metricKey}.types.js";

export const GET: getMetric = async ($) => {
  return $.response[200].random();
};

export const PATCH: patchMetric = async ($) => {
  return $.response[200].random();
};

export const DELETE: deleteMetric = async ($) => {
  return $.response[204].empty();
};
