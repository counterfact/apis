import type { orgsListIssueTypes } from "../../../types/paths/orgs/{org}/issue-types.types.js";
import type { orgsCreateIssueType } from "../../../types/paths/orgs/{org}/issue-types.types.js";

export const GET: orgsListIssueTypes = async ($) => {
  return $.response[200].random();
};

export const POST: orgsCreateIssueType = async ($) => {
  return $.response[200].random();
};
