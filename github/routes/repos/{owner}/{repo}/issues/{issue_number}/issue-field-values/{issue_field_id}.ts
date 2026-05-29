import type { issuesDeleteIssueFieldValue } from "../../../../../../../types/paths/repos/{owner}/{repo}/issues/{issue_number}/issue-field-values/{issue_field_id}.types.js";

export const DELETE: issuesDeleteIssueFieldValue = async ($) => {
  return $.response[204].empty();
};
