import type { issuesCheckUserCanBeAssigned } from "../../../../../types/paths/repos/{owner}/{repo}/assignees/{assignee}.types.js";

export const GET: issuesCheckUserCanBeAssigned = async ($) => {
  return $.response[204].empty();
};
