import type { issuesRemoveDependencyBlockedBy } from "../../../../../../../../types/paths/repos/{owner}/{repo}/issues/{issue_number}/dependencies/blocked_by/{issue_id}.types.js";

export const DELETE: issuesRemoveDependencyBlockedBy = async ($) => {
  return $.response[200].random();
};
