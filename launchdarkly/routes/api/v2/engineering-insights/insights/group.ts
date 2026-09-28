import type { createInsightGroup } from "../../../../../types/paths/api/v2/engineering-insights/insights/group.types.js";

export const POST: createInsightGroup = async ($) => {
  return $.response[201].random();
};
