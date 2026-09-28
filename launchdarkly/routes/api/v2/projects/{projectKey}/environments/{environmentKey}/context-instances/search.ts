import type { searchContextInstances } from "../../../../../../../../types/paths/api/v2/projects/{projectKey}/environments/{environmentKey}/context-instances/search.types.js";

export const POST: searchContextInstances = async ($) => {
  return $.response[200].random();
};
