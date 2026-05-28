import type { projectsListFieldsForUser } from "../../../../../types/paths/users/{username}/projectsV2/{project_number}/fields.types.js";
import type { projectsAddFieldForUser } from "../../../../../types/paths/users/{username}/projectsV2/{project_number}/fields.types.js";

export const GET: projectsListFieldsForUser = async ($) => {
  return $.response[200].random();
};

export const POST: projectsAddFieldForUser = async ($) => {
  return $.response[201].random();
};
