import type { getContextKindsByProjectKey } from "../../../../../types/paths/api/v2/projects/{projectKey}/context-kinds.types.js";

export const GET: getContextKindsByProjectKey = async ($) => {
  return $.response[200].random();
};
