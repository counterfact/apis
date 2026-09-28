import type { associateRepositoriesAndProjects } from "../../../../../types/paths/api/v2/engineering-insights/repositories/projects.types.js";

export const PUT: associateRepositoriesAndProjects = async ($) => {
  return $.response[200].random();
};
