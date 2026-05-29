import type { issuesAddAssignees } from "../../../../../../types/paths/repos/{owner}/{repo}/issues/{issue_number}/assignees.types.js";
import type { issuesRemoveAssignees } from "../../../../../../types/paths/repos/{owner}/{repo}/issues/{issue_number}/assignees.types.js";

export const POST: issuesAddAssignees = async ($) => {
  return $.response[201].random();
};

export const DELETE: issuesRemoveAssignees = async ($) => {
  return $.response[200].random();
};
