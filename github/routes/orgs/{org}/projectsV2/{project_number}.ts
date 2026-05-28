import type { projectsGetForOrg } from "../../../../types/paths/orgs/{org}/projectsV2/{project_number}.types.js";

export const GET: projectsGetForOrg = async ($) => {
  return $.response[200].random();
};
