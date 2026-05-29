import type { issuesListAssignees } from "../../../../types/paths/repos/{owner}/{repo}/assignees.types.js";

export const GET: issuesListAssignees = async ($) => {
  return $.response[200].random();
};
