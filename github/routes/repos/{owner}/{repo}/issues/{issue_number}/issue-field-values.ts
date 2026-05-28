import type { issuesListIssueFieldValuesForIssue } from "../../../../../../types/paths/repos/{owner}/{repo}/issues/{issue_number}/issue-field-values.types.js";
import type { issuesAddIssueFieldValues } from "../../../../../../types/paths/repos/{owner}/{repo}/issues/{issue_number}/issue-field-values.types.js";
import type { issuesSetIssueFieldValues } from "../../../../../../types/paths/repos/{owner}/{repo}/issues/{issue_number}/issue-field-values.types.js";

export const GET: issuesListIssueFieldValuesForIssue = async ($) => {
  return $.response[200].random();
};

export const POST: issuesAddIssueFieldValues = async ($) => {
  return $.response[200].random();
};

export const PUT: issuesSetIssueFieldValues = async ($) => {
  return $.response[200].random();
};
