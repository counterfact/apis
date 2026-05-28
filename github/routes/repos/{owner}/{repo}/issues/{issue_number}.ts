import type { issuesGet } from "../../../../../types/paths/repos/{owner}/{repo}/issues/{issue_number}.types.js";
import type { issuesUpdate } from "../../../../../types/paths/repos/{owner}/{repo}/issues/{issue_number}.types.js";

export const GET: issuesGet = async ($) => {
  return $.response[200].random();
};

export const PATCH: issuesUpdate = async ($) => {
  return $.response[200].random();
};
