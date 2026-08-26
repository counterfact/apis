import type { getContextInstances } from "../../../../../../../../types/paths/api/v2/projects/{projectKey}/environments/{environmentKey}/context-instances/{id}.types.js";
import type { deleteContextInstances } from "../../../../../../../../types/paths/api/v2/projects/{projectKey}/environments/{environmentKey}/context-instances/{id}.types.js";

export const GET: getContextInstances = async ($) => {
  return $.response[200].random();
};

export const DELETE: deleteContextInstances = async ($) => {
  return $.response[204].empty();
};
