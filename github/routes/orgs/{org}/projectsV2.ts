import type { projectsListForOrg } from "../../../types/paths/orgs/{org}/projectsV2.types.js";

export const GET: projectsListForOrg = async ($) => {
  return $.response[200].random();
};
