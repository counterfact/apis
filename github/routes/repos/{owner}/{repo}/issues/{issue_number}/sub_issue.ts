import type { issuesRemoveSubIssue } from "../../../../../../types/paths/repos/{owner}/{repo}/issues/{issue_number}/sub_issue.types.js";

export const DELETE: issuesRemoveSubIssue = async ($) => {
  return $.response[200].random();
};
