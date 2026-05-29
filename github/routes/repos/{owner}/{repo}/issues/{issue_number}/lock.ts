import type { issuesLock } from "../../../../../../types/paths/repos/{owner}/{repo}/issues/{issue_number}/lock.types.js";
import type { issuesUnlock } from "../../../../../../types/paths/repos/{owner}/{repo}/issues/{issue_number}/lock.types.js";

export const PUT: issuesLock = async ($) => {
  return $.response[204].empty();
};

export const DELETE: issuesUnlock = async ($) => {
  return $.response[204].empty();
};
