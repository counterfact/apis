import type { searchContexts } from "../../../../../../../../types/paths/api/v2/projects/{projectKey}/environments/{environmentKey}/contexts/search.types.js";

export const POST: searchContexts = async ($) => {
  return $.response[200].random();
};
