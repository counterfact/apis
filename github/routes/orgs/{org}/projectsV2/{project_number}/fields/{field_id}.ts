import type { projectsGetFieldForOrg } from "../../../../../../types/paths/orgs/{org}/projectsV2/{project_number}/fields/{field_id}.types.js";

export const GET: projectsGetFieldForOrg = async ($) => {
  return $.response[200].random();
};
