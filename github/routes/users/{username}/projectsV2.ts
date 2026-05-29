import type { projectsListForUser } from "../../../types/paths/users/{username}/projectsV2.types.js";

export const GET: projectsListForUser = async ($) => {
  return $.response[200].random();
};
