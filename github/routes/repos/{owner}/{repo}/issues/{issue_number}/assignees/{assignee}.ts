import type { issuesCheckUserCanBeAssignedToIssue } from "../../../../../../../types/paths/repos/{owner}/{repo}/issues/{issue_number}/assignees/{assignee}.types.js";

export const GET: issuesCheckUserCanBeAssignedToIssue = async ($) => {
  return $.response[204].empty();
};
