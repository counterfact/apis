import type { projectsListItemsForOrg } from "../../../../../types/paths/orgs/{org}/projectsV2/{project_number}/items.types.js";
import type { projectsAddItemForOrg } from "../../../../../types/paths/orgs/{org}/projectsV2/{project_number}/items.types.js";

export const GET: projectsListItemsForOrg = async ($) => {
  return $.response[200].random();
};

export const POST: projectsAddItemForOrg = async ($) => {
  return $.response[201].random();
};
