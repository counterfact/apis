import type { issuesReprioritizeSubIssue } from "../../../../../../../types/paths/repos/{owner}/{repo}/issues/{issue_number}/sub_issues/priority.types.js";

export const PATCH: issuesReprioritizeSubIssue = async ($) => {
  return $.response[200].random();
};
