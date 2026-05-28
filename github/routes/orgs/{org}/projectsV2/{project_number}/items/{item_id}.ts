import type { projectsGetOrgItem } from "../../../../../../types/paths/orgs/{org}/projectsV2/{project_number}/items/{item_id}.types.js";
import type { projectsUpdateItemForOrg } from "../../../../../../types/paths/orgs/{org}/projectsV2/{project_number}/items/{item_id}.types.js";
import type { projectsDeleteItemForOrg } from "../../../../../../types/paths/orgs/{org}/projectsV2/{project_number}/items/{item_id}.types.js";

export const GET: projectsGetOrgItem = async ($) => {
  return $.response[200].random();
};

export const PATCH: projectsUpdateItemForOrg = async ($) => {
  return $.response[200].random();
};

export const DELETE: projectsDeleteItemForOrg = async ($) => {
  return $.response[204].empty();
};
