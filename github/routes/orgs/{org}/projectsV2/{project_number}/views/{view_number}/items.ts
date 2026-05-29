import type { projectsListViewItemsForOrg } from "../../../../../../../types/paths/orgs/{org}/projectsV2/{project_number}/views/{view_number}/items.types.js";

export const GET: projectsListViewItemsForOrg = async ($) => {
  return $.response[200].random();
};
