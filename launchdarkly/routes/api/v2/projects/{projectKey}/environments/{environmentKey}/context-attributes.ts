import type { getContextAttributeNames } from "../../../../../../../types/paths/api/v2/projects/{projectKey}/environments/{environmentKey}/context-attributes.types.js";

export const GET: getContextAttributeNames = async ($) => {
  return $.response[200].random();
};
