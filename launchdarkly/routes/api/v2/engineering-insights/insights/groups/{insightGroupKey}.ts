import type { getInsightGroup } from "../../../../../../types/paths/api/v2/engineering-insights/insights/groups/{insightGroupKey}.types.js";
import type { patchInsightGroup } from "../../../../../../types/paths/api/v2/engineering-insights/insights/groups/{insightGroupKey}.types.js";
import type { deleteInsightGroup } from "../../../../../../types/paths/api/v2/engineering-insights/insights/groups/{insightGroupKey}.types.js";

export const GET: getInsightGroup = async ($) => {
  return $.response[200].random();
};

export const PATCH: patchInsightGroup = async ($) => {
  return $.response[200].random();
};

export const DELETE: deleteInsightGroup = async ($) => {
  return $.response[204].empty();
};
