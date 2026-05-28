import type { issuesListDependenciesBlockedBy } from "../../../../../../../types/paths/repos/{owner}/{repo}/issues/{issue_number}/dependencies/blocked_by.types.js";
import type { issuesAddBlockedByDependency } from "../../../../../../../types/paths/repos/{owner}/{repo}/issues/{issue_number}/dependencies/blocked_by.types.js";

export const GET: issuesListDependenciesBlockedBy = async ($) => {
  return $.response[200].random();
};

export const POST: issuesAddBlockedByDependency = async ($) => {
  return $.response[201].random();
};
