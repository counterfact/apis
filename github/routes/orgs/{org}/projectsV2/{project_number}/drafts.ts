import type { projectsCreateDraftItemForOrg } from "../../../../../types/paths/orgs/{org}/projectsV2/{project_number}/drafts.types.js";

export const POST: projectsCreateDraftItemForOrg = async ($) => {
  return $.response[201].random();
};
