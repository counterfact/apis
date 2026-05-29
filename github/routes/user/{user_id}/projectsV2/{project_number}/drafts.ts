import type { projectsCreateDraftItemForAuthenticatedUser } from "../../../../../types/paths/user/{user_id}/projectsV2/{project_number}/drafts.types.js";

export const POST: projectsCreateDraftItemForAuthenticatedUser = async ($) => {
  return $.response[201].random();
};
