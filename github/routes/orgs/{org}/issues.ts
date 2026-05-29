import type { issuesListForOrg } from "../../../types/paths/orgs/{org}/issues.types.js";

export const GET: issuesListForOrg = async ($) => {
  return $.response[200].random();
};
