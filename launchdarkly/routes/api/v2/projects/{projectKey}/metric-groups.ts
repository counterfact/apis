import type { getMetricGroups } from "../../../../../types/paths/api/v2/projects/{projectKey}/metric-groups.types.js";
import type { createMetricGroup } from "../../../../../types/paths/api/v2/projects/{projectKey}/metric-groups.types.js";

export const GET: getMetricGroups = async ($) => {
  return $.response[200].random();
};

export const POST: createMetricGroup = async ($) => {
  return $.response[201].random();
};
