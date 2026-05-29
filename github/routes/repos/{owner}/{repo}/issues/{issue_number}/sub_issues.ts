import type { issuesListSubIssues } from "../../../../../../types/paths/repos/{owner}/{repo}/issues/{issue_number}/sub_issues.types.js";
import type { issuesAddSubIssue } from "../../../../../../types/paths/repos/{owner}/{repo}/issues/{issue_number}/sub_issues.types.js";

export const GET: issuesListSubIssues = async ($) => {
  return $.response[200].random();
};

export const POST: issuesAddSubIssue = async ($) => {
  return $.response[201].random();
};
