import type { getContexts } from "../../../../../../../../../types/paths/api/v2/projects/{projectKey}/environments/{environmentKey}/contexts/{kind}/{key}.types.js";

export const GET: getContexts = async ($) => {
  return $.response[200].random();
};
