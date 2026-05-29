import type { projectsListFieldsForOrg } from "../../../../../types/paths/orgs/{org}/projectsV2/{project_number}/fields.types.js";
import type { projectsAddFieldForOrg } from "../../../../../types/paths/orgs/{org}/projectsV2/{project_number}/fields.types.js";

export const GET: projectsListFieldsForOrg = async ($) => {
  return $.response[200].random();
};

export const POST: projectsAddFieldForOrg = async ($) => {
  return $.response[201].random();
};
