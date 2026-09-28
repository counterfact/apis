import type { getMetricGroup } from "../../../../../../types/paths/api/v2/projects/{projectKey}/metric-groups/{metricGroupKey}.types.js";
import type { patchMetricGroup } from "../../../../../../types/paths/api/v2/projects/{projectKey}/metric-groups/{metricGroupKey}.types.js";
import type { deleteMetricGroup } from "../../../../../../types/paths/api/v2/projects/{projectKey}/metric-groups/{metricGroupKey}.types.js";

export const GET: getMetricGroup = async ($) => {
  return $.response[200].random();
};

export const PATCH: patchMetricGroup = async ($) => {
  return $.response[200].random();
};

export const DELETE: deleteMetricGroup = async ($) => {
  return $.response[204].empty();
};
