import type { projectsGetUserItem } from "../../../../../../types/paths/users/{username}/projectsV2/{project_number}/items/{item_id}.types.js";
import type { projectsUpdateItemForUser } from "../../../../../../types/paths/users/{username}/projectsV2/{project_number}/items/{item_id}.types.js";
import type { projectsDeleteItemForUser } from "../../../../../../types/paths/users/{username}/projectsV2/{project_number}/items/{item_id}.types.js";

export const GET: projectsGetUserItem = async ($) => {
  return $.response[200].random();
};

export const PATCH: projectsUpdateItemForUser = async ($) => {
  return $.response[200].random();
};

export const DELETE: projectsDeleteItemForUser = async ($) => {
  return $.response[204].empty();
};
