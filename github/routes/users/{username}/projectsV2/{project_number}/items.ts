import type { projectsListItemsForUser } from "../../../../../types/paths/users/{username}/projectsV2/{project_number}/items.types.js";
import type { projectsAddItemForUser } from "../../../../../types/paths/users/{username}/projectsV2/{project_number}/items.types.js";

export const GET: projectsListItemsForUser = async ($) => {
  return $.response[200].random();
};

export const POST: projectsAddItemForUser = async ($) => {
  return $.response[201].random();
};
