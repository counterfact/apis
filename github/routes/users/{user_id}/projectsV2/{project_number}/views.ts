import type { projectsCreateViewForUser } from "../../../../../types/paths/users/{user_id}/projectsV2/{project_number}/views.types.js";

export const POST: projectsCreateViewForUser = async ($) => {
  return $.response[201].random();
};
