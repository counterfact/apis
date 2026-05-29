import type { projectsGetFieldForUser } from "../../../../../../types/paths/users/{username}/projectsV2/{project_number}/fields/{field_id}.types.js";

export const GET: projectsGetFieldForUser = async ($) => {
  return $.response[200].random();
};
