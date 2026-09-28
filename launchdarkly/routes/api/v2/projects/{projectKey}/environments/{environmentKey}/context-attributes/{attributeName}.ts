import type { getContextAttributeValues } from "../../../../../../../../types/paths/api/v2/projects/{projectKey}/environments/{environmentKey}/context-attributes/{attributeName}.types.js";

export const GET: getContextAttributeValues = async ($) => {
  return $.response[200].random();
};
