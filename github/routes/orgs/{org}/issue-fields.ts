import type { orgsListIssueFields } from "../../../types/paths/orgs/{org}/issue-fields.types.js";
import type { orgsCreateIssueField } from "../../../types/paths/orgs/{org}/issue-fields.types.js";

export const GET: orgsListIssueFields = async ($) => {
  return $.response[200].random();
};

export const POST: orgsCreateIssueField = async ($) => {
  return $.response[200].random();
};
