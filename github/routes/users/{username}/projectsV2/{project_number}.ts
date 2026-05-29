import type { projectsGetForUser } from "../../../../types/paths/users/{username}/projectsV2/{project_number}.types.js";

export const GET: projectsGetForUser = async ($) => {
  return $.response[200].random();
};
