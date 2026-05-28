import type { projectsCreateViewForOrg } from "../../../../../types/paths/orgs/{org}/projectsV2/{project_number}/views.types.js";

export const POST: projectsCreateViewForOrg = async ($) => {
  return $.response[201].random();
};
