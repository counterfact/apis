import type { getProjects } from "../../../types/paths/api/v2/projects.types.js";
import type { postProject } from "../../../types/paths/api/v2/projects.types.js";

export const GET: getProjects = async ($) => {
  return $.response[200].random();
};

export const POST: postProject = async ($) => {
  return $.response[201].random();
};
