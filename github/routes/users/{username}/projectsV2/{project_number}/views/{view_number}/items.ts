import type { projectsListViewItemsForUser } from "../../../../../../../types/paths/users/{username}/projectsV2/{project_number}/views/{view_number}/items.types.js";

export const GET: projectsListViewItemsForUser = async ($) => {
  return $.response[200].random();
};
