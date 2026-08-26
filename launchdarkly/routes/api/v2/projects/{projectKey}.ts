import type { getProject } from "../../../../types/paths/api/v2/projects/{projectKey}.types.js";
import type { patchProject } from "../../../../types/paths/api/v2/projects/{projectKey}.types.js";
import type { deleteProject } from "../../../../types/paths/api/v2/projects/{projectKey}.types.js";

export const GET: getProject = async ($) => {
  return $.response[200].random();
};

export const PATCH: patchProject = async ($) => {
  return $.response[200].random();
};

export const DELETE: deleteProject = async ($) => {
  return $.response[204].empty();
};
