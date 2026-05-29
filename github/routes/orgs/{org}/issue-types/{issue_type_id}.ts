import type { orgsUpdateIssueType } from "../../../../types/paths/orgs/{org}/issue-types/{issue_type_id}.types.js";
import type { orgsDeleteIssueType } from "../../../../types/paths/orgs/{org}/issue-types/{issue_type_id}.types.js";

export const PUT: orgsUpdateIssueType = async ($) => {
  return $.response[200].random();
};

export const DELETE: orgsDeleteIssueType = async ($) => {
  return $.response[204].empty();
};
