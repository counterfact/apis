import type { orgsUpdateIssueField } from "../../../../types/paths/orgs/{org}/issue-fields/{issue_field_id}.types.js";
import type { orgsDeleteIssueField } from "../../../../types/paths/orgs/{org}/issue-fields/{issue_field_id}.types.js";

export const PATCH: orgsUpdateIssueField = async ($) => {
  return $.response[200].random();
};

export const DELETE: orgsDeleteIssueField = async ($) => {
  return $.response[204].empty();
};
